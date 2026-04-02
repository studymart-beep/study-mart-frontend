import React from 'react';

export default function HomeSection({ 
  newPostContent = '',
  setNewPostContent,
  newPostImage = null,
  setNewPostImage,
  posting = false,
  handleCreatePost,
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