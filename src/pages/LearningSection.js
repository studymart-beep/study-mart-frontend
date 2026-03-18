import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CourseView from '../components/CourseView';

export default function LearningSection() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseView, setShowCourseView] = useState(false);
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
        
        // Extract unique categories
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
        const enrollments = response.data.enrollments || [];
        setEnrolledCourses(enrollments.map(e => e.course_id));
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
        setEnrolledCourses(prev => [...prev, courseId]);
        return true;
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
    return false;
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowCourseView(true);
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    
    if (url.includes('youtube.com/embed/')) {
      return url.split('/embed/')[1].split('?')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('v=')) {
      try {
        return new URL(url).searchParams.get('v');
      } catch (e) {
        return null;
      }
    }
    return url;
  };

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Learning Center</h1>
        <p style={styles.subtitle}>Expand your knowledge with our courses</p>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div style={styles.categoriesSection}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              ...styles.categoryButton,
              ...(selectedCategory === 'all' ? styles.categoryActive : {})
            }}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === cat ? styles.categoryActive : {})
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Courses Grid */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No courses available yet.</p>
        </div>
      ) : (
        <div style={styles.coursesGrid}>
          {filteredCourses.map(course => {
            const isEnrolled = enrolledCourses && enrolledCourses.includes(course.id);
            const videoId = extractVideoId(course.youtube_url);
            
            return (
              <div 
                key={course.id} 
                style={styles.courseCard}
                onClick={() => handleCourseClick(course)}
              >
                <div style={styles.thumbnailContainer}>
                  {videoId ? (
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                      alt={course.title}
                      style={styles.thumbnail}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/320x180?text=Course+Video';
                      }}
                    />
                  ) : (
                    <div style={styles.placeholderThumbnail}>
                      <span>📹</span>
                    </div>
                  )}
                  <div style={styles.playOverlay}>
                    <span style={styles.playIcon}>▶</span>
                  </div>
                  {isEnrolled && (
                    <div style={styles.enrolledBadge}>Enrolled</div>
                  )}
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
                    <button 
                      style={isEnrolled ? styles.watchButton : styles.enrollButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      {isEnrolled ? 'Watch Now' : 'Enroll'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course View Modal */}
      {showCourseView && selectedCourse && (
        <CourseView
          course={selectedCourse}
          onClose={() => setShowCourseView(false)}
          onEnroll={handleEnroll}
          isEnrolled={enrolledCourses && enrolledCourses.includes(selectedCourse.id)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b'
  },
  categoriesSection: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  categoryButton: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  categoryActive: {
    backgroundColor: '#6366f1',
    color: 'white'
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer'
  },
  thumbnailContainer: {
    position: 'relative',
    height: '180px',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9'
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    backgroundColor: '#e2e8f0',
    color: '#94a3b8'
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease'
  },
  playIcon: {
    fontSize: '48px',
    color: 'white',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
  },
  enrolledBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  courseContent: {
    padding: '20px'
  },
  courseTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '5px'
  },
  courseInstructor: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '10px'
  },
  courseDescription: {
    fontSize: '14px',
    color: '#334155',
    marginBottom: '15px',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  courseFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  courseMeta: {
    display: 'flex',
    gap: '10px',
    fontSize: '12px',
    color: '#64748b'
  },
  enrollButton: {
    padding: '6px 12px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  watchButton: {
    padding: '6px 12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '50px'
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite'
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: 'white',
    borderRadius: '12px',
    color: '#64748b',
    fontSize: '16px'
  }
};