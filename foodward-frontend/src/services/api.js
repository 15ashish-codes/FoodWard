/**
 * Thin fetch wrapper for the Foodward API. No axios dependency needed —
 * plain fetch is enough for this surface area.
 *
 * Reads the backend URL from VITE_API_BASE_URL (see .env.example).
 * Reads/writes the JWT via the same localStorage key AuthContext uses.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const TOKEN_KEY = "foodward_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    // Backend's GlobalExceptionHandler returns { error: "..." } or
    // { error: "Validation failed", fields: {...} } — surface the best message.
    const message =
      (data && data.fields && Object.values(data.fields)[0]) ||
      (data && data.error) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  del: (path) => request(path, { method: "DELETE" }),
};
