import apiClient, { USE_MOCK } from './apiClient';
import { ENDPOINTS } from './endpoints';
import * as mock from '../mocks/mockApi';

// BACKEND: GET /seller/profile  → {id,email,fullName}
export async function getProfile() {
  if (USE_MOCK) return mock.getProfile();
  const { data } = await apiClient.get(ENDPOINTS.seller.profile);
  return data;
}

// BACKEND: PUT /seller/profile  body {fullName}  → {id,email,fullName}
export async function updateProfile(payload) {
  if (USE_MOCK) return mock.updateProfile(payload);
  const { data } = await apiClient.put(ENDPOINTS.seller.profile, payload);
  return data;
}
