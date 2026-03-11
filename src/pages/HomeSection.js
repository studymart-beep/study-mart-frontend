import React from 'react';

export default function HomeSection({ 
  user, 
  courses, 
  handleCourseClick,
  hoveredButton,
  handleButtonMouseEnter,
  handleButtonMouseLeave
}) {
  return (
    <div style={styles.fadeIn}>
      <h2 style={styles.sectionTitle}>🏠 Home</h2>
      <div style={styles.welcomeCard}>
        <h3 style={styles.welcomeTitle}>Welcome back, {user?.profile?.full_name || 'Student'}!</h3>
        <p style={styles.welcomeText}>Continue your learning journey with Study-Mart</p>
        <div style={styles.welcomeGlow}></div>
      </div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>0</h3>
          <p style={styles.statLabel}>Courses In Progress</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>0</h3>
          <p style={styles.statLabel}>Completed Courses</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{courses.length}</h3>
          <p style={styles.statLabel}>Available Courses</p>
        </div>
      </div>
      <h3 style={styles.subTitle}>Continue Learning</h3>
      <div style={styles.courseGrid}>
        {courses.slice(0,3).map(course => (
          <div 
            key={course.id} 
            style={styles.courseCard} 
            onClick={() => handleCourseClick(course)}
            onMouseEnter={() => handleButtonMouseEnter(`course-${course.id}`)}
            onMouseLeave={handleButtonMouseLeave}
          >
            <img src={course.thumbnail_url || 'https://picsum.photos/300/150?random=1'} alt={course.title} style={styles.courseImage} />
            <div style={styles.courseContent}>
              <h4 style={styles.courseTitle}>{course.title}</h4>
              <p style={styles.courseInstructor}>By {course.profiles?.full_name || 'Instructor'}</p>
              <div style={styles.courseFooter}>
                <span style={styles.coursePrice}>${course.price || 0}</span>
                <span style={styles.courseLevel}>{course.level}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
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
  subTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '30px 0 20px',
    position: 'relative',
    paddingLeft: '15px',
    borderLeft: '4px solid #FF6B35',
    '@media (max-width: 768px)': {
      fontSize: '20px',
    },
  },
  welcomeCard: {
    position: 'relative',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    padding: '40px',
    borderRadius: '24px',
    marginBottom: '40px',
    boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)',
    overflow: 'hidden',
    border: '1px solid rgba(46, 204, 113, 0.2)',
    '@media (max-width: 768px)': {
      padding: '20px',
    },
  },
  welcomeGlow: {
    position: 'absolute',
    top: '-50%',
    right: '-10%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, rgba(46,204,113,0.1) 50%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '10px',
    position: 'relative',
    zIndex: 1,
    '@media (max-width: 768px)': {
      fontSize: '20px',
    },
  },
  welcomeText: {
    fontSize: '18px',
    color: '#4B5563',
    position: 'relative',
    zIndex: 1,
    '@media (max-width: 768px)': {
      fontSize: '16px',
    },
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  statCard: {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    padding: '25px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
    border: '1px solid rgba(37, 99, 235, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(255,107,53,0.15)',
    },
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '16px',
    color: '#4B5563',
    fontWeight: '500',
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
};