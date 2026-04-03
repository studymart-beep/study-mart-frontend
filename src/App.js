import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Guest from './pages/guest';
import Login from './pages/login';
import Register from './pages/register';
import StudentDashboard from './pages/studentdashboard';
import PaymentVerify from './pages/paymentverify';
import SellerApplicationCallback from './pages/sellerapplicationcallback';
import CoursePage from './pages/CoursePage';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (user) {
    const userRole = user.profile?.role || 'student';
    
    if (userRole === 'admin') {
      window.location.href = 'https://study-mart-admin.vercel.app';
      return null;
    }

    return (
      <Router>
        <Routes>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/payment/verify" element={<PaymentVerify />} />
          <Route path="/seller/application/payment-callback" element={<SellerApplicationCallback />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Guest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment/verify" element={<PaymentVerify />} />
        <Route path="/seller/application/payment-callback" element={<SellerApplicationCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  loading: {
    fontSize: '18px',
    color: '#6366f1',
    fontWeight: '500',
  }
};

export default App;