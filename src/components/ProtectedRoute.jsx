import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    // Logged in, but wrong role for this dashboard — send them to their own.
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }
  return children;
}
