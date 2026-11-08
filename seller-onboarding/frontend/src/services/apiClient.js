// Centralized Axios configuration. Every API module imports this one instance.
import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

// Public values only (they are visible in the browser).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the login token (issued by the backend) to every request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the backend says the token is invalid/expired, log the user out.
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthCall = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

// Turns any error into a friendly message for the UI.
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.isMock) return error.message;
  if (error?.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the server. Check your connection or the backend URL.';
  return error?.response?.data?.message || error?.message || fallback;
}

export default apiClient;
