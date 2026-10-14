// src/lib/upload.js
import api from './api';

/**
 * Upload a single file
 * @returns {Promise<{url, filename, originalName, mimeType, size}>}
 */
export async function uploadSingle(file) {
  const formData = new FormData();
  formData.append('file', file);

  // Use raw axios for multipart because our api client sets JSON content-type
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('ncg_token');

  const res = await fetch(`${API_URL}/uploads/single`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Upload failed');
  return data.data;
}

export async function uploadMultiple(files) {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append('files', f));

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('ncg_token');

  const res = await fetch(`${API_URL}/uploads/multiple`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Upload failed');
  return data.data;
}

export async function listMedia() {
  const res = await api.get('/uploads/list');
  return res.data || [];
}