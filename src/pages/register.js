import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signUp(email, password, fullName);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="Study Mart" className="logo-img" />
          <h1 className="app-name">Study Mart</h1>
          <p className="tagline">Learn. Buy. Grow.</p>
        </div>
        <h2>Create Account</h2>
        <p>Join our learning community</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>

      <style>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .register-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          width: 90%;
          max-width: 420px;
        }
        .logo-wrapper {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo-img {
          width: 70px;
          height: 70px;
          border-radius: 15px;
          object-fit: cover;
        }
        .app-name {
          font-size: 28px;
          font-weight: bold;
          color: #667eea;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        .tagline {
          color: #888;
          font-size: 12px;
          letter-spacing: 1px;
        }
        h2 {
          font-size: 24px;
          color: #333;
          margin-bottom: 8px;
        }
        p {
          color: #666;
          margin-bottom: 25px;
        }
        .input-group {
          margin-bottom: 20px;
        }
        input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        .auth-footer {
          margin-top: 20px;
          text-align: center;
          color: #666;
        }
        .auth-footer a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}