import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import pages
import Guest from './pages/guest';
import Login from './pages/login';
import Register from './pages/register';
import StudentDashboard from './pages/studentdashboard';
import PaymentVerify from './pages/paymentverify';
import SellerApplicationCallback from './pages/sellerapplicationcallback';

function AppContent() {
  const { user, loading } = useAuth();
  
  // Handle email confirmation redirect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      window.location.href = '/login';
    }
  }, []);

  console.log('AppContent - User:', user);
  console.log('AppContent - User role:', user?.profile?.role);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  // If user is logged in, show student dashboard
  if (user) {
    // Redirect admins to separate admin site
    if (user.profile?.role === 'admin') {
      window.location.href = 'https://study-mart-admin.vercel.app';
      return null;
    }

    // Student user - show student dashboard
    return (
      <Router>
        <Routes>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/payment/verify" element={<PaymentVerify />} />
          <Route path="/seller/application/payment-callback" element={<SellerApplicationCallback />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    );
  }

  // User is NOT logged in - show guest page
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