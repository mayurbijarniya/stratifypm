import { useAuthStore } from '../stores/authStore';

type ApiErrorPayload = {
  error?: string;
  retryAfter?: number;
};

const parseJson = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return {};
  }
  return JSON.parse(text);
};

const getToken = () => useAuthStore.getState().token;

export const requestOtp = async (email: string) => {
  const response = await fetch('/api/auth/request-otp', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = (await parseJson(response)) as ApiErrorPayload & { expiresIn?: number };
  if (!response.ok) {
    throw Object.assign(new Error(data.error || 'Failed to send code'), data);
  }

  return data;
};

export const verifyOtp = async (email: string, code: string) => {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });

  const data = (await parseJson(response)) as ApiErrorPayload & {
    token?: string;
    user?: { id: string; email: string; createdAt: string };
  };

  if (!response.ok || !data.token || !data.user) {
    throw Object.assign(new Error(data.error || 'Invalid code'), data);
  }

  return data;
};

export const getSession = async (token?: string | null) => {
  const authToken = token || getToken();
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
  });

  const data = (await parseJson(response)) as ApiErrorPayload & {
    user?: { id: string; email: string; createdAt: string };
  };

  if (!response.ok || !data.user) {
    throw Object.assign(new Error(data.error || 'Session invalid'), data);
  }

  return data.user;
};

export const logout = async (token?: string | null) => {
  const authToken = token || getToken();
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
  });
};
