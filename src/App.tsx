import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicVerificationPage } from './pages/PublicVerificationPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CertificateViewPage } from './pages/CertificateViewPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Certificate Verification Routes */}
        <Route path="/" element={<PublicVerificationPage />} />
        <Route path="/verify/:rollNumber" element={<PublicVerificationPage />} />
        <Route path="/certificate/:rollNumber" element={<CertificateViewPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
