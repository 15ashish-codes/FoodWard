import React, { createContext, useContext, useState } from "react";

/*
  Now backed by a real JWT from the Spring Boot API instead of in-memory
  role selection. Token + user are persisted to localStorage so a page
  refresh doesn't log the user out.

  NOTE: localStorage is used here for simplicity. For production, consider
  an httpOnly cookie set by the backend instead, to reduce XSS exposure —
  that requires a small backend change (Set-Cookie on login) and switching
  this context + api.js away from manually attaching the Authorization
  header. Documented as a known tradeoff, not fixed here.
*/

const AuthContext = createContext(null);
const TOKEN_KEY = "foodward_token";
const USER_KEY = "foodward_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  // Call with the raw API response: login(token, user) where
  // user.role comes back from the backend as "HOTEL" | "ORPHANAGE" | "VOLUNTEER" | "ADMIN".
  // Normalized to lowercase here so it matches the route params used across
  // the app (/dashboard/hotel, /dashboard/orphanage, etc.)
  function login(newToken, newUser) {
    const normalized = { ...newUser, role: newUser.role.toLowerCase() };
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    setToken(newToken);
    setUser(normalized);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
