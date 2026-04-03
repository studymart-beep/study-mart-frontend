import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchCourse();
    fetchContents();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      if (response.data.success) {
        setCourse(response.data.course);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setLoading(false);
    }
  };

  const fetchContents = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/contents`);
      if (response.data.success) {
        setContents(response.data.contents || []);
        const firstVideo = response.data.contents?.find(c => c.content_type === 'video');
        if (firstVideo) setSelectedVideo(firstVideo);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) return url.split('/embed/')[1].split('?')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    if (url.includes('v=')) {
      try { return new URL(url).searchParams.get('v'); } catch(e) { return null; }
    }
    return url;
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
    return <div style={styles.errorContainer}>Course not found</div>;
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            ← Back to Dashboard
          </button>
          <div style={styles.courseBadge}>
            {course.level_option === 'beginner' && '🌟 Beginner'}
            {course.level_option === 'intermediate' && '📈 Intermediate'}
            {course.level_option === 'advanced' && '🚀 Advanced'}
            {!course.level_option && '📚 Course'}
          </div>
          <h1 style={styles.courseTitle}>{course.title}</h1>
          <p style={styles.courseInstructor}>
            <span style={styles.instructorIcon}>👨‍🏫</span> {course.instructor || 'Study Mart Instructor'}
          </p>
          <div style={styles.courseStats}>
            <div style={styles.stat}>
              <span>📄</span> {materials.length} Materials
            </div>
            <div style={styles.stat}>
              <span>🎥</span> {videos.length} Videos
            </div>
            <div style={styles.stat}>
              <span>📝</span> {cbtList.length} CBT
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{...styles.tab, ...(activeTab === 'overview' ? styles.tabActive : {})}}
          >
            📖 Overview
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            style={{...styles.tab, ...(activeTab === 'materials' ? styles.tabActive : {})}}
          >
            📄 Materials {materials.length > 0 && <span style={styles.badge}>{materials.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            style={{...styles.tab, ...(activeTab === 'videos' ? styles.tabActive : {})}}
          >
            🎥 Videos {videos.length > 0 && <span style={styles.badge}>{videos.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('cbt')}
            style={{...styles.tab, ...(activeTab === 'cbt' ? styles.tabActive : {})}}
          >
            📝 CBT {cbtList.length > 0 && <span style={styles.badge}>{cbtList.length}</span>}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={styles.overviewContainer}>
            <div style={styles.descriptionCard}>
              <h2>About This Course</h2>
              <p>{course.description || 'No description available for this course.'}</p>
            </div>
            <div style={styles.whatYoullLearn}>
              <h3>What You'll Learn</h3>
              <div style={styles.learnGrid}>
                <div style={styles.learnItem}>✓ Master core concepts</div>
                <div style={styles.learnItem}>✓ Practical hands-on exercises</div>
                <div style={styles.learnItem}>✓ Real-world projects</div>
                <div style={styles.learnItem}>✓ Certificate of completion</div>
              </div>
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div>
            {materials.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📄</div>
                <h3>No Materials Yet</h3>
                <p>Course materials will be added soon.</p>
              </div>
            ) : (
              <div style={styles.materialsGrid}>
                {materials.map((item, index) => (
                  <div key={item.id} style={styles.materialCard}>
                    <div style={styles.materialIcon}>📄</div>
                    <div style={styles.materialInfo}>
                      <h4>{item.title}</h4>
                      <p>PDF Document • {index + 1}</p>
                    </div>
                    <button onClick={() => window.open(item.file_url, '_blank')} style={styles.downloadBtn}>
                      📥 Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div>
            {videos.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🎥</div>
                <h3>No Videos Yet</h3>
                <p>Video lectures will be added soon.</p>
              </div>
            ) : (
              <div style={styles.videosContainer}>
                <div style={styles.videoPlayer}>
                  {selectedVideo && (
                    <>
                      <h3 style={styles.videoTitle}>{selectedVideo.title}</h3>
                      <div style={styles.videoWrapper}>
                        <iframe
                          src={`https://www.youtube.com/embed/${extractVideoId(selectedVideo.video_url)}?modestbranding=1&controls=1&rel=0&showinfo=0`}
                          title={selectedVideo.title}
                          style={styles.videoFrame}
                          allowFullScreen
                        />
                      </div>
                    </>
                  )}
                </div>
                <div style={styles.videoList}>
                  <h4>Course Videos ({videos.length})</h4>
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      style={{...styles.videoItem, ...(selectedVideo?.id === video.id ? styles.videoItemActive : {})}}
                    >
                      <div style={styles.videoItemThumb}>🎬</div>
                      <div style={styles.videoItemInfo}>
                        <div style={styles.videoItemTitle}>{video.title}</div>
                        <small>Video {index + 1}</small>
                      </div>
                      {selectedVideo?.id === video.id && <div style={styles.playingBadge}>Playing</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CBT Tab */}
        {activeTab === 'cbt' && (
          <div>
            {cbtList.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📝</div>
                <h3>No CBT Available</h3>
                <p>Practice tests will be added soon.</p>
              </div>
            ) : (
              <div style={styles.cbtGrid}>
                {cbtList.map(cbt => (
                  <div key={cbt.id} style={styles.cbtCard}>
                    <div style={styles.cbtHeader}>
                      <div style={styles.cbtIcon}>📝</div>
                      <div>
                        <h3>{cbt.title}</h3>
                        <p>Computer Based Test</p>
                      </div>
                    </div>
                    <div style={styles.cbtInfo}>
                      <div>⏱️ Practice at your own pace</div>
                      <div>📊 Test your knowledge</div>
                    </div>
                    <button style={styles.startBtn}>Start Practice Test →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  heroSection: {
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '60px 40px',
    color: 'white',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.05)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z\"></path></svg>\')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    backgroundSize: 'cover',
    opacity: 0.3,
  },
  heroContent: {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto',
    zIndex: 2,
  },
  backButton: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '20px',
    backdropFilter: 'blur(10px)',
  },
  courseBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '16px',
    backdropFilter: 'blur(10px)',
  },
  courseTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  courseInstructor: {
    fontSize: '18px',
    marginBottom: '24px',
    opacity: 0.9,
  },
  instructorIcon: {
    marginRight: '8px',
  },
  courseStats: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.15)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    backdropFilter: 'blur(10px)',
  },
  tabsContainer: {
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    padding: '0 40px',
    maxWidth: '1200px',
    margin: '0 auto',
    overflowX: 'auto',
  },
  tab: {
    padding: '16px 24px',
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    color: '#6366f1',
    borderBottomColor: '#6366f1',
  },
  badge: {
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '11px',
    marginLeft: '6px',
  },
  tabContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
  },
  overviewContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  descriptionCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  whatYoullLearn: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  learnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '20px',
  },
  learnItem: {
    padding: '8px 0',
    color: '#334155',
  },
  materialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  materialCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
  },
  materialIcon: {
    fontSize: '40px',
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
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    backgroundColor: '#000',
    borderRadius: '12px',
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
    minWidth: '280px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  videoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
  },
  videoItemActive: {
    backgroundColor: '#e0e7ff',
  },
  videoItemThumb: {
    fontSize: '24px',
  },
  videoItemInfo: {
    flex: 1,
  },
  videoItemTitle: {
    fontWeight: '500',
  },
  playingBadge: {
    fontSize: '12px',
    color: '#10b981',
    backgroundColor: '#d1fae5',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  cbtGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  cbtCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  cbtHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '16px',
  },
  cbtIcon: {
    fontSize: '40px',
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
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '16px',
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
    backgroundColor: '#f0f2f5',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#ef4444',
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