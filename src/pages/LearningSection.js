import React from 'react';

export default function LearningSection() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Learning Section</h1>
      <p>Learning content coming soon...</p>
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
};