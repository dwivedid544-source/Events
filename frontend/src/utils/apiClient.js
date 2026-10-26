import { API_BASE_URL } from '../config';

/**
 * Centralized API client helper for Ultimate Hound Club frontend.
 * - Attaches `Authorization: Bearer <token>` for requests to API_BASE_URL.
 * - Does not attach tokens to external third-party URLs.
 * - Handles HTTP 401 (Unauthorized) and 403 (Forbidden) consistently.
 * - Returns structured error messages from backend responses.
 */

// Event listener target for authentication events (e.g., session expiration)
export const AUTH_EXPIRED_EVENT = 'uhc_auth_session_expired';

export const getAuthToken = () => {
  try {
    return localStorage.getItem('nh_token') || null;
  } catch (e) {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('nh_token', token);
    } else {
      localStorage.removeItem('nh_token');
    }
  } catch (e) {
    console.warn('Unable to persist auth token:', e);
  }
};

export const clearAuthSession = () => {
  try {
    localStorage.removeItem('nh_token');
    localStorage.removeItem('nh_currentUser');
  } catch (e) {
    console.warn('Unable to clear auth session:', e);
  }
};

/**
 * Internal request wrapper
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const isInternalApi = url.startsWith(API_BASE_URL);
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Only attach Bearer token to internal backend requests
  if (isInternalApi && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkErr) {
    console.error(`[API Network Error] ${options.method || 'GET'} ${url}:`, networkErr.message);
    throw new Error(`Network connection error: Unable to reach backend service (${networkErr.message})`);
  }

  // Handle 401 Unauthorized
  if (response.status === 401) {
    if (isInternalApi && token) {
      // Discard expired/invalid token
      clearAuthSession();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT, { detail: { endpoint, status: 401 } }));
      }
    }
    let errorData;
    try {
      errorData = await response.json();
    } catch (_) {}
    const message = errorData?.error?.message || errorData?.message || 'Authentication required or session expired. Please sign in again.';
    const err = new Error(message);
    err.status = 401;
    err.data = errorData;
    throw err;
  }

  // Handle 403 Forbidden
  if (response.status === 403) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (_) {}
    const message = errorData?.error?.message || errorData?.message || 'Access forbidden: You do not have permissions for this resource.';
    const err = new Error(message);
    err.status = 403;
    err.data = errorData;
    throw err;
  }

  // Parse JSON response
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (parseErr) {
      throw new Error(`Failed to parse response from server (${parseErr.message})`);
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.error?.message || data?.message || `Request failed with HTTP status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, {
    ...options,
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body)
  }),
  put: (endpoint, body, options = {}) => request(endpoint, {
    ...options,
    method: 'PUT',
    body: typeof body === 'string' ? body : JSON.stringify(body)
  }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' })
};

export default apiClient;
