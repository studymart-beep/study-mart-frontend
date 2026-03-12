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

  // WhatsApp-style icons for tabs
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home', activeColor: '#25D366' },
    { id: 'channel', icon: '📺', label: 'Channel', activeColor: '#FF6B35' },
    { id: 'reels', icon: '🎬', label: 'Reels', activeColor: '#6366f1' },
    { id: 'people', icon: '👥', label: 'People', activeColor: '#10b981' },
    { id: 'chat', icon: '💬', label: 'Chat', activeColor: '#3b82f6' }
  ];

  return (
    <div style={styles.container}>
      {/* WhatsApp-style Tab Bar */}
      <div style={styles.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCommunityTab(tab.id)}
            style={{
              ...styles.tab,
              ...(communityTab === tab.id ? styles.tabActive : {}),
              ...(communityTab === tab.id ? { borderBottomColor: tab.activeColor } : {}),
              ...(hoveredButton === `tab-${tab.id}` ? styles.tabHover : {}),
              ...(pressedButton === `tab-${tab.id}` ? styles.tabPressed : {})
            }}
            onMouseEnter={() => handleButtonMouseEnter(`tab-${tab.id}`)}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown(`tab-${tab.id}`)}
            onMouseUp={handleButtonMouseUp}
            title={tab.label} // Tooltip on hover
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        {/* HOME TAB - Feed */}
        {communityTab === 'home' && (
          <div style={styles.feedContainer}>
            <div style={styles.feedHeader}>
              <h2 style={styles.sectionTitle}>🏠 Home</h2>
            </div>

            {/* Create Post Form */}
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
                    ...(posting ? styles.disabled : {})
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
                  <div style={styles.postHeader} onClick={() => handleViewProfile(post.user_id)}>
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

        {/* CHANNEL TAB - Groups/Channels */}
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

        {/* REELS TAB - Short videos */}
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

        {/* PEOPLE TAB - Top Contributors */}
        {communityTab === 'people' && (
          <div style={styles.peopleContainer}>
            <h2 style={styles.sectionTitle}>👥 People</h2>
            
            {/* Top Contributors */}
            <div style={styles.contributorsSection}>
              <h3 style={styles.subSectionTitle}>Top Contributors</h3>
              {topContributors.map((contributor, index) => (
                <div
                  key={contributor.id}
                  style={styles.contributorCard}
                  onClick={() => handleViewProfile(contributor.id)}
                >
                  <div style={styles.rankBadge}>#{index + 1}</div>
                  <div style={styles.avatar}>
                    <span style={styles.avatarPlaceholder}>👤</span>
                  </div>
                  <div style={styles.contributorInfo}>
                    <h4 style={styles.contributorName}>{contributor.full_name}</h4>
                    <p style={styles.contributorStats}>
                      {contributor.posts} posts
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Events */}
            <div style={styles.eventsSection}>
              <h3 style={styles.subSectionTitle}>Upcoming Events</h3>
              {events.map(event => (
                <div key={event.id} style={styles.eventCard}>
                  <div style={styles.eventIcon}>📅</div>
                  <div style={styles.eventInfo}>
                    <h4 style={styles.eventTitle}>{event.title}</h4>
                    <p style={styles.eventDate}>
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  {!event.attending && (
                    <button
                      onClick={() => handleAttendEvent(event.id)}
                      style={styles.attendButton}
                    >
                      Attend
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAT TAB - Messages */}
        {communityTab === 'chat' && (
          <div style={styles.chatContainer}>
            <h2 style={styles.sectionTitle}>💬 Messages</h2>
            
            {loadingMessages ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
              </div>
            ) : messages.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map(chat => (
                <div
                  key={chat.id}
                  style={styles.chatCard}
                  onClick={() => alert(`Open chat with ${chat.with_name}`)}
                >
                  <div style={styles.chatAvatar}>👤</div>
                  <div style={styles.chatInfo}>
                    <h4 style={styles.chatName}>{chat.with_name}</h4>
                    <p style={styles.chatPreview}>{chat.last_message}</p>
                  </div>
                  <div style={styles.chatMeta}>
                    <span style={styles.chatTime}>
                      {new Date(chat.updated_at).toLocaleTimeString()}
                    </span>
                    {chat.unread > 0 && (
                      <span style={styles.unreadBadge}>{chat.unread}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
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

  // WhatsApp-style Tab Bar
  tabBar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '8px 0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
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
  },
  tabActive: {
    borderBottom: '3px solid',
  },
  tabHover: {
    backgroundColor: '#f1f5f9',
  },
  tabPressed: {
    transform: 'scale(0.95)',
  },
  tabIcon: {
    fontSize: '24px',
    '@media (max-width: 480px)': {
      fontSize: '20px',
    },
  },

  // Content Area
  content: {
    padding: '20px',
  },

  // Feed Styles
  feedContainer: {
    width: '100%',
  },
  feedHeader: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 20px 0',
  },
  createPostCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  postInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    marginBottom: '12px',
    ':focus': {
      outline: 'none',
      borderColor: '#6366f1',
    },
  },
  postActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconButton: {
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  },
  fileName: {
    fontSize: '12px',
    color: '#64748b',
    flex: 1,
  },
  postButton: {
    padding: '8px 24px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#4f46e5',
    },
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    fontSize: '24px',
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
    fontSize: '14px',
    color: '#334155',
    lineHeight: '1.6',
    marginBottom: '12px',
  },
  postImage: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  postFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
  },
  likeButton: {
    padding: '6px 12px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  liked: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
  },
  commentCount: {
    fontSize: '14px',
    color: '#64748b',
  },

  // Channel Styles
  channelContainer: {
    width: '100%',
  },
  channelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  createButton: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#059669',
    },
  },
  channelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  channelCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  channelIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  channelMeta: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '8px',
  },
  joinButton: {
    padding: '4px 12px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  leaveButton: {
    padding: '4px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Reels Styles
  reelsContainer: {
    width: '100%',
  },
  reelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  reelCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  reelThumbnail: {
    height: '200px',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
  },
  reelInfo: {
    padding: '12px',
  },
  reelTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  reelViews: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },

  // People Styles
  peopleContainer: {
    width: '100%',
  },
  contributorsSection: {
    marginBottom: '30px',
  },
  subSectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 16px 0',
  },
  contributorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    position: 'relative',
    ':hover': {
      backgroundColor: '#f8fafc',
    },
  },
  rankBadge: {
    width: '24px',
    height: '24px',
    backgroundColor: '#f59e0b',
    color: 'white',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: '4px',
  },
  contributorInfo: {
    flex: 1,
  },
  contributorName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 2px 0',
  },
  contributorStats: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  eventsSection: {
    marginTop: '20px',
  },
  eventCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    marginBottom: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  eventIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 2px 0',
  },
  eventDate: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  attendButton: {
    padding: '4px 12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Chat Styles
  chatContainer: {
    width: '100%',
  },
  chatCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    ':hover': {
      backgroundColor: '#f8fafc',
    },
  },
  chatAvatar: {
    width: '48px',
    height: '48px',
    backgroundColor: '#f1f5f9',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 2px 0',
  },
  chatPreview: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '200px',
  },
  chatMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  chatTime: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  unreadBadge: {
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '600',
  },

  // Loading States
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  errorMessage: {
    padding: '20px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '8px',
    textAlign: 'center',
  },
  emptyState: {
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '16px',
  },
};

// Add keyframes to global CSS
const globalStyles = `
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