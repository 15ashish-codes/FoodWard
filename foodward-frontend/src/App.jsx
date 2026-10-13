import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CompanyPages from "./pages/CompanyPages.jsx";
import LegalPages from "./pages/LegalPages.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ProfileSettingsPage from "./pages/ProfileSettingsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import HotelDashboard from "./pages/dashboards/HotelDashboard.jsx";
import OrphanageDashboard from "./pages/dashboards/OrphanageDashboard.jsx";
import VolunteerDashboard from "./pages/dashboards/VolunteerDashboard.jsx";
import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />

          {/* Company / legal — same tabbed components, different initial tab per route */}
          <Route path="/about" element={<CompanyPages initialTab="about" />} />
          <Route path="/contact" element={<CompanyPages initialTab="contact" />} />
          <Route path="/faq" element={<CompanyPages initialTab="faq" />} />
          <Route path="/privacy" element={<LegalPages initialTab="privacy" />} />
          <Route path="/terms" element={<LegalPages initialTab="terms" />} />

          {/* Shared, auth-aware but not role-gated */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<ProfileSettingsPage />} />

          {/* Role-gated dashboards */}
          <Route
            path="/dashboard/hotel"
            element={
              <ProtectedRoute role="hotel">
                <HotelDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orphanage"
            element={
              <ProtectedRoute role="orphanage">
                <OrphanageDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/volunteer"
            element={
              <ProtectedRoute role="volunteer">
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
