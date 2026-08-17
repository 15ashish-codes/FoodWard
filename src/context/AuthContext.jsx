import React, { createContext, useContext, useState } from "react";

/*
  Frontend-only auth state. In production, `login()` should be called
  with the response from POST /api/auth/login or /api/auth/signup
  (Spring Boot), storing the JWT (e.g. in memory + httpOnly cookie,
  not localStorage) alongside the user's role and name.
*/

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { role: 'hotel'|'orphanage'|'volunteer'|'admin', name }

  function login(role, name) {
    setUser({ role, name: name || "Foodward User" });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
