import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchCourse();
    fetchContents();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      if (response.data.success && response.data.course) {
        setCourse(response.data.course);
      } else {
        setCourse(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setCourse(null);
      setLoading(false);
    }
  };

  const fetchContents = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/contents`);
      if (response.data.success && response.data.contents) {
        setContents(response.data.contents);
        const firstVideo = response.data.contents.find(c => c.content_type === 'video');
        if (firstVideo) setSelectedVideo(firstVideo);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('youtube.com/embed/')) {
      return url.split('/embed/')[1].split('?')[0];
    }
    return null;
  };

  const materials = contents.filter(c => c.content_type === 'pdf');
  const videos = contents.filter(c => c.content_type === 'video');
  const cbtList = contents.filter(c => c.content_type === 'cbt');

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={styles.errorContainer}>
        <h2>Course Not Found</h2>
        <p>The course you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>{course.title}</h1>
        <p style={styles.instructor}>👨‍🏫 {course.instructor || 'Study Mart Instructor'}</p>
        <div style={styles.stats}>
          <span>📄 {materials.length} Materials</span>
          <span>🎥 {videos.length} Videos</span>
          <span>📝 {cbtList.length} CBT</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('materials')}
          style={{...styles.tab, ...(activeTab === 'materials' ? styles.activeTab : {})}}
        >
          📄 Materials
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          style={{...styles.tab, ...(activeTab === 'videos' ? styles.activeTab : {})}}
        >
          🎥 Videos
        </button>
        <button
          onClick={() => setActiveTab('cbt')}
          style={{...styles.tab, ...(activeTab === 'cbt' ? styles.activeTab : {})}}
        >
          📝 CBT
        </button>
      </div>

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div style={styles.tabContent}>
          {materials.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📄</div>
              <h3>No Materials Available</h3>
              <p>Course materials will be added by the instructor soon.</p>
            </div>
          ) : (
            materials.map((item) => (
              <div key={item.id} style={styles.materialCard}>
                <div style={styles.materialIcon}>📄</div>
                <div style={styles.materialInfo}>
                  <h4>{item.title}</h4>
                  <p>PDF Document</p>
                </div>
                <button
                  onClick={() => window.open(item.file_url, '_blank')}
                  style={styles.downloadBtn}
                >
                  Download
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div style={styles.tabContent}>
          {videos.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎥</div>
              <h3>No Videos Available</h3>
              <p>Video lectures will be added by the instructor soon.</p>
            </div>
          ) : (
            <div style={styles.videosContainer}>
              <div style={styles.videoPlayer}>
                {selectedVideo && extractVideoId(selectedVideo.video_url) ? (
                  <>
                    <h3 style={styles.videoTitle}>{selectedVideo.title}</h3>
                    <div style={styles.videoWrapper}>
                      <iframe
                        src={`https://www.youtube.com/embed/${extractVideoId(selectedVideo.video_url)}`}
                        title={selectedVideo.title}
                        style={styles.videoFrame}
                        allowFullScreen
                      />
                    </div>
                  </>
                ) : (
                  <div style={styles.videoError}>
                    <p>🎥 Select a video to play</p>
                  </div>
                )}
              </div>
              <div style={styles.videoList}>
                <h4>Course Videos ({videos.length})</h4>
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    style={{
                      ...styles.videoItem,
                      ...(selectedVideo?.id === video.id ? styles.videoItemActive : {})
                    }}
                  >
                    <span style={styles.videoItemIcon}>🎬</span>
                    <div style={styles.videoItemInfo}>
                      <div style={styles.videoItemTitle}>{video.title}</div>
                    </div>
                    {selectedVideo?.id === video.id && (
                      <span style={styles.playingBadge}>▶ Playing</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CBT Tab */}
      {activeTab === 'cbt' && (
        <div style={styles.tabContent}>
          {cbtList.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📝</div>
              <h3>No CBT Available</h3>
              <p>Practice tests will be added by the instructor soon.</p>
            </div>
          ) : (
            cbtList.map((cbt) => (
              <div key={cbt.id} style={styles.cbtCard}>
                <div style={styles.cbtHeader}>
                  <span style={styles.cbtIcon}>📝</span>
                  <div>
                    <h3>{cbt.title}</h3>
                    <p>Computer Based Test</p>
                  </div>
                </div>
                <div style={styles.cbtInfo}>
                  <span>⏱️ Practice at your own pace</span>
                  <span>📊 Test your knowledge</span>
                </div>
                <button style={styles.startBtn}>Start Practice Test →</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '40px',
  },
  backButton: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '10px',
  },
  instructor: {
    fontSize: '16px',
    opacity: 0.9,
    marginBottom: '20px',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
  },
  tabs: {
    display: 'flex',
    backgroundColor: 'white',
    padding: '0 30px',
    borderBottom: '1px solid #e2e8f0',
    gap: '10px',
  },
  tab: {
    padding: '15px 25px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#64748b',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#6366f1',
    borderBottomColor: '#6366f1',
  },
  tabContent: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  materialCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  materialIcon: {
    fontSize: '32px',
  },
  materialInfo: {
    flex: 1,
  },
  downloadBtn: {
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  videosContainer: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  videoPlayer: {
    flex: 2,
    minWidth: '300px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  videoFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  videoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  videoList: {
    flex: 1,
    minWidth: '250px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  videoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
  },
  videoItemActive: {
    backgroundColor: '#e0e7ff',
  },
  videoItemIcon: {
    fontSize: '24px',
  },
  videoItemInfo: {
    flex: 1,
  },
  videoItemTitle: {
    fontWeight: '500',
  },
  playingBadge: {
    fontSize: '11px',
    color: '#10b981',
    backgroundColor: '#d1fae5',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  videoError: {
    textAlign: 'center',
    padding: '60px',
    color: '#64748b',
  },
  cbtCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cbtHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '16px',
  },
  cbtIcon: {
    fontSize: '32px',
  },
  cbtInfo: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#64748b',
  },
  startBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8fafc',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
};

const globalStyles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}