import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import HomeSection from './HomeSection';
import LearningSection from './LearningSection';
import MarketplaceSection from './MarketplaceSection';
import CommunitySection from './CommunitySection';
import ChatWindow from '../components/ChatWindow';
import Notifications from '../components/Notifications';
import SellerApplicationModal from '../components/SellerApplicationModal';
import SellerDashboard from '../components/SellerDashboard';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showSellerDashboard, setShowSellerDashboard] = useState(false);
  
  // Feed state
  const [feedPosts, setFeedPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [feedError, setFeedError] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [posting, setPosting] = useState(false);
  
  // Groups state
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  
  // Messages state
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // People state
  const [topContributors, setTopContributors] = useState([]);
  const [events, setEvents] = useState([]);

  // Button interaction states
  const [hoveredButton, setHoveredButton] = useState(null);
  const [pressedButton, setPressedButton] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      if (activeSection === 'home') {
        fetchFeed();
      } else if (activeSection === 'community') {
        fetchGroups();
        fetchMessages();
      } else if (activeSection === 'people') {
        fetchTopContributors();
        fetchEvents();
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
      console.error('Error fetching profile:', error);
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
      console.error('Error fetching feed:', error);
      setFeedError('Failed to load feed. Please try again.');
    } finally {
      setLoadingFeed(false);
    }
  };

  // FIXED: Now accepts data object instead of event
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
    }
  };

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await api.get('/groups');
      if (response.data.success) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await api.get('/messages');
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchTopContributors = async () => {
    try {
      const response = await api.get('/community/top-contributors');
      if (response.data.success) {
        setTopContributors(response.data.contributors);
      }
    } catch (error) {
      console.error('Error fetching top contributors:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await api.post(`/groups/${groupId}/join`);
      if (response.data.success) {
        fetchGroups();
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const response = await api.post(`/groups/${groupId}/leave`);
      if (response.data.success) {
        fetchGroups();
      }
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleCreateGroup = () => {
    alert('Create group functionality coming soon!');
  };

  const handleAttendEvent = async (eventId) => {
    try {
      const response = await api.post(`/events/${eventId}/attend`);
      if (response.data.success) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error attending event:', error);
    }
  };

  const handleViewProfile = (userId) => {
    console.log('View profile:', userId);
  };

  // Button interaction handlers
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
        
        {activeSection === 'marketplace' && (
          <MarketplaceSection 
            hoveredButton={hoveredButton}
            pressedButton={pressedButton}
            handleButtonMouseEnter={handleButtonMouseEnter}
            handleButtonMouseLeave={handleButtonMouseLeave}
            handleButtonMouseDown={handleButtonMouseDown}
            handleButtonMouseUp={handleButtonMouseUp}
          />
        )}
        
        {activeSection === 'community' && (
          <CommunitySection 
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
            groups={groups}
            loadingGroups={loadingGroups}
            messages={messages}
            loadingMessages={loadingMessages}
            topContributors={topContributors}
            events={events}
            handleJoinGroup={handleJoinGroup}
            handleLeaveGroup={handleLeaveGroup}
            handleCreateGroup={handleCreateGroup}
            handleAttendEvent={handleAttendEvent}
            handleViewProfile={handleViewProfile}
            hoveredButton={hoveredButton}
            pressedButton={pressedButton}
            handleButtonMouseEnter={handleButtonMouseEnter}
            handleButtonMouseLeave={handleButtonMouseLeave}
            handleButtonMouseDown={handleButtonMouseDown}
            handleButtonMouseUp={handleButtonMouseUp}
          />
        )}
      </div>

      {/* Modals */}
      {showNotifications && (
        <Notifications onClose={() => setShowNotifications(false)} />
      )}

      {showSellerModal && (
        <SellerApplicationModal onClose={() => setShowSellerModal(false)} />
      )}

      {showSellerDashboard && (
        <SellerDashboard onClose={() => setShowSellerDashboard(false)} />
      )}
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