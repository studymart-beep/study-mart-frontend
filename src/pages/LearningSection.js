import React from 'react';

export default function LearningSection({
  courses = [],
  categories = [],
  instructors = [],
  loading = false,
  error = null,
  hoveredButton,
  pressedButton,
  handleButtonMouseEnter,
  handleButtonMouseLeave,
  handleButtonMouseDown,
  handleButtonMouseUp
}) {
  
  const safeCourses = courses || [];
  const safeCategories = categories || [];
  const safeInstructors = instructors || [];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Learning Center</h1>
        <p style={styles.subtitle}>Expand your knowledge with our courses</p>
      </div>

      {/* Categories */}
      <div style={styles.categoriesSection}>
        <h2 style={styles.sectionTitle}>Browse Categories</h2>
        <div style={styles.categoriesGrid}>
          {safeCategories.length > 0 ? (
            safeCategories.map(cat => (
              <div key={cat.id} style={styles.categoryCard}>
                <span style={styles.categoryIcon}>{cat.icon || '📚'}</span>
                <h3 style={styles.categoryName}>{cat.name}</h3>
                <p style={styles.categoryCount}>{cat.count || 0} courses</p>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No categories available</div>
          )}
        </div>
      </div>

      {/* Featured Courses */}
      <div style={styles.coursesSection}>
        <h2 style={styles.sectionTitle}>Featured Courses</h2>
        <div style={styles.coursesGrid}>
          {safeCourses.length > 0 ? (
            safeCourses.map(course => (
              <div key={course.id} style={styles.courseCard}>
                <div style={styles.courseImage}>
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.title} style={styles.courseImg} />
                  ) : (
                    <span style={styles.courseImagePlaceholder}>📖</span>
                  )}
                </div>
                <div style={styles.courseContent}>
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                  <p style={styles.courseInstructor}>{course.instructor || 'Expert Instructor'}</p>
                  <p style={styles.courseDescription}>{course.description || 'No description available'}</p>
                  <div style={styles.courseMeta}>
                    <span>⏱️ {course.duration || 'Self-paced'}</span>
                    <span>⭐ {course.rating || '4.5'} ({course.reviews || 0})</span>
                  </div>
                  <button style={styles.enrollButton}>Enroll Now</button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No courses available</div>
          )}
        </div>
      </div>

      {/* Top Instructors */}
      <div style={styles.instructorsSection}>
        <h2 style={styles.sectionTitle}>Top Instructors</h2>
        <div style={styles.instructorsGrid}>
          {safeInstructors.length > 0 ? (
            safeInstructors.map(instructor => (
              <div key={instructor.id} style={styles.instructorCard}>
                <div style={styles.instructorAvatar}>
                  {instructor.avatar_url ? (
                    <img src={instructor.avatar_url} alt={instructor.name} style={styles.instructorImage} />
                  ) : (
                    <span style={styles.instructorAvatarPlaceholder}>👤</span>
                  )}
                </div>
                <h3 style={styles.instructorName}>{instructor.name}</h3>
                <p style={styles.instructorTitle}>{instructor.title || 'Expert Instructor'}</p>
                <p style={styles.instructorStudents}>{instructor.students || 0} students</p>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No instructors available</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
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
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
  },
  categoriesSection: {
    marginBottom: '40px',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  categoryCard: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    },
  },
  categoryIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '10px',
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '5px',
  },
  categoryCount: {
    fontSize: '14px',
    color: '#64748b',
  },
  coursesSection: {
    marginBottom: '40px',
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
    },
  },
  courseImage: {
    height: '180px',
    backgroundColor: '#667eea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '48px',
  },
  courseImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  courseImagePlaceholder: {
    fontSize: '48px',
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
  },
  courseMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '15px',
  },
  enrollButton: {
    width: '100%',
    padding: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      opacity: 0.9,
      transform: 'scale(1.02)',
    },
  },
  instructorsSection: {
    marginBottom: '40px',
  },
  instructorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  instructorCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
    },
  },
  instructorAvatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    backgroundColor: '#e2e8f0',
    margin: '0 auto 15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  instructorImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  instructorAvatarPlaceholder: {
    fontSize: '40px',
  },
  instructorName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '5px',
  },
  instructorTitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '10px',
  },
  instructorStudents: {
    fontSize: '13px',
    color: '#667eea',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
    fontSize: '16px',
  },
};