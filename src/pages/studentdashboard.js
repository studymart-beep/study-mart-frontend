import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import HomeSection from './HomeSection';
import LearningSection from './LearningSection';

const MOCK_POSTS = [
  {
    id: '1',
    content: 'Welcome to Study Mart! This is a sample post.',
    image_url: null,
    likes: 5,
    comments: 2,
    created_at: new Date().toISOString(),
    user: {
      id: '1',
      full_name: 'Admin User',
      avatar_url: null,
      role: 'admin'
    }
  },
  {
    id: '2',
    content: 'Learning React is fun! Join our community.',
    image_url: null,
    likes: 3,
    comments: 1,
    created_at: new Date().toISOString(),
    user: {
      id: '2',
      full_name: 'John Student',
      avatar_url: null,
      role: 'student'
    }
  }
];

const MOCK_PROFILE = {
  id: '1',
  full_name: 'Test User',
  email: 'user@example.com',
  avatar_url: null,
  role: 'student'
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [feedPosts, setFeedPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [feedError, setFeedError] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [posting, setPosting] = useState(false);

  const [hoveredButton, setHoveredButton] = useState(null);
  const [pressedButton, setPressedButton] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      if (activeSection === 'home') {
        fetchFeed();
      }
    }
  }, [user, activeSection]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success) {
        setProfileData(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile, using mock data:', error);
      setProfileData(MOCK_PROFILE);
    }
  };

  const fetchFeed = async () => {
    setLoadingFeed(true);
    setFeedError(null);
    try {
      const response = await api.get('/posts/feed');
      if (response.data.success) {
        setFeedPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching feed, using mock data:', error);
      setFeedPosts(MOCK_POSTS);
    } finally {
      setLoadingFeed(false);
    }
  };

  const handleCreatePost = async (postData) => {
    setPosting(true);
    try {
      const response = await api.post('/posts', {
        content: postData.content,
        image_url: postData.media_url || null,
        video_url: postData.media_type === 'video' ? postData.media_url : null,
        media_type: postData.media_type || 'text'
      });
      
      if (response.data.success) {
        setNewPostContent('');
        setNewPostImage(null);
        fetchFeed();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      const newPost = {
        id: Date.now().toString(),
        content: postData.content,
        image_url: postData.media_url || null,
        likes: 0,
        comments: 0,
        created_at: new Date().toISOString(),
        user: {
          id: user?.id || '1',
          full_name: user?.profile?.full_name || 'Current User',
          avatar_url: null,
          role: 'student'
        }
      };
      setFeedPosts([newPost, ...feedPosts]);
      setNewPostContent('');
      setNewPostImage(null);
    } finally {
      setPosting(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      if (response.data.success) {
        setFeedPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  liked: !post.liked,
                  likes: post.liked ? post.likes - 1 : post.likes + 1
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setFeedPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1
              }
            : post
        )
      );
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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <Navbar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setShowProfile={setShowProfile}
        profileData={profileData}
        showNotifications={showNotifications}
        toggleNotifications={toggleNotifications}
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
            feedPosts={feedPosts}
            loadingFeed={loadingFeed}
            feedError={feedError}
            newPostContent={newPostContent}
            setNewPostContent={setNewPostContent}
            newPostImage={newPostImage}
            setNewPostImage={setNewPostImage}
            posting={posting}
            handleCreatePost={handleCreatePost}
            handleLikePost={handleLikePost}
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
};