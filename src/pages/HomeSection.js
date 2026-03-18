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
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Home Feed</h1>
      
      {loadingFeed && (
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
        </div>
      )}
      
      {feedError && (
        <div style={styles.errorMessage}>{feedError}</div>
      )}
      
      {!loadingFeed && feedPosts && feedPosts.length > 0 ? (
        feedPosts.map(post => (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <div style={styles.avatar}>
                {post.user?.avatar_url ? (
                  <img src={post.user.avatar_url} alt={post.user.full_name} style={styles.avatarImage} />
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
            
            <p style={styles.postContent}>{post.content}</p>
            
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
      ) : (
        !loadingFeed && <p style={styles.emptyState}>No posts yet. Be the first to post!</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
  },
  postCard: {
    backgroundColor: 'white',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '12px',
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
    gap: '20px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '15px',
  },
  likeButton: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  liked: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
  },
  commentCount: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '20px',
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
    textAlign: 'center',
    padding: '40px',
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