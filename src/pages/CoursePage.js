import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, [courseId]);

  useEffect(() => {
    if (isEnrolled) {
      fetchContents();
    }
  }, [isEnrolled]);

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

  const checkEnrollment = async () => {
    try {
      const response = await api.get('/courses/my-enrollments');
      if (response.data.success) {
        const enrolled = response.data.enrollments.some(e => e.course_id === courseId);
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
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

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      if (response.data.success) {
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
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
  const exams = contents.filter(c => c.content_type === 'exam');

  if (loading) {
    return <div style={styles.loading}>Loading course...</div>;
  }

  if (!course) {
    return <div style={styles.loading}>Course not found</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.courseTitle}>{course.title}</h1>
        <p style={styles.courseInstructor}>👨‍🏫 {course.instructor || 'Study Mart Instructor'}</p>
        
        {!isEnrolled && (
          <button onClick={handleEnroll} disabled={enrolling} style={styles.enrollButton}>
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        )}
        {isEnrolled && (
          <div style={styles.enrolledBadge}>✅ You are enrolled in this course</div>
        )}
      </div>

      {/* Tabs - Only show if enrolled */}
      {isEnrolled && (
        <div style={styles.tabs}>
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
          <button
            onClick={() => setActiveTab('exam')}
            style={{...styles.tab, ...(activeTab === 'exam' ? styles.tabActive : {})}}
          >
            📋 Exam {exams.length > 0 && <span style={styles.badge}>{exams.length}</span>}
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {!isEnrolled ? (
          <div style={styles.lockedMessage}>
            <h2>🔒 Enroll to Access Course Content</h2>
            <p>Click the "Enroll Now" button above to start learning</p>
          </div>
        ) : (
          <>
            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <div>
                {materials.length === 0 ? (
                  <div style={styles.emptyState}>No materials uploaded yet.</div>
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
                {videos.length === 0 ? (
                  <div style={styles.emptyState}>No videos uploaded yet.</div>
                ) : (
                  <>
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
                          <span>🎬</span>
                          <div style={styles.videoItemTitle}>{video.title}</div>
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
                {cbtList.length === 0 ? (
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
                {exams.length === 0 ? (
                  <div style={styles.emptyState}>No exams available yet.</div>
                ) : (
                  exams.map(exam => (
                    <div key={exam.id} style={styles.examCard}>
                      <div style={styles.examHeader}>
                        <span style={styles.examIcon}>📋</span>
                        <h3>{exam.title}</h3>
                      </div>
                      <p>Final Examination - Complete to earn your certificate</p>
                      <button style={styles.startExamBtn}>Start Exam</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    padding: '30px',
    borderBottom: '1px solid #e2e8f0',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#6366f1',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  courseTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  courseInstructor: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '20px',
  },
  enrollButton: {
    padding: '12px 24px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  enrolledBadge: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '16px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    fontSize: '11px',
    marginLeft: '6px',
  },
  tabContent: {
    padding: '30px',
  },
  lockedMessage: {
    textAlign: 'center',
    padding: '80px',
    backgroundColor: 'white',
    borderRadius: '12px',
    color: '#64748b',
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
    padding: '16px',
    backgroundColor: 'white',
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
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
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
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
  },
  videoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  videoItemActive: {
    backgroundColor: '#e0e7ff',
  },
  videoItemTitle: {
    fontWeight: '500',
  },
  cbtCard: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0',
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
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0',
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
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '12px',
    color: '#64748b',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#64748b',
  },
};