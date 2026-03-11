import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [pressedButton, setPressedButton] = useState(null);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const result = await signUp(email, password, fullName);
      if (result.success) {
        navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonMouseEnter = (buttonName) => {
    setHoveredButton(buttonName);
  };

  const handleButtonMouseLeave = () => {
    setHoveredButton(null);
    setPressedButton(null);
  };

  const handleButtonMouseDown = (buttonName) => {
    setPressedButton(buttonName);
  };

  const handleButtonMouseUp = () => {
    setPressedButton(null);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = ['#EF4444', '#F59E0B', '#FCD34D', '#10B981', '#2ECC71'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div style={styles.container}>
      {/* Animated Background Elements */}
      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>
      <div style={styles.backgroundGrid}></div>
      
      <div style={styles.card}>
        {/* Logo Section */}
        <div style={styles.logoContainer}>
          <img src="/images/logo.jpg" alt="StudyMart" style={styles.logo} />
          <h1 style={styles.title}>StudyMart</h1>
        </div>

        <h2 style={styles.subtitle}>Create Account</h2>
        <p style={styles.welcomeText}>Join our learning community today</p>

        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
              />
            </div>
            {password && (
              <div style={styles.strengthContainer}>
                <div style={styles.strengthBars}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      style={{
                        ...styles.strengthBar,
                        backgroundColor: level <= passwordStrength ? strengthColors[passwordStrength - 1] : '#E2E8F0',
                        width: level <= passwordStrength ? '25%' : '25%',
                      }}
                    />
                  ))}
                </div>
                <span style={styles.strengthText}>
                  {strengthLabels[passwordStrength - 1] || 'Enter password'}
                </span>
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
              />
            </div>
            {confirmPassword && (
              <div style={styles.matchIndicator}>
                {password === confirmPassword ? (
                  <span style={styles.matchSuccess}>✓ Passwords match</span>
                ) : (
                  <span style={styles.matchError}>✗ Passwords do not match</span>
                )}
              </div>
            )}
          </div>

          <div style={styles.termsContainer}>
            <input type="checkbox" id="terms" style={styles.checkbox} required />
            <label htmlFor="terms" style={styles.termsLabel}>
              I agree to the{' '}
              <Link to="/terms" style={styles.termsLink}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" style={styles.termsLink}>Privacy Policy</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(hoveredButton === 'register' ? styles.buttonHover : {}),
              ...(pressedButton === 'register' ? styles.buttonPressed : {}),
              ...(loading ? styles.buttonDisabled : {})
            }}
            onMouseEnter={() => handleButtonMouseEnter('register')}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown('register')}
            onMouseUp={handleButtonMouseUp}
          >
            {loading ? (
              <div style={styles.loaderContainer}>
                <div style={styles.loader}></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or sign up with</span>
            <span style={styles.dividerLine}></span>
          </div>

          <div style={styles.socialButtons}>
            <button
              type="button"
              style={{
                ...styles.socialButton,
                ...styles.googleButton,
                ...(hoveredButton === 'google' ? styles.socialButtonHover : {}),
                ...(pressedButton === 'google' ? styles.socialButtonPressed : {})
              }}
              onMouseEnter={() => handleButtonMouseEnter('google')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('google')}
              onMouseUp={handleButtonMouseUp}
            >
              <span style={styles.socialIcon}>G</span>
              <span>Google</span>
            </button>
            
            <button
              type="button"
              style={{
                ...styles.socialButton,
                ...styles.githubButton,
                ...(hoveredButton === 'github' ? styles.socialButtonHover : {}),
                ...(pressedButton === 'github' ? styles.socialButtonPressed : {})
              }}
              onMouseEnter={() => handleButtonMouseEnter('github')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('github')}
              onMouseUp={handleButtonMouseUp}
            >
              <span style={styles.socialIcon}>⌨️</span>
              <span>GitHub</span>
            </button>
          </div>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div style={styles.cardGlow}></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: '20px',
  },
  backgroundGlow1: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(46,204,113,0.25) 0%, rgba(255,107,53,0.15) 50%, transparent 70%)',
    borderRadius: '50%',
    animation: 'float 25s ease-in-out infinite',
  },
  backgroundGlow2: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '700px',
    height: '700px',
    background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(30,58,138,0.1) 50%, transparent 70%)',
    borderRadius: '50%',
    animation: 'float 20s ease-in-out infinite reverse',
  },
  backgroundGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    animation: 'gridMove 20s linear infinite',
  },
  card: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    padding: '48px',
    borderRadius: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(46, 204, 113, 0.2)',
    width: '100%',
    maxWidth: '480px',
    zIndex: 10,
    overflow: 'hidden',
    animation: 'slideUp 0.6s ease-out',
  },
  cardGlow: {
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle at top right, rgba(46,204,113,0.1), transparent 70%)',
    pointerEvents: 'none',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
  },
  logo: {
    height: '70px',
    width: 'auto',
    marginBottom: '16px',
    filter: 'drop-shadow(0 8px 16px rgba(37,99,235,0.3))',
    animation: 'pulse 3s ease-in-out infinite',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #2ECC71 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '8px',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: '16px',
    color: '#64748B',
    marginBottom: '32px',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    border: '1px solid #F87171',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    animation: 'shake 0.3s ease-in-out',
  },
  errorIcon: {
    fontSize: '18px',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: '14px',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: '4px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '18px',
    color: '#64748B',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 48px',
    border: '2px solid #E2E8F0',
    borderRadius: '16px',
    fontSize: '15px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.2s ease',
    outline: 'none',
    ':focus': {
      borderColor: '#2ECC71',
      boxShadow: '0 0 0 4px rgba(46,204,113,0.2)',
      transform: 'scale(1.02)',
    },
    ':hover': {
      borderColor: '#FF6B35',
    },
  },
  strengthContainer: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  strengthBars: {
    display: 'flex',
    gap: '4px',
    height: '4px',
  },
  strengthBar: {
    flex: 1,
    height: '100%',
    borderRadius: '2px',
    transition: 'background-color 0.3s ease',
  },
  strengthText: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: '500',
  },
  matchIndicator: {
    marginTop: '4px',
    fontSize: '12px',
  },
  matchSuccess: {
    color: '#2ECC71',
    fontWeight: '500',
  },
  matchError: {
    color: '#EF4444',
    fontWeight: '500',
  },
  termsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px',
  },
  termsLabel: {
    fontSize: '14px',
    color: '#4B5563',
    lineHeight: '1.5',
  },
  termsLink: {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#FF6B35',
      textDecoration: 'underline',
    },
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#2ECC71',
    cursor: 'pointer',
  },
  button: {
    padding: '16px',
    background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 20px rgba(46,204,113,0.3)',
    marginTop: '8px',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonHover: {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 12px 30px rgba(255,107,53,0.4)',
  },
  buttonPressed: {
    transform: 'translateY(2px) scale(0.98)',
    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    background: 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)',
  },
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  loader: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid #FFFFFF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '16px 0',
  },
  dividerLine: {
    flex: 1,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #E2E8F0, #E2E8F0, #E2E8F0, transparent)',
  },
  dividerText: {
    color: '#64748B',
    fontSize: '14px',
    fontWeight: '500',
  },
  socialButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  socialButton: {
    padding: '14px',
    border: '2px solid #E2E8F0',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#FFFFFF',
  },
  socialButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(46,204,113,0.2)',
    borderColor: '#2ECC71',
  },
  socialButtonPressed: {
    transform: 'translateY(2px) scale(0.98)',
  },
  googleButton: {
    color: '#1E293B',
  },
  githubButton: {
    color: '#1E293B',
  },
  socialIcon: {
    fontSize: '18px',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '15px',
    color: '#4B5563',
  },
  link: {
    color: '#2ECC71',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#FF6B35',
      textDecoration: 'underline',
    },
  },
};

// Global animations
const globalStyles = `
  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(120deg); }
    66% { transform: translate(-20px, 20px) rotate(240deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(40px, 40px); }
  }
  
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 8px 16px rgba(37,99,235,0.3)); }
    50% { transform: scale(1.05); filter: drop-shadow(0 12px 24px rgba(46,204,113,0.4)); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}