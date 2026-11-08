import apiClient, { USE_MOCK } from './apiClient';
import { ENDPOINTS } from './endpoints';
import * as mock from '../mocks/mockApi';

// BACKEND: GET /onboarding/status
// → { status, currentStep, draft, feedback, missingRequirements[], submittedAt, updatedAt }
export async function getStatus() {
  if (USE_MOCK) return mock.getStatus();
  const { data } = await apiClient.get(ENDPOINTS.onboarding.status);
  return data;
}

// BACKEND: PUT /onboarding/draft  body {currentStep, draft}  → same shape as getStatus
export async function saveDraft(payload) {
  if (USE_MOCK) return mock.saveDraft(payload);
  const { data } = await apiClient.put(ENDPOINTS.onboarding.draft, payload);
  return data;
}

// BACKEND: POST /onboarding/submit  body {draft}  → same shape as getStatus
export async function submit(payload) {
  if (USE_MOCK) return mock.submit(payload);
  const { data } = await apiClient.post(ENDPOINTS.onboarding.submit, payload);
  return data;
}
