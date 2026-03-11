import React from 'react';
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
  const { user } = useAuth();

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <img src="/images/logo.jpg" alt="StudyMart" style={styles.logoImage} />
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
          <button 
            style={{
              ...styles.navButton,
              ...(activeSection === 'marketplace' ? styles.navButtonActive : {}),
              ...(hoveredButton === 'nav-marketplace' ? styles.navButtonHover : {}),
              ...(pressedButton === 'nav-marketplace' ? styles.navButtonPressed : {})
            }}
            onClick={() => setActiveSection('marketplace')}
            onMouseEnter={() => handleButtonMouseEnter('nav-marketplace')}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown('nav-marketplace')}
            onMouseUp={handleButtonMouseUp}
          >
            Marketplace
          </button>
          <button 
            style={{
              ...styles.navButton,
              ...(activeSection === 'community' ? styles.navButtonActive : {}),
              ...(hoveredButton === 'nav-community' ? styles.navButtonHover : {}),
              ...(pressedButton === 'nav-community' ? styles.navButtonPressed : {})
            }}
            onClick={() => setActiveSection('community')}
            onMouseEnter={() => handleButtonMouseEnter('nav-community')}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown('nav-community')}
            onMouseUp={handleButtonMouseUp}
          >
            Community
          </button>
        </div>
        <button 
          onClick={() => setShowProfile(true)} 
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
            {profileData.avatar_url ? <img src={profileData.avatar_url} alt="Avatar" style={styles.avatarSmallImage} /> : <span>👤</span>}
          </div>
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'linear-gradient(90deg, #1E3A8A 0%, #2563EB 100%)',
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
  logoImage: {
    height: '45px',
    width: 'auto',
    cursor: 'pointer',
    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))',
    transition: 'all 0.3s ease',
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
    letterSpacing: '0.3px',
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
    transform: 'scale(1.05)',
  },
  profileButtonPressed: {
    transform: 'scale(0.98)',
    background: 'rgba(46, 204, 113, 0.5)',
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    '@media (max-width: 768px)': {
      display: 'none',
    },
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
};