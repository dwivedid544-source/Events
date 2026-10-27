const DEFAULT_RAILWAY_API = 'https://event-management-backend-production-5108.up.railway.app/api/v1';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_RAILWAY_API;
export const CLOVER_MERCHANT_ID = import.meta.env.VITE_CLOVER_MERCHANT_ID || '526695041883';

export default {
  API_BASE_URL,
  CLOVER_MERCHANT_ID
};

