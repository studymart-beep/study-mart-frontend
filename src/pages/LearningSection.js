import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LearningSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleCourseClick = (course) => {
    navigate(`/course/${course.id}`);
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

  const filteredCourses = selectedCategory === 'all' ? courses : courses.filter(c => c.category === selectedCategory);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Study Mart" style={styles.logoImage} />
        </div>
        <h1 style={styles.title}>Learning Center</h1>
        <p style={styles.subtitle}>Learn. Buy. Grow.</p>
      </div>

      {categories.length > 0 && (
        <div style={styles.categoriesSection}>
          <button onClick={() => setSelectedCategory('all')} style={{...styles.categoryButton, ...(selectedCategory === 'all' ? styles.categoryActive : {})}}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{...styles.categoryButton, ...(selectedCategory === cat ? styles.categoryActive : {})}}>{cat}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={styles.loadingContainer}><div style={styles.loader}></div></div>
      ) : filteredCourses.length === 0 ? (
        <div style={styles.emptyState}>No courses available yet.</div>
      ) : (
        <div style={styles.coursesGrid}>
          {filteredCourses.map(course => {
            const videoId = extractVideoId(course.youtube_url);
            return (
              <div key={course.id} style={styles.courseCard} onClick={() => handleCourseClick(course)}>
                <div style={styles.thumbnailContainer}>
                  {videoId ? (
                    <img src={`https://img.youtube.com/vi/${videoId}/0.jpg`} alt={course.title} style={styles.thumbnail} />
                  ) : (
                    <div style={styles.placeholderThumbnail}>📹</div>
                  )}
                </div>
                <div style={styles.courseContent}>
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                  <p style={styles.courseInstructor}>👨‍🏫 {course.instructor}</p>
                  <p style={styles.courseDescription}>{course.description}</p>
                  <div style={styles.courseFooter}>
                    <div style={styles.courseMeta}>
                      <span>📊 {course.level_option || 'All levels'}</span>
                      <span>⏱️ {course.duration || 'Self-paced'}</span>
                    </div>
                    <button style={styles.viewButton}>View Course</button>
                  </div>
                </div>
              </div>
            );
          })}
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
    transition: 'transform 0.2s ease',
  },
  thumbnailContainer: {
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
  viewButton: {
    padding: '6px 15px',
    backgroundColor: '#6366f1',
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