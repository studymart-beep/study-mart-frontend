import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LearningSection() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses');
      if (response.data.success) {
        setCourses(response.data.courses || []);
        const uniqueCategories = [...new Set(response.data.courses.map(c => c.category))];
        setCategories(uniqueCategories.filter(Boolean));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get('/courses/my-enrollments');
      if (response.data.success) {
        setEnrolledCourses(response.data.enrollments.map(e => e.course_id));
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setEnrolledCourses([]);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      if (response.data.success) {
        setEnrolledCourses([...enrolledCourses, courseId]);
        return true;
      }
    } catch (error) {
      console.error('Error enrolling:', error);
    }
    return false;
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) return url.split('/embed/')[1].split('?')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    if (url.includes('v=')) {
      try { return new URL(url).searchParams.get('v'); } catch (e) { return null; }
    }
    return url;
  };

  const filteredCourses = selectedCategory === 'all' ? courses : courses.filter(c => c.category === selectedCategory);

  return (
    <div style={styles.container}>
      {/* Header with Logo */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Study Mart" style={styles.logoImage} />
        </div>
        <h1 style={styles.title}>Learning Center</h1>
        <p style={styles.subtitle}>Learn. Buy. Grow.</p>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div style={styles.categoriesSection}>
          <button onClick={() => setSelectedCategory('all')} style={{...styles.categoryButton, ...(selectedCategory === 'all' ? styles.categoryActive : {})}}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{...styles.categoryButton, ...(selectedCategory === cat ? styles.categoryActive : {})}}>{cat}</button>
          ))}
        </div>
      )}

      {/* Courses Grid */}
      {loading ? (
        <div style={styles.loadingContainer}><div style={styles.loader}></div></div>
      ) : filteredCourses.length === 0 ? (
        <div style={styles.emptyState}>No courses available yet.</div>
      ) : (
        <div style={styles.coursesGrid}>
          {filteredCourses.map(course => {
            const isEnrolled = enrolledCourses.includes(course.id);
            const videoId = extractVideoId(course.youtube_url);
            return (
              <div key={course.id} style={styles.courseCard} onClick={() => handleCourseClick(course)}>
                <div style={styles.thumbnailContainer}>
                  {videoId ? (
                    <img src={`https://img.youtube.com/vi/${videoId}/0.jpg`} alt={course.title} style={styles.thumbnail} />
                  ) : (
                    <div style={styles.placeholderThumbnail}>📹</div>
                  )}
                  {isEnrolled && <div style={styles.enrolledBadge}>Enrolled</div>}
                </div>
                <div style={styles.courseContent}>
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                  <p style={styles.courseInstructor}>👨‍🏫 {course.instructor}</p>
                  <p style={styles.courseDescription}>{course.description}</p>
                  <div style={styles.courseFooter}>
                    <div style={styles.courseMeta}>
                      <span>📊 {course.level || 'All levels'}</span>
                      <span>⏱️ {course.duration || 'Self-paced'}</span>
                    </div>
                    <button style={isEnrolled ? styles.watchButton : styles.enrollButton}>
                      {isEnrolled ? 'Watch Now' : 'Enroll'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && selectedCourse && (
        <div style={styles.modalOverlay} onClick={() => setShowCourseModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedCourse.title}</h2>
              <button onClick={() => setShowCourseModal(false)} style={styles.closeButton}>×</button>
            </div>
            <div style={styles.modalContent}>
              {extractVideoId(selectedCourse.youtube_url) ? (
                <div style={styles.videoContainer}>
                  <iframe
                    src={`https://www.youtube.com/embed/${extractVideoId(selectedCourse.youtube_url)}?modestbranding=1&controls=1&rel=0&showinfo=0`}
                    title={selectedCourse.title}
                    style={styles.videoFrame}
                    allowFullScreen
                  />
                </div>
              ) : (
                <div style={styles.noVideo}>Video unavailable</div>
              )}
              <div style={styles.courseDetails}>
                <p style={styles.courseDescription}>{selectedCourse.description}</p>
                <div style={styles.courseInfo}>
                  <span>👨‍🏫 {selectedCourse.instructor}</span>
                  <span>📊 {selectedCourse.level}</span>
                  <span>⏱️ {selectedCourse.duration}</span>
                </div>
                {!enrolledCourses.includes(selectedCourse.id) ? (
                  <button onClick={() => handleEnroll(selectedCourse.id)} style={styles.enrollModalButton}>Enroll Now</button>
                ) : (
                  <div style={styles.enrolledMessage}>✅ You are enrolled in this course</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  logoImage: {
    width: '60px',
    height: '60px',
    borderRadius: '15px',
    objectFit: 'cover',
    border: '2px solid #6366f1',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b',
    letterSpacing: '1px',
  },
  categoriesSection: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryButton: {
    padding: '8px 20px',
    backgroundColor: '#e2e8f0',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    color: '#64748b',
    cursor: 'pointer',
  },
  categoryActive: {
    backgroundColor: '#6366f1',
    color: 'white',
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  thumbnailContainer: {
    position: 'relative',
    height: '180px',
    backgroundColor: '#f1f5f9',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    backgroundColor: '#e2e8f0',
  },
  enrolledBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  courseContent: {
    padding: '20px',
  },
  courseTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '5px',
  },
  courseInstructor: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '10px',
  },
  courseDescription: {
    fontSize: '14px',
    color: '#334155',
    marginBottom: '15px',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  courseFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseMeta: {
    display: 'flex',
    gap: '10px',
    fontSize: '12px',
    color: '#64748b',
  },
  enrollButton: {
    padding: '6px 15px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  watchButton: {
    padding: '6px 15px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '50px',
  },
  loader: {
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: 'white',
    borderRadius: '12px',
    color: '#64748b',
    fontSize: '16px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#64748b',
  },
  modalContent: {
    padding: '20px',
  },
  videoContainer: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    marginBottom: '20px',
  },
  videoFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
  },
  noVideo: {
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    marginBottom: '20px',
    color: '#64748b',
  },
  courseDetails: {
    padding: '10px 0',
  },
  courseInfo: {
    display: 'flex',
    gap: '20px',
    margin: '15px 0',
    fontSize: '14px',
    color: '#64748b',
  },
  enrollModalButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  enrolledMessage: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
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