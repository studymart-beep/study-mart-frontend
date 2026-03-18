import React from 'react';

export default function HomeSection({ 
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
  hoveredButton,
  pressedButton,
  handleButtonMouseEnter,
  handleButtonMouseLeave,
  handleButtonMouseDown,
  handleButtonMouseUp
}) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Home Section</h1>
      {loadingFeed && <p>Loading...</p>}
      {feedError && <p style={styles.error}>{feedError}</p>}
      {feedPosts && feedPosts.length > 0 ? (
        feedPosts.map(post => (
          <div key={post.id} style={styles.postCard}>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts yet</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  postCard: {
    backgroundColor: 'white',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  error: {
    color: 'red',
  },
};