import React, { useState } from 'react';
import YouTubePlayer from './YouTubePlayer';

export default function CourseView({ course, onClose, onEnroll, isEnrolled }) {
  const [player, setPlayer] = useState(null);
  const [playerState, setPlayerState] = useState(-1);
  const [showEnrollButton, setShowEnrollButton] = useState(!isEnrolled);

  const extractVideoId = (url) => {
    if (url.includes('youtube.com/embed/')) {
      return url.split('/embed/')[1].split('?')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('v=')) {
      return new URL(url).searchParams.get('v');
    }
    return null;
  };

  const videoId = extractVideoId(course.youtube_url);

  const handlePlayerReady = (event) => {
    setPlayer(event.target);
  };

  const handlePlayerStateChange = (event) => {
    setPlayerState(event.data);
  };

  const handleEnroll = async () => {
    const success = await onEnroll(course.id);
    if (success) {
      setShowEnrollButton(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{course.title}</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.content}>
          {videoId ? (
            <YouTubePlayer
              videoId={videoId}
              onReady={handlePlayerReady}
              onStateChange={handlePlayerStateChange}
            />
          ) : (
            <div style={styles.errorContainer}>
              <p>Video unavailable</p>
            </div>
          )}

          <div style={styles.courseInfo}>
            <div style={styles.metaRow}>
              <span style={styles.instructor}>👨‍🏫 {course.instructor}</span>
              <span style={styles.level}>📊 {course.level}</span>
              <span style={styles.duration}>⏱️ {course.duration}</span>
            </div>

            <p style={styles.description}>{course.description}</p>

            {showEnrollButton ? (
              <button onClick={handleEnroll} style={styles.enrollButton}>
                Enroll Now
              </button>
            ) : (
              <div style={styles.enrolledBadge}>
                ✅ You are enrolled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#64748b',
    padding: '0 10px'
  },
  content: {
    padding: '20px'
  },
  courseInfo: {
    padding: '20px 0'
  },
  metaRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    flexWrap: 'wrap'
  },
  instructor: {
    fontSize: '14px',
    color: '#64748b'
  },
  level: {
    fontSize: '14px',
    color: '#64748b'
  },
  duration: {
    fontSize: '14px',
    color: '#64748b'
  },
  description: {
    fontSize: '16px',
    color: '#334155',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  enrollButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  enrolledBadge: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#10b981',
    color: 'white',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600'
  },
  errorContainer: {
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    color: '#64748b'
  }
};