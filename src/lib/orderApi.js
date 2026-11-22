import { API_URL } from '@/config';

async function request(path, options = {}, timeoutMs = 15000) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    signal: AbortSignal.timeout(timeoutMs),
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    /* not JSON */
  }
  return { status: response.status, ok: response.ok, body };
}

async function getJson(path) {
  const res = await request(path);
  if (!res.ok || !res.body?.success) throw new Error(`GET ${path} failed (${res.status})`);
  return res.body;
}

export const getStatus = () => getJson('/public/status');
export const getMenu = () => getJson('/public/menu');

// Resolves with { status, ok, body }; rejects only when the server can't be reached.
export const createOrder = (payload) =>
  request('/public/orders', { method: 'POST', body: JSON.stringify(payload) }, 20000);
