import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function SellerApplicationCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(location.search);
      const reference = params.get('reference');
      if (!reference) {
        alert('No reference found');
        navigate('/dashboard?section=marketplace');
        return;
      }

      try {
        const response = await api.get(`/seller/verify-application-payment?reference=${reference}`);
        if (response.data.success) {
          alert('Application fee paid! Your request is under review.');
          navigate('/dashboard?section=marketplace');
        } else {
          alert('Payment verification failed');
          navigate('/dashboard?section=marketplace');
        }
      } catch (error) {
        console.error('Verification error:', error);
        alert('Error verifying payment');
        navigate('/dashboard?section=marketplace');
      }
    };

    verify();
  }, [location, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.loader}></div>
      <p style={styles.text}>Verifying your payment...</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  text: {
    fontSize: '16px',
    color: '#333',
  },
};