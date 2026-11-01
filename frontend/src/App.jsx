import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout, DashboardLayout } from './layouts';

// Protected Route Guard
import { ProtectedRoute } from './components';

// Pages
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import OverviewPage from './pages/Overview';
import MyProfilePage from './pages/MyProfile';
import NotificationPage from './pages/Notification';
import SettingPage from './pages/Setting';

/**
 * EduMitra AI - Root Application Component
 * Architecturally separates Public and Protected Routes with reusable Layouts.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Dashboard Routes with DashboardLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/my-profile" element={<MyProfilePage />} />
            <Route path="/profile" element={<Navigate to="/my-profile" replace />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/settings" element={<SettingPage />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
