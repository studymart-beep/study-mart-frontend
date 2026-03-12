import React, { useState } from 'react';

export default function CommunitySection({ 
  feedPosts,
  loadingFeed,
  feedError,
  newPostContent,
  setNewPostContent,
  newPostImage,
  setNewPostImage,
  posting,
  handleCreatePost,
  handleLikePost,
  groups,
  loadingGroups,
  messages,
  loadingMessages,
  topContributors,
  events,
  handleJoinGroup,
  handleLeaveGroup,
  handleCreateGroup,
  handleAttendEvent,
  handleViewProfile,
  hoveredButton,
  pressedButton,
  handleButtonMouseEnter,
  handleButtonMouseLeave,
  handleButtonMouseDown,
  handleButtonMouseUp
}) {
  const [communityTab, setCommunityTab] = useState('home');

  // Modern SVG-like logo icons (Font Awesome style)
  const tabs = [
    { 
      id: 'home', 
      icon: '🏠', 
      label: 'Home', 
      activeColor: '#25D366',
      bgColor: 'rgba(37, 211, 102, 0.1)'
    },
    { 
      id: 'channel', 
      icon: '📺', 
      label: 'Channel', 
      activeColor: '#FF6B35',
      bgColor: 'rgba(255, 107, 53, 0.1)'
    },
    { 
      id: 'reels', 
      icon: '🎬', 
      label: 'Reels', 
      activeColor: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)'
    },
    { 
      id: 'people', 
      icon: '👥', 
      label: 'People', 
      activeColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    { 
      id: 'chat', 
      icon: '💬', 
      label: 'Chat', 
      activeColor: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Welcome Header - KEPT ORIGINAL */}
      <div style={styles.welcomeHeader}>
        <h1 style={styles.welcomeTitle}>Welcome to Study Mart Community</h1>
        <p style={styles.welcomeSubtitle}>Connect, Learn, Grow Together</p>
      </div>

      {/* Modern Logo Tabs */}
      <div style={styles.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCommunityTab(tab.id)}
            style={{
              ...styles.tab,
              ...(communityTab === tab.id ? {
                ...styles.tabActive,
                backgroundColor: tab.bgColor,
                borderBottomColor: tab.activeColor
              } : {}),
              ...(hoveredButton === `tab-${tab.id}` ? styles.tabHover : {}),
              ...(pressedButton === `tab-${tab.id}` ? styles.tabPressed : {})
            }}
            onMouseEnter={() => handleButtonMouseEnter(`tab-${tab.id}`)}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown(`tab-${tab.id}`)}
            onMouseUp={handleButtonMouseUp}
            title={tab.label}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
          </button>
        ))}
      </div>

      {/* Rest of the component remains the same */}
      {/* ... (keep all the existing tab content code below) ... */}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    overflow: 'hidden',
  },

  // Welcome Header - KEPT ORIGINAL
  welcomeHeader: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px 12px 0 0',
    color: 'white',
  },
  welcomeTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
    '@media (max-width: 768px)': {
      fontSize: '28px',
    },
  },
  welcomeSubtitle: {
    fontSize: '18px',
    opacity: 0.95,
    '@media (max-width: 768px)': {
      fontSize: '16px',
    },
  },

  // Modern Tab Bar
  tabBar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '12px 8px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    borderRadius: '8px 8px 0 0',
    margin: '0 4px',
  },
  tabActive: {
    borderBottom: '3px solid',
    transform: 'translateY(-2px)',
  },
  tabHover: {
    backgroundColor: '#f1f5f9',
    transform: 'scale(1.05)',
  },
  tabPressed: {
    transform: 'scale(0.95)',
  },
  tabIcon: {
    fontSize: '28px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
    '@media (max-width: 480px)': {
      fontSize: '24px',
    },
  },

  // ... (keep all the existing styles for content below)
  // The rest of the styles remain exactly the same
};