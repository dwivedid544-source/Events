// Dynamic API URL: Uses localhost when running locally, and Railway in production
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isLocalhost ? 'http://localhost:5050/api/v1' : 'https://event-backend-production-c45c.up.railway.app/api/v1');
export const CLOVER_MERCHANT_ID = import.meta.env.VITE_CLOVER_MERCHANT_ID || '526695041883';

export default {
  API_BASE_URL,
  CLOVER_MERCHANT_ID
};

