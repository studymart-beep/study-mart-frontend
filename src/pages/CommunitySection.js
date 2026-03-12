import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PeopleSection from './PeopleSection';
import ChatWindow from '../components/ChatWindow';
import CommunityProfile from '../components/CommunityProfile';

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
  const { user } = useAuth();
  const [communityTab, setCommunityTab] = useState('home');
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);

  // Modern realistic tabs with glass morphism
  const tabs = [
    { 
      id: 'home', 
      icon: '🏠', 
      label: 'Home', 
      activeColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      iconColor: '#667eea'
    },
    { 
      id: 'channel', 
      icon: '📺', 
      label: 'Channel', 
      activeColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      iconColor: '#f093fb'
    },
    { 
      id: 'reels', 
      icon: '🎬', 
      label: 'Reels', 
      activeColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      iconColor: '#4facfe'
    },
    { 
      id: 'people', 
      icon: '👥', 
      label: 'People', 
      activeColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      iconColor: '#43e97b'
    },
    { 
      id: 'chat', 
      icon: '💬', 
      label: 'Chat', 
      activeColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      iconColor: '#fa709a'
    }
  ];

  useEffect(() => {
    if (communityTab === 'chat') {
      fetchConversations();
      fetchUnreadCount();
    }
  }, [communityTab]);

  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const response = await api.get('/messages/conversations');
      if (response.data.success) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/unread/count');
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const openChat = (chatUser) => {
    setSelectedChatUser(chatUser);
    setShowChat(true);
  };

  const handleViewUserProfile = (userId) => {
    setSelectedProfileUserId(userId);
    setShowProfileModal(true);
  };

  const handleStartChat = (user) => {
    setSelectedChatUser(user);
    setShowChat(true);
  };

  return (
    <div style={styles.container}>
      {/* Welcome Header - Premium Gradient */}
      <div style={styles.welcomeHeader}>
        <h1 style={styles.welcomeTitle}>Welcome to Study Mart Community</h1>
        <p style={styles.welcomeSubtitle}>Connect, Learn, Grow Together</p>
        <div style={styles.headerGlow}></div>
      </div>

      {/* Premium Glass-Morphism Tab Bar */}
      <div style={styles.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCommunityTab(tab.id)}
            style={{
              ...styles.tab,
              ...(communityTab === tab.id ? {
                ...styles.tabActive,
                background: tab.activeColor,
                boxShadow: `0 10px 20px -5px ${tab.iconColor}80`
              } : {}),
              ...(hoveredButton === `tab-${tab.id}` && communityTab !== tab.id ? styles.tabHover : {}),
              ...(pressedButton === `tab-${tab.id}` ? styles.tabPressed : {})
            }}
            onMouseEnter={() => handleButtonMouseEnter(`tab-${tab.id}`)}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown(`tab-${tab.id}`)}
            onMouseUp={handleButtonMouseUp}
            title={tab.label}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            {tab.id === 'chat' && unreadCount > 0 && (
              <span style={styles.unreadBadge}>{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        {/* HOME TAB - Feed */}
        {communityTab === 'home' && (
          <div style={styles.feedContainer}>
            <div style={styles.feedHeader}>
              <h2 style={styles.sectionTitle}>🏠 Home Feed</h2>
            </div>

            {/* Create Post Card */}
            <div style={styles.createPostCard}>
              <textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                style={styles.postInput}
                rows="2"
              />
              <div style={styles.postActions}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPostImage(e.target.files[0])}
                  id="post-image"
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => document.getElementById('post-image').click()}
                  style={styles.iconButton}
                  title="Add Image"
                >
                  📷
                </button>
                {newPostImage && (
                  <span style={styles.fileName}>{newPostImage.name}</span>
                )}
                <button
                  onClick={handleCreatePost}
                  disabled={posting || !newPostContent.trim()}
                  style={{
                    ...styles.postButton,
                    ...(posting || !newPostContent.trim() ? styles.disabled : {})
                  }}
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>

            {/* Feed Posts */}
            {loadingFeed ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
              </div>
            ) : feedError ? (
              <div style={styles.errorMessage}>{feedError}</div>
            ) : feedPosts.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No posts yet. Be the first to post!</p>
              </div>
            ) : (
              feedPosts.map(post => (
                <div key={post.id} style={styles.postCard}>
                  <div style={styles.postHeader} onClick={() => handleViewUserProfile(post.user_id)}>
                    <div style={styles.avatar}>
                      {post.user?.avatar_url ? (
                        <img src={post.user.avatar_url} alt="avatar" style={styles.avatarImage} />
                      ) : (
                        <span style={styles.avatarPlaceholder}>👤</span>
                      )}
                    </div>
                    <div style={styles.postInfo}>
                      <h4 style={styles.authorName}>
                        {post.user?.full_name || 'Unknown'}
                        <span style={styles.authorRole}> • {post.user?.role || 'member'}</span>
                      </h4>
                      <span style={styles.postTime}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p style={styles.postContent}>{post.content}</p>
                  
                  {post.image_url && (
                    <img src={post.image_url} alt="post" style={styles.postImage} />
                  )}
                  
                  <div style={styles.postFooter}>
                    <button
                      onClick={() => handleLikePost(post.id)}
                      style={{
                        ...styles.likeButton,
                        ...(post.liked ? styles.liked : {})
                      }}
                    >
                      ❤️ {post.likes || 0}
                    </button>
                    <span style={styles.commentCount}>
                      💬 {post.comments || 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CHANNEL TAB */}
        {communityTab === 'channel' && (
          <div style={styles.channelContainer}>
            <div style={styles.channelHeader}>
              <h2 style={styles.sectionTitle}>📺 Channels</h2>
              <button
                onClick={handleCreateGroup}
                style={styles.createButton}
              >
                + Create Channel
              </button>
            </div>

            {loadingGroups ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
              </div>
            ) : groups.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No channels yet. Create one to start!</p>
              </div>
            ) : (
              <div style={styles.channelGrid}>
                {groups.map(group => (
                  <div key={group.id} style={styles.channelCard}>
                    <div style={styles.channelIcon}>
                      {group.icon || '📢'}
                    </div>
                    <div style={styles.channelInfo}>
                      <h4 style={styles.channelName}>{group.name}</h4>
                      <p style={styles.channelMeta}>
                        {group.members} members • {group.description}
                      </p>
                      {group.joined ? (
                        <button
                          onClick={() => handleLeaveGroup(group.id)}
                          style={styles.leaveButton}
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinGroup(group.id)}
                          style={styles.joinButton}
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REELS TAB */}
        {communityTab === 'reels' && (
          <div style={styles.reelsContainer}>
            <h2 style={styles.sectionTitle}>🎬 Reels</h2>
            <div style={styles.reelsGrid}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={styles.reelCard}>
                  <div style={styles.reelThumbnail}>🎥</div>
                  <div style={styles.reelInfo}>
                    <p style={styles.reelTitle}>Coming Soon</p>
                    <p style={styles.reelViews}>Short videos feature</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PEOPLE TAB */}
        {communityTab === 'people' && (
          <PeopleSection 
            currentUser={user}
            onStartChat={handleStartChat}
            onViewProfile={handleViewUserProfile}
          />
        )}

        {/* CHAT TAB */}
        {communityTab === 'chat' && (
          <div style={styles.chatContainer}>
            <h2 style={styles.sectionTitle}>💬 Messages</h2>
            
            {loadingConversations ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
              </div>
            ) : conversations.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No conversations yet. Go to People tab to start chatting!</p>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  style={styles.conversationCard}
                  onClick={() => openChat(conv.user)}
                >
                  <div style={styles.conversationAvatar}>
                    {conv.user.avatar_url ? (
                      <img src={conv.user.avatar_url} alt={conv.user.full_name} style={styles.avatarImage} />
                    ) : (
                      <span style={styles.avatarPlaceholder}>👤</span>
                    )}
                    <span style={{
                      ...styles.statusDot,
                      ...(conv.user.status === 'online' ? styles.online : styles.offline)
                    }} />
                  </div>
                  <div style={styles.conversationInfo}>
                    <h4 style={styles.conversationName}>{conv.user.full_name}</h4>
                    <p style={styles.conversationPreview}>{conv.last_message}</p>
                  </div>
                  <div style={styles.conversationMeta}>
                    <span style={styles.conversationTime}>
                      {new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {conv.unread > 0 && (
                      <span style={styles.unreadBadge}>{conv.unread}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Chat Window */}
      {showChat && selectedChatUser && (
        <ChatWindow
          user={selectedChatUser}
          currentUser={user}
          onClose={() => {
            setShowChat(false);
            setSelectedChatUser(null);
            fetchConversations();
            fetchUnreadCount();
          }}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedProfileUserId && (
        <CommunityProfile
          userId={selectedProfileUserId}
          currentUser={user}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedProfileUserId(null);
          }}
          onStartChat={handleStartChat}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },

  // Premium Welcome Header
  welcomeHeader: {
    position: 'relative',
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px 16px 0 0',
    color: 'white',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'float 6s ease-in-out infinite',
  },
  welcomeTitle: {
    fontSize: '42px',
    fontWeight: '800',
    marginBottom: '15px',
    textShadow: '0 4px 12px rgba(0,0,0,0.2)',
    '@media (max-width: 768px)': {
      fontSize: '32px',
    },
  },
  welcomeSubtitle: {
    fontSize: '20px',
    opacity: 0.95,
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '@media (max-width: 768px)': {
      fontSize: '16px',
    },
  },

  // Premium Glass Tab Bar
  tabBar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    padding: '16px 8px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '14px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    margin: '0 6px',
    color: '#64748b',
  },
  tabActive: {
    color: 'white',
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 30px -10px rgba(0,0,0,0.3)',
  },
  tabHover: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    transform: 'scale(1.02)',
  },
  tabPressed: {
    transform: 'scale(0.98)',
  },
  tabIcon: {
    fontSize: '32px',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
    transition: 'all 0.3s ease',
    '@media (max-width: 480px)': {
      fontSize: '26px',
    },
  },
  unreadBadge: {
    position: 'absolute',
    top: '5px',
    right: '10px',
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center',
  },

  // Content Area
  content: {
    padding: '30px 20px',
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #1E293B 0%, #2D3748 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '25px',
  },

  // Feed Styles
  feedContainer: {
    width: '100%',
  },
  feedHeader: {
    marginBottom: '20px',
  },
  createPostCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  postInput: {
    width: '100%',
    padding: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '15px',
    resize: 'vertical',
    marginBottom: '15px',
    transition: 'all 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102,126,234,0.1)',
    },
  },
  postActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconButton: {
    padding: '10px 15px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#e2e8f0',
      transform: 'scale(1.05)',
    },
  },
  fileName: {
    fontSize: '13px',
    color: '#64748b',
    flex: 1,
  },
  postButton: {
    padding: '10px 28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 10px rgba(102,126,234,0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(102,126,234,0.4)',
    },
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    ':hover': {
      transform: 'none',
      boxShadow: '0 4px 10px rgba(102,126,234,0.3)',
    },
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    },
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
    cursor: 'pointer',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '2px solid #fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    fontSize: '26px',
  },
  postInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  authorRole: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#64748b',
  },
  postTime: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  postContent: {
    fontSize: '15px',
    color: '#334155',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  postImage: {
    width: '100%',
    maxHeight: '450px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '15px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
  postFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #e2e8f0',
  },
  likeButton: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#e2e8f0',
      transform: 'scale(1.05)',
    },
  },
  liked: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
  },
  commentCount: {
    fontSize: '14px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  // Channel Styles
  channelContainer: {
    width: '100%',
  },
  channelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  createButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 10px rgba(16,185,129,0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(16,185,129,0.4)',
    },
  },
  channelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  channelCard: {
    display: 'flex',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    },
  },
  channelIcon: {
    width: '60px',
    height: '60px',
    backgroundColor: '#f1f5f9',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 5px 0',
  },
  channelMeta: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '10px',
  },
  joinButton: {
    padding: '6px 16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  leaveButton: {
    padding: '6px 16px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Reels Styles
  reelsContainer: {
    width: '100%',
  },
  reelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  reelCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    },
  },
  reelThumbnail: {
    height: '220px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '50px',
    color: 'white',
  },
  reelInfo: {
    padding: '15px',
  },
  reelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 5px 0',
  },
  reelViews: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },

  // Chat Tab Styles
  chatContainer: {
    width: '100%',
  },
  conversationCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    marginBottom: '10px',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.03)',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f8fafc',
      transform: 'translateX(5px)',
    },
  },
  conversationAvatar: {
    position: 'relative',
    width: '50px',
    height: '50px',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  conversationPreview: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '200px',
  },
  conversationMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  conversationTime: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  statusDot: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    border: '2px solid #ffffff',
  },
  online: {
    backgroundColor: '#10b981',
  },
  offline: {
    backgroundColor: '#94a3b8',
  },

  // Loading States
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    animation: 'spin 1s linear infinite',
  },
  errorMessage: {
    padding: '25px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '15px',
  },
  emptyState: {
    padding: '50px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.03)',
  },
};

// Global animations
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(20px, -20px); }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}