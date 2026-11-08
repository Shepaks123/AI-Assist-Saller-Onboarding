import apiClient, { USE_MOCK } from './apiClient';
import { ENDPOINTS } from './endpoints';
import * as mock from '../mocks/mockApi';

// BACKEND: POST /auth/register  body {fullName,email,password}  → {token,user}
export async function register(payload) {
  if (USE_MOCK) return mock.register(payload);
  const { data } = await apiClient.post(ENDPOINTS.auth.register, payload);
  return data;
}

// BACKEND: POST /auth/login  body {email,password}  → {token,user}
export async function login(payload) {
  if (USE_MOCK) return mock.login(payload);
  const { data } = await apiClient.post(ENDPOINTS.auth.login, payload);
  return data;
}
