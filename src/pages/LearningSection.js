import React from 'react';

export default function LearningSection({ 
  courses, 
  handleCourseClick,
  setActiveSection,
  hoveredButton,
  pressedButton,
  handleButtonMouseEnter,
  handleButtonMouseLeave,
  handleButtonMouseDown,
  handleButtonMouseUp
}) {
  return (
    <div style={styles.fadeIn}>
      <h2 style={styles.sectionTitle}>📚 Learning</h2>
      {courses.length > 0 ? (
        <div style={styles.courseGrid}>
          {courses.map(course => (
            <div 
              key={course.id} 
              style={styles.courseCard} 
              onClick={() => handleCourseClick(course)}
              onMouseEnter={() => handleButtonMouseEnter(`course-${course.id}`)}
              onMouseLeave={handleButtonMouseLeave}
            >
              <img src={course.thumbnail_url || 'https://picsum.photos/300/150?random=2'} alt={course.title} style={styles.courseImage} />
              <div style={styles.courseContent}>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.courseInstructor}>By {course.profiles?.full_name || 'Admin'}</p>
                <div style={styles.courseFooter}>
                  <span style={styles.coursePrice}>${course.price || 0}</span>
                  <span style={styles.courseLevel}>{course.level}</span>
                </div>
                <button 
                  style={{
                    ...styles.enrollButton,
                    ...(hoveredButton === `enroll-${course.id}` ? styles.enrollButtonHover : {}),
                    ...(pressedButton === `enroll-${course.id}` ? styles.enrollButtonPressed : {})
                  }}
                  onMouseEnter={() => handleButtonMouseEnter(`enroll-${course.id}`)}
                  onMouseLeave={handleButtonMouseLeave}
                  onMouseDown={() => handleButtonMouseDown(`enroll-${course.id}`)}
                  onMouseUp={handleButtonMouseUp}
                >
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>You haven't started any courses yet.</p>
          <button 
            style={{
              ...styles.browseButton,
              ...(hoveredButton === 'browse' ? styles.browseButtonHover : {}),
              ...(pressedButton === 'browse' ? styles.browseButtonPressed : {})
            }}
            onClick={() => setActiveSection('marketplace')}
            onMouseEnter={() => handleButtonMouseEnter('browse')}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown('browse')}
            onMouseUp={handleButtonMouseUp}
          >
            Browse Marketplace
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  fadeIn: {
    animation: 'fadeIn 0.5s ease-in-out',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '25px',
    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #FF6B35 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    '@media (max-width: 768px)': {
      fontSize: '24px',
    },
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  courseCard: {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    border: '1px solid rgba(46, 204, 113, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 30px rgba(255,107,53,0.2)',
      borderColor: '#FF6B35',
    },
  },
  courseImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
  },
  courseContent: {
    padding: '20px',
  },
  courseTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1E293B',
  },
  courseInstructor: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '15px',
  },
  courseFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  coursePrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#FF6B35',
  },
  courseLevel: {
    fontSize: '12px',
    padding: '4px 10px',
    backgroundColor: '#EFF6FF',
    borderRadius: '20px',
    color: '#2563EB',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  enrollButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  enrollButtonHover: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    transform: 'scale(1.02)',
    boxShadow: '0 8px 20px rgba(255,107,53,0.4)',
  },
  enrollButtonPressed: {
    transform: 'scale(0.98)',
    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  browseButton: {
    padding: '12px 30px',
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(255,107,53,0.3)',
  },
  browseButtonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 30px rgba(46,204,113,0.4)',
  },
  browseButtonPressed: {
    transform: 'scale(0.98)',
  },
};