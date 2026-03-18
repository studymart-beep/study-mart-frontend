import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AdminCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    youtube_url: '',
    duration: '',
    level: 'Beginner',
    category: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses');
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/courses', formData);
      if (response.data.success) {
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          instructor: '',
          youtube_url: '',
          duration: '',
          level: 'Beginner',
          category: ''
        });
        fetchCourses();
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const response = await api.delete(`/courses/${courseId}`);
      if (response.data.success) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const extractVideoId = (url) => {
    if (url.includes('youtube.com/embed/')) {
      return url.split('/embed/')[1].split('?')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('v=')) {
      return new URL(url).searchParams.get('v');
    }
    return url;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Course Management</h1>
        <button onClick={() => setShowForm(true)} style={styles.addButton}>
          + Add New Course
        </button>
      </div>

      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Add New Course</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="e.g., React for Beginners"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  style={styles.textarea}
                  rows="4"
                  placeholder="Course description..."
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Instructor Name</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>YouTube URL</label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <small style={styles.helper}>
                  Any YouTube URL works (youtu.be/, youtube.com/watch?v=)
                </small>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="e.g., 2h 30m"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Programming, Design, Marketing"
                />
              </div>

              <div style={styles.formActions}>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                  {loading ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.coursesGrid}>
        {courses.map(course => (
          <div key={course.id} style={styles.courseCard}>
            <div style={styles.courseHeader}>
              <h3 style={styles.courseTitle}>{course.title}</h3>
              <button onClick={() => handleDelete(course.id)} style={styles.deleteButton}>
                ×
              </button>
            </div>
            <p style={styles.courseInstructor}>👨‍🏫 {course.instructor}</p>
            <p style={styles.courseDescription}>{course.description}</p>
            <div style={styles.courseMeta}>
              <span>📊 {course.level}</span>
              <span>⏱️ {course.duration}</span>
            </div>
            <div style={styles.videoPreview}>
              <img 
                src={`https://img.youtube.com/vi/${extractVideoId(course.youtube_url)}/0.jpg`}
                alt={course.title}
                style={styles.thumbnail}
              />
              <span style={styles.playIcon}>▶</span>
            </div>
          </div>
        ))}
      </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  courseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  courseTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  deleteButton: {
    width: '30px',
    height: '30px',
    borderRadius: '15px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer'
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
    lineHeight: '1.5'
  },
  courseMeta: {
    display: 'flex',
    gap: '15px',
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '15px'
  },
  videoPreview: {
    position: 'relative',
    height: '180px',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '48px',
    color: 'white',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b'
  },
  input: {
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical'
  },
  select: {
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px'
  },
  helper: {
    fontSize: '12px',
    color: '#64748b'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  }
};