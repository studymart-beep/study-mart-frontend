import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  activeSection, 
  setActiveSection, 
  setShowProfile, 
  profileData,
  hoveredButton,
  pressedButton,
  handleButtonMouseEnter,
  handleButtonMouseLeave,
  handleButtonMouseDown,
  handleButtonMouseUp
}) {
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleLogout = () => signOut();

  const handleThemeChange = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested');
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        {/* Logo Section */}
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Study Mart" style={styles.logoImage} />
          <div>
            <span style={styles.logoText}>Study Mart</span>
            <span style={styles.logoSubtext}>Learn. Buy. Grow.</span>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        {user && (
          <div style={styles.navButtons}>
            <button 
              style={{
                ...styles.navButton,
                ...(activeSection === 'home' ? styles.navButtonActive : {}),
                ...(hoveredButton === 'nav-home' ? styles.navButtonHover : {}),
                ...(pressedButton === 'nav-home' ? styles.navButtonPressed : {})
              }}
              onClick={() => setActiveSection('home')}
              onMouseEnter={() => handleButtonMouseEnter('nav-home')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('nav-home')}
              onMouseUp={handleButtonMouseUp}
            >
              Home
            </button>
            <button 
              style={{
                ...styles.navButton,
                ...(activeSection === 'learning' ? styles.navButtonActive : {}),
                ...(hoveredButton === 'nav-learning' ? styles.navButtonHover : {}),
                ...(pressedButton === 'nav-learning' ? styles.navButtonPressed : {})
              }}
              onClick={() => setActiveSection('learning')}
              onMouseEnter={() => handleButtonMouseEnter('nav-learning')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('nav-learning')}
              onMouseUp={handleButtonMouseUp}
            >
              Learning
            </button>
          </div>
        )}

        {/* Right Section - Profile Dropdown */}
        {user && (
          <div style={styles.rightSection}>
            <div style={styles.profileContainer}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  ...styles.profileButton,
                  ...(hoveredButton === 'profile' ? styles.profileButtonHover : {}),
                  ...(pressedButton === 'profile' ? styles.profileButtonPressed : {})
                }}
                onMouseEnter={() => handleButtonMouseEnter('profile')}
                onMouseLeave={handleButtonMouseLeave}
                onMouseDown={() => handleButtonMouseDown('profile')}
                onMouseUp={handleButtonMouseUp}
              >
                <span style={styles.userName}>{user?.profile?.full_name || 'Profile'}</span>
                <div style={styles.avatarSmall}>
                  {profileData.avatar_url ? (
                    <img src={profileData.avatar_url} alt="Avatar" style={styles.avatarSmallImage} />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
              </button>

              {showProfileMenu && (
                <div style={styles.dropdownMenu}>
                  <button 
                    onClick={() => {
                      setShowProfile(true);
                      setShowProfileMenu(false);
                    }}
                    style={styles.menuItem}
                  >
                    <span style={styles.menuIcon}>⚙️</span> Settings
                  </button>
                  
                  <button 
                    onClick={handleThemeChange}
                    style={styles.menuItem}
                  >
                    <span style={styles.menuIcon}>🎨</span> Theme ({theme})
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    style={styles.menuItem}
                  >
                    <span style={styles.menuIcon}>🚪</span> Logout
                  </button>

                  <button 
                    onClick={handleDeleteAccount}
                    style={{...styles.menuItem, ...styles.deleteItem}}
                  >
                    <span style={styles.menuIcon}>🗑️</span> Delete Account
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'linear-gradient(90deg, #6366f1 0%, #2563EB 100%)',
    padding: '0.8rem 0',
    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '8px 20px',
    borderRadius: '50px',
    backdropFilter: 'blur(5px)',
  },
  logoImage: {
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  logoText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    display: 'block',
    letterSpacing: '0.5px',
  },
  logoSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '10px',
    display: 'block',
  },
  navButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  navButton: {
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(5px)',
  },
  navButtonHover: {
    background: 'rgba(255, 255, 255, 0.25)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)',
  },
  navButtonPressed: {
    transform: 'translateY(2px) scale(0.98)',
    background: 'rgba(46, 204, 113, 0.4)',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)',
  },
  navButtonActive: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  profileContainer: {
    position: 'relative',
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '40px',
    padding: '5px 20px 5px 5px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(5px)',
  },
  profileButtonHover: {
    background: 'rgba(46, 204, 113, 0.3)',
    borderColor: '#2ECC71',
    transform: 'scale(1.02)',
  },
  profileButtonPressed: {
    transform: 'scale(0.98)',
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
  avatarSmall: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  avatarSmallImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '50px',
    right: 0,
    width: '220px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    padding: '8px',
    zIndex: 1000,
    border: '1px solid rgba(0,0,0,0.05)',
  },
  menuItem: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
  },
  menuIcon: {
    fontSize: '18px',
    width: '24px',
    textAlign: 'center',
  },
  deleteItem: {
    color: '#ef4444',
    borderTop: '1px solid #e2e8f0',
    marginTop: '4px',
    paddingTop: '12px',
  },
};