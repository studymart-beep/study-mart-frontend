import React from 'react';

export default function LearningSection() {
  const courses = [
    { id: 1, title: 'React for Beginners', instructor: 'John Doe', duration: '10 hours', level: 'Beginner' },
    { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', duration: '15 hours', level: 'Advanced' },
    { id: 3, title: 'Node.js Masterclass', instructor: 'Mike Johnson', duration: '20 hours', level: 'Intermediate' },
    { id: 4, title: 'Python Programming', instructor: 'Sarah Williams', duration: '12 hours', level: 'Beginner' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Learning Center</h1>
      <p style={styles.subtitle}>Expand your knowledge with our courses</p>
      
      <div style={styles.coursesGrid}>
        {courses.map(course => (
          <div key={course.id} style={styles.courseCard}>
            <h3 style={styles.courseTitle}>{course.title}</h3>
            <p style={styles.courseInstructor}>👨‍🏫 {course.instructor}</p>
            <div style={styles.courseMeta}>
              <span>⏱️ {course.duration}</span>
              <span>📊 {course.level}</span>
            </div>
            <button style={styles.enrollButton}>Enroll Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '30px',
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  courseCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    },
  },
  courseTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '10px',
  },
  courseInstructor: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '15px',
  },
  courseMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '20px',
  },
  enrollButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#5a67d8',
    },
  },
};