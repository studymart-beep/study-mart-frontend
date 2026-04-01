import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signIn(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-wrapper">
          <img src="/Study Mart.png" alt="Study Mart" className="logo-img" />
          <h1 className="app-name">Study Mart</h1>
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to continue your learning journey</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .login-card {
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
          border-radius: 50%;
          object-fit: cover;
        }
        .app-name {
          font-size: 28px;
          font-weight: bold;
          color: #667eea;
          margin-top: 10px;
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