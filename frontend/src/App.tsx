import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { SmartAccessPage } from './pages/SmartAccessPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { AccessHistoryPage } from './pages/AccessHistoryPage';
import { SecurityAlertsPage } from './pages/SecurityAlertsPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen cyber-bg flex items-center justify-center text-cyan-400 font-mono text-sm">
        Authenticating Secure Telematics Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Landing & Authentication */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated User Telematics Suite */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/smart-access" element={<SmartAccessPage />} />
              <Route path="/ai-insights" element={<AIInsightsPage />} />
              <Route path="/access-history" element={<AccessHistoryPage />} />
              <Route path="/security-alerts" element={<SecurityAlertsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
