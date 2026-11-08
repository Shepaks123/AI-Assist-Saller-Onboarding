import apiClient, { USE_MOCK } from './apiClient';
import { ENDPOINTS } from './endpoints';
import * as mock from '../mocks/mockApi';

// BACKEND: POST /documents/upload   (multipart/form-data: file, type)
//          → { id, name, size, type }
// Files go to the BACKEND, which stores them (local disk, S3, Supabase Storage…).
// Storage credentials never touch the frontend.
export async function uploadDocument(file, type, onProgress) {
  if (USE_MOCK) return mock.uploadDocument(file, type, onProgress);
  const form = new FormData();
  form.append('file', file);
  form.append('type', type);
  const { data } = await apiClient.post(ENDPOINTS.documents.upload, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
  });
  return data;
}
