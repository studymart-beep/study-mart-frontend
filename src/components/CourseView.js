import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function CourseView({ course, onClose, onEnroll, isEnrolled }) {
  const [activeTab, setActiveTab] = useState('materials');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (isEnrolled) {
      fetchContents();
    }
  }, [course.id, isEnrolled]);

  const fetchContents = async () => {
    try {
      const response = await api.get(`/courses/${course.id}/contents`);
      if (response.data.success) {
        setContents(response.data.contents || []);
        const firstVideo = response.data.contents?.find(c => c.content_type === 'video');
        if (firstVideo) setSelectedVideo(firstVideo);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    const success = await onEnroll(course.id);
    if (success) {
      fetchContents();
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

  const tabs = [
    { id: 'materials', icon: '📄', label: 'Materials' },
    { id: 'videos', icon: '🎥', label: 'Videos' },
    { id: 'cbt', icon: '📝', label: 'CBT' },
    { id: 'exam', icon: '📋', label: 'Exam' }
  ];

  const materials = contents.filter(c => c.content_type === 'pdf');
  const videos = contents.filter(c => c.content_type === 'video');
  const cbtList = contents.filter(c => c.content_type === 'cbt');
  const exams = contents.filter(c => c.content_type === 'exam');

  if (!isEnrolled) {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
          <div style={styles.header}>
            <h2 style={styles.title}>{course.title}</h2>
            <button onClick={onClose} style={styles.closeButton}>×</button>
          </div>
          <div style={styles.content}>
            <div style={styles.courseInfo}>
              <p style={styles.description}>{course.description}</p>
              <div style={styles.meta}>
                <span>👨‍🏫 {course.instructor}</span>
                <span>📊 {course.level_option || 'All levels'}</span>
              </div>
              <button onClick={handleEnroll} style={styles.enrollButton}>Enroll Now</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalFull} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{course.title}</h2>
            <p style={styles.subtitle}>👨‍🏫 {course.instructor}</p>
          </div>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.tabActive : {})
              }}
            >
              <span>{tab.icon}</span> {tab.label}
              {tab.id === 'materials' && materials.length > 0 && <span style={styles.badge}>{materials.length}</span>}
              {tab.id === 'videos' && videos.length > 0 && <span style={styles.badge}>{videos.length}</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div>
              {loading ? (
                <div style={styles.loading}>Loading materials...</div>
              ) : materials.length === 0 ? (
                <div style={styles.emptyState}>No materials available yet.</div>
              ) : (
                <div style={styles.materialsGrid}>
                  {materials.map((item, index) => (
                    <div key={item.id} style={styles.materialCard}>
                      <div style={styles.materialIcon}>📄</div>
                      <div style={styles.materialInfo}>
                        <h4>{item.title}</h4>
                        <p>PDF Document • {index + 1}</p>
                      </div>
                      <button 
                        onClick={() => window.open(item.file_url, '_blank')} 
                        style={styles.downloadBtn}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div style={styles.videosContainer}>
              {loading ? (
                <div style={styles.loading}>Loading videos...</div>
              ) : videos.length === 0 ? (
                <div style={styles.emptyState}>No videos available yet.</div>
              ) : (
                <>
                  {/* Video Player */}
                  {selectedVideo && (
                    <div style={styles.videoPlayer}>
                      <h3 style={styles.videoTitle}>{selectedVideo.title}</h3>
                      <div style={styles.videoWrapper}>
                        <iframe
                          src={`https://www.youtube.com/embed/${extractVideoId(selectedVideo.video_url)}?modestbranding=1&controls=1&rel=0&showinfo=0`}
                          title={selectedVideo.title}
                          style={styles.videoFrame}
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Video List */}
                  <div style={styles.videoList}>
                    <h4>Course Videos ({videos.length})</h4>
                    {videos.map((video, index) => (
                      <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        style={{
                          ...styles.videoItem,
                          ...(selectedVideo?.id === video.id ? styles.videoItemActive : {})
                        }}
                      >
                        <span>🎬</span>
                        <div>
                          <div style={styles.videoItemTitle}>{video.title}</div>
                          <small>Video {index + 1}</small>
                        </div>
                        {selectedVideo?.id === video.id && <span style={styles.playingIcon}>▶ Playing</span>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* CBT Tab */}
          {activeTab === 'cbt' && (
            <div>
              {loading ? (
                <div style={styles.loading}>Loading CBT questions...</div>
              ) : cbtList.length === 0 ? (
                <div style={styles.emptyState}>No CBT available yet.</div>
              ) : (
                cbtList.map(cbt => (
                  <div key={cbt.id} style={styles.cbtCard}>
                    <div style={styles.cbtHeader}>
                      <span style={styles.cbtIcon}>📝</span>
                      <h3>{cbt.title}</h3>
                    </div>
                    <p>Computer Based Test - Practice questions to test your knowledge</p>
                    <button style={styles.startBtn}>Start CBT</button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Exam Tab */}
          {activeTab === 'exam' && (
            <div>
              {loading ? (
                <div style={styles.loading}>Loading exams...</div>
              ) : exams.length === 0 ? (
                <div style={styles.emptyState}>No exams available yet.</div>
              ) : (
                exams.map(exam => (
                  <div key={exam.id} style={styles.examCard}>
                    <div style={styles.examHeader}>
                      <span style={styles.examIcon}>📋</span>
                      <h3>{exam.title}</h3>
                    </div>
                    <p>Final Examination - Complete to earn your certificate</p>
                    <div style={styles.examMeta}>
                      <span>⏱️ Time Limit: 60 mins</span>
                      <span>📝 Questions: 50</span>
                    </div>
                    <button style={styles.startExamBtn}>Start Exam</button>
                  </div>
                ))
              )}
            </div>
          )}
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
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalFull: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '1200px',
    height: '85vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#64748b',
    padding: '0 10px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '16px 24px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    backgroundColor: '#6366f1',
    color: 'white',
  },
  badge: {
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '10px',
    marginLeft: '6px',
  },
  tabContent: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
  materialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  materialCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  materialIcon: {
    fontSize: '32px',
  },
  materialInfo: {
    flex: 1,
  },
  downloadBtn: {
    padding: '6px 12px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  videosContainer: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  videoPlayer: {
    flex: 2,
    minWidth: '300px',
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
    minWidth: '250px',
  },
  videoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '8px',
  },
  videoItemActive: {
    backgroundColor: '#e0e7ff',
  },
  videoItemTitle: {
    fontWeight: '500',
  },
  playingIcon: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#10b981',
  },
  cbtCard: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  cbtHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  cbtIcon: {
    fontSize: '28px',
  },
  examCard: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  examHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  examIcon: {
    fontSize: '28px',
  },
  examMeta: {
    display: 'flex',
    gap: '20px',
    marginTop: '12px',
    fontSize: '13px',
    color: '#64748b',
  },
  startBtn: {
    marginTop: '16px',
    padding: '10px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  startExamBtn: {
    marginTop: '16px',
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  courseInfo: {
    padding: '20px',
  },
  description: {
    fontSize: '16px',
    color: '#334155',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  meta: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    color: '#64748b',
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
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
  },
};