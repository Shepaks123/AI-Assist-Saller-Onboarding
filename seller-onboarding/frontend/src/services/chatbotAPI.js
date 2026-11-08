import apiClient, { USE_MOCK } from './apiClient';
import { ENDPOINTS } from './endpoints';
import * as mock from '../mocks/mockApi';

// BACKEND: POST /ai/chat  body {message, step, history[]}  → {reply, suggestions[]}
// The BACKEND calls the AI provider (Gemini) with its private key.
// The browser never sees that key.
export async function sendMessage({ message, step, history }) {
  if (USE_MOCK) return mock.chat({ message, step, history });
  const { data } = await apiClient.post(ENDPOINTS.ai.chat, { message, step, history });
  return data;
}
