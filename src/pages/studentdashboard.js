import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import HomeSection from './HomeSection';
import LearningSection from './LearningSection';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  
  // Create post state (if you want to keep posting functionality)
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [posting, setPosting] = useState(false);

  // Button interaction states
  const [hoveredButton, setHoveredButton] = useState(null);
  const [pressedButton, setPressedButton] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success) {
        setProfileData(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleCreatePost = async (postData) => {
    setPosting(true);
    try {
      const response = await api.post('/posts', {
        content: postData.content,
        image_url: postData.media_url || null,
      });
      
      if (response.data.success) {
        setNewPostContent('');
        setNewPostImage(null);
        alert('Post created successfully!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleButtonMouseEnter = (buttonId) => {
    setHoveredButton(buttonId);
  };

  const handleButtonMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleButtonMouseDown = (buttonId) => {
    setPressedButton(buttonId);
  };

  const handleButtonMouseUp = () => {
    setPressedButton(null);
  };

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setShowProfile={setShowProfile}
        profileData={profileData}
        hoveredButton={hoveredButton}
        pressedButton={pressedButton}
        handleButtonMouseEnter={handleButtonMouseEnter}
        handleButtonMouseLeave={handleButtonMouseLeave}
        handleButtonMouseDown={handleButtonMouseDown}
        handleButtonMouseUp={handleButtonMouseUp}
      />
      
      <div style={styles.content}>
        {activeSection === 'home' && (
          <HomeSection 
            newPostContent={newPostContent}
            setNewPostContent={setNewPostContent}
            newPostImage={newPostImage}
            setNewPostImage={setNewPostImage}
            posting={posting}
            handleCreatePost={handleCreatePost}
            hoveredButton={hoveredButton}
            pressedButton={pressedButton}
            handleButtonMouseEnter={handleButtonMouseEnter}
            handleButtonMouseLeave={handleButtonMouseLeave}
            handleButtonMouseDown={handleButtonMouseDown}
            handleButtonMouseUp={handleButtonMouseUp}
          />
        )}
        
        {activeSection === 'learning' && (
          <LearningSection 
            hoveredButton={hoveredButton}
            pressedButton={pressedButton}
            handleButtonMouseEnter={handleButtonMouseEnter}
            handleButtonMouseLeave={handleButtonMouseLeave}
            handleButtonMouseDown={handleButtonMouseDown}
            handleButtonMouseUp={handleButtonMouseUp}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  loadingContainer: {
    display: 'flex',
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
  },
};

const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}