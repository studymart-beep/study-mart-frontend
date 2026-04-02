import React from 'react';

export default function HomeSection({ 
  feedPosts = [],
  loadingFeed = false,
  feedError = null,
  newPostContent = '',
  setNewPostContent,
  newPostImage = null,
  setNewPostImage,
  posting = false,
  handleCreatePost,
  handleLikePost,
  hoveredButton,
  pressedButton,
  handleButtonMouseEnter,
  handleButtonMouseLeave,
  handleButtonMouseDown,
  handleButtonMouseUp
}) {
  
  const handleCreatePostClick = () => {
    if (!newPostContent.trim() && !newPostImage) return;
    handleCreatePost({ content: newPostContent, image: newPostImage });
  };

  return (
    <div style={styles.container}>
      {/* Welcome Header with Logo */}
      <div style={styles.welcomeHeader}>
        <img src="/logo.png" alt="Study Mart" style={styles.welcomeLogo} />
        <h1 style={styles.welcomeTitle}>Welcome to Study Mart</h1>
        <p style={styles.welcomeSubtitle}>Learn. Buy. Grow.</p>
        <div style={styles.headerGlow}></div>
      </div>

      {/* Create Post Card */}
      <div style={styles.createPostCard}>
        <textarea
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          style={styles.postInput}
          rows="3"
        />
        
        <div style={styles.postActions}>
          <label style={styles.imageUploadLabel}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPostImage(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <span style={styles.imageUploadIcon}>📷</span>
          </label>
          
          {newPostImage && (
            <span style={styles.imageName}>{newPostImage.name}</span>
          )}
          
          <button
            onClick={handleCreatePostClick}
            disabled={posting || (!newPostContent.trim() && !newPostImage)}
            style={{
              ...styles.postButton,
              ...(posting || (!newPostContent.trim() && !newPostImage) ? styles.disabled : {})
            }}
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Feed Posts */}
      <div style={styles.feedContainer}>
        <h2 style={styles.feedTitle}>Recent Posts</h2>
        
        {loadingFeed ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
          </div>
        ) : feedError ? (
          <div style={styles.errorMessage}>{feedError}</div>
        ) : !feedPosts || feedPosts.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No posts yet. Be the first to post!</p>
          </div>
        ) : (
          feedPosts.map(post => (
            <div key={post.id} style={styles.postCard}>
              <div style={styles.postHeader}>
                <div style={styles.avatar}>
                  {post.user?.avatar_url ? (
                    <img src={post.user.avatar_url} alt={post.user.full_name || 'User'} style={styles.avatarImage} />
                  ) : (
                    <span style={styles.avatarPlaceholder}>👤</span>
                  )}
                </div>
                <div style={styles.postInfo}>
                  <h4 style={styles.authorName}>{post.user?.full_name || 'Unknown User'}</h4>
                  <span style={styles.postTime}>
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
              
              <p style={styles.postContent}>{post.content || ''}</p>
              
              {post.image_url && (
                <img src={post.image_url} alt="Post" style={styles.postImage} />
              )}
              
              <div style={styles.postFooter}>
                <button
                  onClick={() => handleLikePost && handleLikePost(post.id)}
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
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },
  welcomeHeader: {
    position: 'relative',
    textAlign: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    marginBottom: '30px',
    color: 'white',
    overflow: 'hidden',
  },
  welcomeLogo: {
    width: '80px',
    height: '80px',
    borderRadius: '15px',
    objectFit: 'cover',
    marginBottom: '15px',
    border: '3px solid white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  headerGlow: {
    position: 'absolute',
    top: '-30%',
    right: '-10%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '10px',
    position: 'relative',
    zIndex: 1,
  },
  welcomeSubtitle: {
    fontSize: '18px',
    opacity: 0.9,
    position: 'relative',
    zIndex: 1,
  },
  createPostCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  postInput: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    resize: 'none',
    marginBottom: '15px',
    fontFamily: 'inherit',
  },
  postActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  imageUploadLabel: {
    cursor: 'pointer',
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
  },
  imageUploadIcon: {
    fontSize: '20px',
  },
  imageName: {
    fontSize: '14px',
    color: '#64748b',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  postButton: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  feedContainer: {
    width: '100%',
  },
  feedTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
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
  postTime: {
    fontSize: '12px',
    color: '#64748b',
  },
  postContent: {
    fontSize: '16px',
    color: '#334155',
    lineHeight: '1.5',
    marginBottom: '15px',
  },
  postImage: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  postFooter: {
    display: 'flex',
    gap: '10px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '15px',
  },
  likeButton: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  liked: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
  },
  commentCount: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
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
    backgroundColor: 'white',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '16px',
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