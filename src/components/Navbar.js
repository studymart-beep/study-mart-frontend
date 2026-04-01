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

  const handleLogout = () => signOut();

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Study Mart" style={styles.logoImage} />
          <span style={styles.logoText}>Study Mart</span>
        </div>
        
        {/* Navigation Buttons */}
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

        {/* Profile */}
        <div style={styles.rightSection}>
          <div style={styles.profileContainer}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={styles.profileButton}
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
                <button onClick={() => { setShowProfile(true); setShowProfileMenu(false); }} style={styles.menuItem}>
                  <span style={styles.menuIcon}>⚙️</span> Settings
                </button>
                <button onClick={handleLogout} style={styles.menuItem}>
                  <span style={styles.menuIcon}>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'linear-gradient(90deg, #6366f1 0%, #2563EB 100%)',
    padding: '0.8rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.1)',
    padding: '5px 16px',
    borderRadius: '40px',
  },
  logoImage: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  logoText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navButtons: {
    display: 'flex',
    gap: '8px',
  },
  navButton: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  navButtonHover: {
    background: 'rgba(255,255,255,0.25)',
    transform: 'translateY(-2px)',
  },
  navButtonPressed: {
    transform: 'translateY(2px) scale(0.98)',
  },
  navButtonActive: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '40px',
    padding: '5px 20px 5px 5px',
    cursor: 'pointer',
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
    width: '200px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    padding: '8px',
    zIndex: 1000,
  },
  menuItem: {
    width: '100%',
    padding: '12px 16px',
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
  },
};