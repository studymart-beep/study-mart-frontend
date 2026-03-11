import React, { useState } from 'react';
import api from '../services/api';

export default function SellerApplicationModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    category: '',
    location: '',
    payment_details: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('📝 Submitting seller application...');
    console.log('📋 Form data:', formData);

    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token being used:', token ? 'Present' : 'Missing');

      const response = await api.post('/seller/apply', formData);
      
      console.log('✅ Application response:', response.data);
      
      if (response.data.success) {
        // Redirect to Paystack
        window.location.href = response.data.authorization_url;
      } else {
        setError('Application failed');
      }
    } catch (error) {
      console.error('❌ Application error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        setError('You need to be logged in to apply. Please log in and try again.');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error submitting application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Become a Seller</h2>
        <button onClick={onClose} style={styles.closeButton}>×</button>
        
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              name="full_name" 
              value={formData.full_name} 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Business Name</label>
            <input 
              type="text" 
              name="business_name" 
              value={formData.business_name} 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Category (e.g., Electronics, Fashion)</label>
            <input 
              type="text" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Location</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Payment Details (Bank Account)</label>
            <textarea 
              name="payment_details" 
              value={formData.payment_details} 
              onChange={handleChange} 
              required 
              style={styles.textarea}
              placeholder="Account Name, Bank, Account Number"
            />
          </div>
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? 'Processing...' : 'Next (Pay ₦1,000)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    border: '1px solid #fecaca',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginTop: '5px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginTop: '5px',
    minHeight: '80px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};