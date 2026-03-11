import React from 'react';

export default function CommunitySection({ 
  communityTab,
  setCommunityTab,
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
  return (
    <div style={styles.communityContainer}>
      {/* Community Hero with Background Image */}
      <div style={styles.communityHero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>StudyMart Community</h1>
          <p style={styles.heroSubtitle}>Connect, Learn, Grow Together</p>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <span style={styles.heroStatNumber}>12.5k+</span>
              <span style={styles.heroStatLabel}>Members</span>
            </div>
            <div style={styles.heroStat}>
              <span style={styles.heroStatNumber}>345</span>
              <span style={styles.heroStatLabel}>Online Now</span>
            </div>
            <div style={styles.heroStat}>
              <span style={styles.heroStatNumber}>724</span>
              <span style={styles.heroStatLabel}>Topics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Action Tabs */}
      <div style={styles.communityActionTabs}>
        {['feed', 'qna', 'tips', 'resources', 'live', 'groups', 'messages'].map(tab => (
          <button 
            key={tab}
            style={{
              ...styles.communityTab,
              ...(communityTab === tab ? styles.communityTabActive : {}),
              ...(hoveredButton === `tab-${tab}` ? styles.communityTabHover : {}),
              ...(pressedButton === `tab-${tab}` ? styles.communityTabPressed : {})
            }}
            onClick={() => setCommunityTab(tab)}
            onMouseEnter={() => handleButtonMouseEnter(`tab-${tab}`)}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown(`tab-${tab}`)}
            onMouseUp={handleButtonMouseUp}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Community Grid */}
      <div style={styles.communityGrid}>
        {/* Left Main Area */}
        <div style={styles.communityMain}>
          {communityTab === 'feed' && (
            <div>
              <h3 style={styles.columnTitle}>Feed</h3>
              {/* Create Post Form */}
              <form onSubmit={handleCreatePost} style={styles.createPostForm}>
                <textarea
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  style={styles.postTextarea}
                  rows="3"
                />
                <div style={styles.postActions}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewPostImage(e.target.files[0])}
                    id="post-image-input"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('post-image-input').click()}
                    style={{
                      ...styles.imageUploadButton,
                      ...(hoveredButton === 'image-upload' ? styles.imageUploadButtonHover : {}),
                      ...(pressedButton === 'image-upload' ? styles.imageUploadButtonPressed : {})
                    }}
                    onMouseEnter={() => handleButtonMouseEnter('image-upload')}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => handleButtonMouseDown('image-upload')}
                    onMouseUp={handleButtonMouseUp}
                  >
                    📷 Add Image
                  </button>
                  {newPostImage && <span style={styles.fileName}>{newPostImage.name}</span>}
                  <button 
                    type="submit" 
                    disabled={posting} 
                    style={{
                      ...styles.submitPostButton,
                      ...(hoveredButton === 'submit-post' && !posting ? styles.submitPostButtonHover : {}),
                      ...(pressedButton === 'submit-post' && !posting ? styles.submitPostButtonPressed : {})
                    }}
                    onMouseEnter={() => !posting && handleButtonMouseEnter('submit-post')}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => !posting && handleButtonMouseDown('submit-post')}
                    onMouseUp={handleButtonMouseUp}
                  >
                    {posting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>

              {loadingFeed ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loader}></div>
                  <p style={styles.loadingText}>Loading feed...</p>
                </div>
              ) : feedError ? (
                <p style={{ color: 'red' }}>{feedError}</p>
              ) : feedPosts.length === 0 ? (
                <p>No posts yet. Be the first to post!</p>
              ) : (
                feedPosts.map((post) => (
                  <div key={post.id} style={styles.feedPost}>
                    <div style={styles.postHeader} onClick={() => handleViewProfile(post.user_id)}>
                      <div style={styles.authorAvatar}>
                        {post.user?.avatar_url ? (
                          <img src={post.user.avatar_url} alt="avatar" style={styles.avatarThumb} />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div>
                        <h4 style={styles.authorName}>
                          {post.user?.full_name} <span style={styles.authorRole}>• {post.user?.role}</span>
                        </h4>
                        <p style={styles.postTime}>{new Date(post.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <p style={styles.postContent}>{post.content}</p>
                    {post.image_url && <img src={post.image_url} alt="post" style={styles.postImage} />}
                    <div style={styles.postStats}>
                      <button
                        style={{
                          ...styles.likeButton,
                          ...(post.liked ? styles.likedButton : {}),
                          ...(hoveredButton === `like-${post.id}` ? styles.likeButtonHover : {}),
                          ...(pressedButton === `like-${post.id}` ? styles.likeButtonPressed : {})
                        }}
                        onClick={() => handleLikePost(post.id)}
                        onMouseEnter={() => handleButtonMouseEnter(`like-${post.id}`)}
                        onMouseLeave={handleButtonMouseLeave}
                        onMouseDown={() => handleButtonMouseDown(`like-${post.id}`)}
                        onMouseUp={handleButtonMouseUp}
                      >
                        ❤️ {post.likes}
                      </button>
                      <span>💬 {post.comments || 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {communityTab === 'qna' && <div><h3 style={styles.columnTitle}>Q&A Forums</h3><p>Coming soon...</p></div>}
          {communityTab === 'tips' && <div><h3 style={styles.columnTitle}>Study Tips</h3><p>Coming soon...</p></div>}
          {communityTab === 'resources' && <div><h3 style={styles.columnTitle}>Resources</h3><p>Coming soon...</p></div>}
          {communityTab === 'live' && <div><h3 style={styles.columnTitle}>Live Sessions</h3><p>Coming soon...</p></div>}

          {communityTab === 'groups' && (
            <div>
              <h3 style={styles.columnTitle}>Study Groups</h3>
              <button 
                onClick={handleCreateGroup} 
                style={{
                  ...styles.createGroupButton,
                  ...(hoveredButton === 'create-group' ? styles.createGroupButtonHover : {}),
                  ...(pressedButton === 'create-group' ? styles.createGroupButtonPressed : {})
                }}
                onMouseEnter={() => handleButtonMouseEnter('create-group')}
                onMouseLeave={handleButtonMouseLeave}
                onMouseDown={() => handleButtonMouseDown('create-group')}
                onMouseUp={handleButtonMouseUp}
              >
                + Create New Group
              </button>
              {loadingGroups ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loader}></div>
                  <p style={styles.loadingText}>Loading groups...</p>
                </div>
              ) : groups.length === 0 ? (
                <p>No groups yet.</p>
              ) : (
                groups.map(group => (
                  <div key={group.id} style={styles.groupCard}>
                    <div style={styles.groupIcon}>👥</div>
                    <div style={styles.groupInfo}>
                      <h4>{group.name}</h4>
                      <p>{group.members} members • {group.description}</p>
                      {group.joined ? (
                        <button 
                          style={{
                            ...styles.leaveButton,
                            ...(hoveredButton === `leave-${group.id}` ? styles.leaveButtonHover : {}),
                            ...(pressedButton === `leave-${group.id}` ? styles.leaveButtonPressed : {})
                          }}
                          onClick={() => handleLeaveGroup(group.id)}
                          onMouseEnter={() => handleButtonMouseEnter(`leave-${group.id}`)}
                          onMouseLeave={handleButtonMouseLeave}
                          onMouseDown={() => handleButtonMouseDown(`leave-${group.id}`)}
                          onMouseUp={handleButtonMouseUp}
                        >
                          Leave
                        </button>
                      ) : (
                        <button 
                          style={{
                            ...styles.joinButton,
                            ...(hoveredButton === `join-${group.id}` ? styles.joinButtonHover : {}),
                            ...(pressedButton === `join-${group.id}` ? styles.joinButtonPressed : {})
                          }}
                          onClick={() => handleJoinGroup(group.id)}
                          onMouseEnter={() => handleButtonMouseEnter(`join-${group.id}`)}
                          onMouseLeave={handleButtonMouseLeave}
                          onMouseDown={() => handleButtonMouseDown(`join-${group.id}`)}
                          onMouseUp={handleButtonMouseUp}
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {communityTab === 'messages' && (
            <div>
              <h3 style={styles.columnTitle}>Messages</h3>
              {loadingMessages ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loader}></div>
                  <p style={styles.loadingText}>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <p>No messages yet.</p>
              ) : (
                messages.map(chat => (
                  <div 
                    key={chat.id} 
                    style={styles.messageCard} 
                    onClick={() => alert(`Open chat with ${chat.with_name}`)}
                    onMouseEnter={() => handleButtonMouseEnter(`chat-${chat.id}`)}
                    onMouseLeave={handleButtonMouseLeave}
                  >
                    <div style={styles.messageAvatar}>👤</div>
                    <div style={styles.messageInfo}>
                      <h4>{chat.with_name}</h4>
                      <p>{chat.last_message}</p>
                    </div>
                    <div style={styles.messageMeta}>
                      <span>{new Date(chat.updated_at).toLocaleTimeString()}</span>
                      {chat.unread > 0 && <span style={styles.unreadBadge}>{chat.unread}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Quick Info */}
        <div style={styles.communitySidebar}>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Top Contributors</h3>
            {topContributors.map(contributor => (
              <div 
                key={contributor.id} 
                style={styles.contributorCard} 
                onClick={() => handleViewProfile(contributor.id)}
                onMouseEnter={() => handleButtonMouseEnter(`contributor-${contributor.id}`)}
                onMouseLeave={handleButtonMouseLeave}
              >
                <span>{contributor.full_name}</span>
                <span>{contributor.posts} posts</span>
              </div>
            ))}
          </div>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Upcoming Events</h3>
            {events.map(event => (
              <div key={event.id} style={styles.eventCard}>
                <span>📅 {event.title}</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
                {!event.attending && (
                  <button 
                    style={{
                      ...styles.attendButton,
                      ...(hoveredButton === `attend-${event.id}` ? styles.attendButtonHover : {}),
                      ...(pressedButton === `attend-${event.id}` ? styles.attendButtonPressed : {})
                    }}
                    onClick={() => handleAttendEvent(event.id)}
                    onMouseEnter={() => handleButtonMouseEnter(`attend-${event.id}`)}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => handleButtonMouseDown(`attend-${event.id}`)}
                    onMouseUp={handleButtonMouseUp}
                  >
                    Attend
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  communityContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  communityHero: {
    position: 'relative',
    height: '300px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '30px',
    backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '@media (max-width: 768px)': {
      height: '250px',
    },
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(30,58,138,0.8) 0%, rgba(37,99,235,0.7) 100%)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
    '@media (max-width: 768px)': {
      fontSize: '28px',
    },
  },
  heroSubtitle: {
    fontSize: '18px',
    marginBottom: '20px',
    '@media (max-width: 768px)': {
      fontSize: '16px',
    },
  },
  heroStats: {
    display: 'flex',
    gap: '30px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '10px',
    },
  },
  heroStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  heroStatLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
  communityActionTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  communityTab: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    '@media (max-width: 768px)': {
      padding: '6px 12px',
      fontSize: '13px',
    },
  },
  communityTabHover: {
    backgroundColor: '#FF6B35',
    color: 'white',
    transform: 'translateY(-2px)',
  },
  communityTabPressed: {
    transform: 'scale(0.95)',
  },
  communityTabActive: {
    backgroundColor: '#6366f1',
    color: 'white',
  },
  communityGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  communityMain: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  communitySidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sidebarSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  columnTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  createPostForm: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  postTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '10px',
    resize: 'vertical',
  },
  postActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  imageUploadButton: {
    padding: '8px 12px',
    backgroundColor: '#e0e7ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  imageUploadButtonHover: {
    backgroundColor: '#FF6B35',
    color: 'white',
    transform: 'scale(1.05)',
  },
  imageUploadButtonPressed: {
    transform: 'scale(0.95)',
  },
  fileName: {
    fontSize: '12px',
    color: '#666',
  },
  submitPostButton: {
    padding: '8px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: 'auto',
  },
  submitPostButtonHover: {
    backgroundColor: '#FF6B35',
    transform: 'scale(1.05)',
  },
  submitPostButtonPressed: {
    transform: 'scale(0.95)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
  },
  loader: {
    border: '4px solid rgba(37, 99, 235, 0.2)',
    borderTop: '4px solid #FF6B35',
    borderRight: '4px solid #2ECC71',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#666',
  },
  feedPost: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  authorAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    overflow: 'hidden',
  },
  avatarThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  authorName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '2px',
  },
  authorRole: {
    fontSize: '12px',
    color: '#666',
  },
  postTime: {
    fontSize: '12px',
    color: '#888',
  },
  postContent: {
    fontSize: '14px',
    marginBottom: '10px',
  },
  postImage: {
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  postStats: {
    display: 'flex',
    gap: '15px',
    fontSize: '13px',
    color: '#666',
  },
  likeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    fontSize: '13px',
  },
  likeButtonHover: {
    color: '#FF6B35',
    transform: 'scale(1.1)',
  },
  likeButtonPressed: {
    transform: 'scale(0.95)',
  },
  likedButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#FF6B35',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  groupCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  groupIcon: {
    fontSize: '32px',
  },
  groupInfo: {
    flex: 1,
  },
  joinButton: {
    padding: '4px 12px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  joinButtonHover: {
    backgroundColor: '#FF6B35',
    transform: 'scale(1.05)',
  },
  joinButtonPressed: {
    transform: 'scale(0.95)',
  },
  leaveButton: {
    padding: '4px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  leaveButtonHover: {
    transform: 'scale(1.05)',
  },
  leaveButtonPressed: {
    transform: 'scale(0.95)',
  },
  createGroupButton: {
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  messageCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  messageAvatar: {
    fontSize: '32px',
  },
  messageInfo: {
    flex: 1,
  },
  messageMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px',
  },
  unreadBadge: {
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 6px',
    fontSize: '11px',
  },
  contributorCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
  },
  eventCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  attendButton: {
    padding: '4px 8px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
  },
};