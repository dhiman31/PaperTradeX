/**
 * api.js
 *
 * Base URL:
 * VITE_API_BASE_URL
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ---------- TOKEN ----------

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

// ---------- CORE FETCH ----------

async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token
      ? {
          'x-access-token': token,
        }
      : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;

    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  if (res.status === 204) return null;

  return res.json();
}

// ---------- AUTH ----------

export async function registerUser(payload) {
  return apiFetch('/user/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  const response = await apiFetch('/user/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (response?.data) {
    setToken(response.data);
  }

  return response;
}

export async function logoutUser() {
  removeToken();
}

// ---------- EMAIL VERIFICATION ----------

export async function initiateVerification() {
  return apiFetch('/user/initiateVerification', {
    method: 'POST',
  });
}

export async function verifyViaOTP(otp) {
  const response = await apiFetch(
    '/user/verifyViaOTP',
    {
      method: 'POST',
      body: JSON.stringify({
        otp: Number(otp),
      }),
    }
  );
  if (response?.data) {
    setToken(response.data);
  }
  return response;
}

// ---------- MARKET ----------

export async function fetchMarketSymbols({
  page = 1,
  limit = 20,
  sort,
  order,
} = {}) {
  const params = new URLSearchParams({
    page,
    limit,
  });

  if (sort) params.set('sort', sort);

  if (order) params.set('order', order);

  return apiFetch(`/market/symbols?${params}`);
}

export async function fetchSymbolPrice(symbol) {
  return apiFetch(`/prices/${symbol}`);
}

// ---------- ORDERS ----------

export async function fetchOrderHistory({
  page = 1,
  limit = 20,
} = {}) {
  const params = new URLSearchParams({
    page,
    limit,
  });

  return apiFetch(`/orders?${params}`);
}

export async function placeOrder(
  payload,
  orderType = 'MARKET'
) {
  const endpoint =
    orderType === 'LIMIT'
      ? '/orders/market/limit'
      : '/orders/market';

  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---------- PORTFOLIO ----------

export async function fetchPortfolio() {
  return apiFetch('/portfolio');
}