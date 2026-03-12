import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SellerApplicationsManager from '../components/SellerApplicationsManager';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: 1,
    level: 'beginner',
    thumbnail_url: '',
    status: 'draft'
  });
  const [courseContent, setCourseContent] = useState({
    videos: [],
    pdfs: [],
    qas: []
  });
  const [categories, setCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    pendingInstructors: 0,
    pendingCourses: 0,
    publishedCourses: 0
  });

  // UI state
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'users', 'applications', 'settings'
  const [hoveredButton, setHoveredButton] = useState(null);
  const [pressedButton, setPressedButton] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching admin stats...');
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        console.log('✅ Stats loaded:', response.data.stats);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('📚 Fetching courses...');
      
      const response = await api.get('/admin/courses');
      
      if (response.data && response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/courses/categories/all');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourseContent = async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/content`);
      if (response.data.success) {
        setCourseContent(response.data.content);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseData({
      title: course.title,
      description: course.description,
      price: course.price,
      category_id: course.category_id,
      level: course.level,
      thumbnail_url: course.thumbnail_url || '',
      status: course.status
    });
    fetchCourseContent(course.id);
    setShowWizard(true);
    setWizardStep(1);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    fetchCourseContent(course.id);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      console.log(`🗑️ Deleting course: ${courseId}`);
      const response = await api.delete(`/admin/courses/${courseId}`);
      
      if (response.data.success) {
        alert('Course deleted successfully!');
        fetchCourses();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const handleInputChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      url: URL.createObjectURL(file),
      title: file.name
    }));
    setCourseContent({
      ...courseContent,
      videos: [...courseContent.videos, ...newVideos]
    });
  };

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      url: URL.createObjectURL(file),
      title: file.name
    }));
    setCourseContent({
      ...courseContent,
      pdfs: [...courseContent.pdfs, ...newPdfs]
    });
  };

  const handleAddQA = () => {
    const newQA = {
      id: Date.now() + Math.random(),
      question: '',
      answer: '',
      isEditing: true
    };
    setCourseContent({
      ...courseContent,
      qas: [...courseContent.qas, newQA]
    });
  };

  const handleQAChange = (id, field, value) => {
    const updatedQAs = courseContent.qas.map(qa => 
      qa.id === id ? { ...qa, [field]: value } : qa
    );
    setCourseContent({
      ...courseContent,
      qas: updatedQAs
    });
  };

  const handleQASave = (id) => {
    const updatedQAs = courseContent.qas.map(qa => 
      qa.id === id ? { ...qa, isEditing: false } : qa
    );
    setCourseContent({
      ...courseContent,
      qas: updatedQAs
    });
  };

  const handleQADelete = (id) => {
    setCourseContent({
      ...courseContent,
      qas: courseContent.qas.filter(qa => qa.id !== id)
    });
  };

  const handleRemoveVideo = (id) => {
    setCourseContent({
      ...courseContent,
      videos: courseContent.videos.filter(v => v.id !== id)
    });
  };

  const handleRemovePdf = (id) => {
    setCourseContent({
      ...courseContent,
      pdfs: courseContent.pdfs.filter(p => p.id !== id)
    });
  };

  const handleNextStep = () => {
    if (wizardStep === 1) {
      if (!courseData.title || !courseData.description || !courseData.price) {
        alert('Please fill in all required fields');
        return;
      }
    }
    setWizardStep(wizardStep + 1);
  };

  const handlePrevStep = () => {
    setWizardStep(wizardStep - 1);
  };

  const handleSaveDraft = async () => {
    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('price', courseData.price);
      formData.append('category_id', courseData.category_id);
      formData.append('level', courseData.level);
      formData.append('thumbnail_url', courseData.thumbnail_url);
      formData.append('status', 'draft');
      
      courseContent.videos.forEach((video) => {
        if (video.file) {
          formData.append('videos', video.file);
        }
      });
      
      courseContent.pdfs.forEach((pdf) => {
        if (pdf.file) {
          formData.append('pdfs', pdf.file);
        }
      });
      
      formData.append('qas', JSON.stringify(courseContent.qas.filter(qa => qa.question && qa.answer)));

      const response = await api.post('/courses/create-with-content', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert('Course saved as draft!');
        resetWizard();
        fetchCourses();
        fetchStats();
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handlePublish = async () => {
    try {
      if (editingCourse) {
        const formData = new FormData();
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('price', courseData.price);
        formData.append('category_id', courseData.category_id);
        formData.append('level', courseData.level);
        formData.append('thumbnail_url', courseData.thumbnail_url);
        formData.append('status', 'published');
        
        courseContent.videos.forEach((video) => {
          if (video.file) {
            formData.append('videos', video.file);
          }
        });
        
        courseContent.pdfs.forEach((pdf) => {
          if (pdf.file) {
            formData.append('pdfs', pdf.file);
          }
        });
        
        formData.append('qas', JSON.stringify(courseContent.qas.filter(qa => qa.question && qa.answer)));

        const response = await api.put(`/courses/${editingCourse.id}/update-with-content`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.success) {
          alert('Course published successfully!');
          resetWizard();
          fetchCourses();
          fetchStats();
        }
      } else {
        const formData = new FormData();
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('price', courseData.price);
        formData.append('category_id', courseData.category_id);
        formData.append('level', courseData.level);
        formData.append('thumbnail_url', courseData.thumbnail_url);
        formData.append('status', 'published');
        
        courseContent.videos.forEach((video) => {
          formData.append('videos', video.file);
        });
        
        courseContent.pdfs.forEach((pdf) => {
          formData.append('pdfs', pdf.file);
        });
        
        formData.append('qas', JSON.stringify(courseContent.qas.filter(qa => qa.question && qa.answer)));

        const response = await api.post('/courses/create-with-content', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.success) {
          alert('Course published successfully!');
          resetWizard();
          fetchCourses();
          fetchStats();
        }
      }
    } catch (error) {
      console.error('Error publishing course:', error);
      alert('Failed to publish course');
    }
  };

  const resetWizard = () => {
    setShowWizard(false);
    setEditingCourse(null);
    setSelectedCourse(null);
    setWizardStep(1);
    setCourseData({
      title: '',
      description: '',
      price: '',
      category_id: 1,
      level: 'beginner',
      thumbnail_url: '',
      status: 'draft'
    });
    setCourseContent({
      videos: [],
      pdfs: [],
      qas: []
    });
  };

  const handleLogout = () => {
    signOut();
  };

  // Button interaction handlers
  const handleButtonMouseEnter = (buttonName) => {
    setHoveredButton(buttonName);
  };

  const handleButtonMouseLeave = () => {
    setHoveredButton(null);
    setPressedButton(null);
  };

  const handleButtonMouseDown = (buttonName) => {
    setPressedButton(buttonName);
  };

  const handleButtonMouseUp = () => {
    setPressedButton(null);
  };

  // View course content modal
  const renderCourseViewModal = () => {
    if (!selectedCourse) return null;
    
    return (
      <div style={styles.modalOverlay} onClick={() => setSelectedCourse(null)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>{selectedCourse.title}</h2>
            <button onClick={() => setSelectedCourse(null)} style={styles.closeButton}>×</button>
          </div>
          <div style={styles.modalBody}>
            <p><strong>Description:</strong> {selectedCourse.description}</p>
            <p><strong>Price:</strong> ${selectedCourse.price}</p>
            <p><strong>Level:</strong> {selectedCourse.level}</p>
            <p><strong>Status:</strong> {selectedCourse.status}</p>
            
            <h3>Videos ({courseContent.videos?.length || 0})</h3>
            <div style={styles.contentList}>
              {courseContent.videos?.map(v => (
                <div key={v.id} style={styles.contentItem}>🎬 {v.title}</div>
              ))}
            </div>

            <h3>PDFs ({courseContent.pdfs?.length || 0})</h3>
            <div style={styles.contentList}>
              {courseContent.pdfs?.map(p => (
                <div key={p.id} style={styles.contentItem}>📄 {p.title}</div>
              ))}
            </div>

            <h3>Q&A ({courseContent.qas?.length || 0})</h3>
            <div style={styles.contentList}>
              {courseContent.qas?.map((q, i) => (
                <div key={q.id} style={styles.contentItem}>
                  <strong>Q{i+1}:</strong> {q.question}<br/>
                  <strong>A:</strong> {q.answer}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Course creation wizard
  const renderWizard = () => (
    <div style={styles.wizardOverlay}>
      <div style={styles.wizardModal}>
        <div style={styles.wizardHeader}>
          <h2>{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
          <button onClick={resetWizard} style={styles.closeButton}>×</button>
        </div>
        
        <div style={styles.wizardSteps}>
          <div style={{...styles.step, ...(wizardStep >= 1 ? styles.stepActive : {})}}>1. Basic Info</div>
          <div style={{...styles.step, ...(wizardStep >= 2 ? styles.stepActive : {})}}>2. Add Videos</div>
          <div style={{...styles.step, ...(wizardStep >= 3 ? styles.stepActive : {})}}>3. Add PDFs</div>
          <div style={{...styles.step, ...(wizardStep >= 4 ? styles.stepActive : {})}}>4. Q&A</div>
        </div>

        <div style={styles.wizardContent}>
          {wizardStep === 1 && (
            <div style={styles.stepContent}>
              <h3>Course Information</h3>
              <input
                type="text"
                name="title"
                placeholder="Course Title *"
                value={courseData.title}
                onChange={handleInputChange}
                style={styles.input}
              />
              <textarea
                name="description"
                placeholder="Course Description *"
                value={courseData.description}
                onChange={handleInputChange}
                style={styles.textarea}
                rows="4"
              />
              <input
                type="number"
                name="price"
                placeholder="Price ($) *"
                value={courseData.price}
                onChange={handleInputChange}
                style={styles.input}
              />
              <select
                name="category_id"
                value={courseData.category_id}
                onChange={handleInputChange}
                style={styles.select}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                name="level"
                value={courseData.level}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <input
                type="text"
                name="thumbnail_url"
                placeholder="Thumbnail URL (optional)"
                value={courseData.thumbnail_url}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
          )}

          {wizardStep === 2 && (
            <div style={styles.stepContent}>
              <h3>Add Videos</h3>
              <div style={styles.uploadArea}>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  style={styles.fileInput}
                  id="video-upload"
                />
                <label htmlFor="video-upload" style={styles.uploadLabel}>
                  📹 Click to upload videos
                </label>
              </div>
              
              <div style={styles.contentList}>
                {courseContent.videos.map(video => (
                  <div key={video.id} style={styles.contentItem}>
                    <span>🎬 {video.name}</span>
                    <button onClick={() => handleRemoveVideo(video.id)} style={styles.removeButton}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div style={styles.stepContent}>
              <h3>Add PDFs</h3>
              <div style={styles.uploadArea}>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handlePdfUpload}
                  style={styles.fileInput}
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" style={styles.uploadLabel}>
                  📄 Click to upload PDFs
                </label>
              </div>
              
              <div style={styles.contentList}>
                {courseContent.pdfs.map(pdf => (
                  <div key={pdf.id} style={styles.contentItem}>
                    <span>📑 {pdf.name}</span>
                    <button onClick={() => handleRemovePdf(pdf.id)} style={styles.removeButton}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div style={styles.stepContent}>
              <h3>Add Q&A</h3>
              <button onClick={handleAddQA} style={styles.addButton}>+ Add Question</button>
              
              <div style={styles.qaList}>
                {courseContent.qas.map(qa => (
                  <div key={qa.id} style={styles.qaItem}>
                    {qa.isEditing ? (
                      <>
                        <input
                          type="text"
                          placeholder="Question"
                          value={qa.question}
                          onChange={(e) => handleQAChange(qa.id, 'question', e.target.value)}
                          style={styles.qaInput}
                        />
                        <textarea
                          placeholder="Answer"
                          value={qa.answer}
                          onChange={(e) => handleQAChange(qa.id, 'answer', e.target.value)}
                          style={styles.qaTextarea}
                          rows="2"
                        />
                        <div style={styles.qaActions}>
                          <button onClick={() => handleQASave(qa.id)} style={styles.saveButton}>Save</button>
                          <button onClick={() => handleQADelete(qa.id)} style={styles.deleteButton}>Delete</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={styles.qaDisplay}>
                          <p><strong>Q:</strong> {qa.question}</p>
                          <p><strong>A:</strong> {qa.answer}</p>
                        </div>
                        <button onClick={() => {
                          const updatedQAs = courseContent.qas.map(q => 
                            q.id === qa.id ? { ...q, isEditing: true } : q
                          );
                          setCourseContent({...courseContent, qas: updatedQAs});
                        }} style={styles.editButton}>Edit</button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={styles.wizardFooter}>
          {wizardStep > 1 && (
            <button onClick={handlePrevStep} style={styles.prevButton}>Previous</button>
          )}
          {wizardStep < 4 ? (
            <button onClick={handleNextStep} style={styles.nextButton}>Next</button>
          ) : (
            <div style={styles.publishActions}>
              <button onClick={resetWizard} style={styles.cancelButton}>Cancel</button>
              <button onClick={handleSaveDraft} style={styles.draftButton}>Save as Draft</button>
              <button onClick={handlePublish} style={styles.publishButton}>Publish Course</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.appContainer}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.logoContainer}>
            <span style={styles.logoText}>Study Mart Admin</span>
          </div>
          <div style={styles.navTabs}>
            <button
              style={{
                ...styles.navTab,
                ...(activeTab === 'courses' ? styles.navTabActive : {}),
                ...(hoveredButton === 'tab-courses' ? styles.navTabHover : {}),
                ...(pressedButton === 'tab-courses' ? styles.navTabPressed : {})
              }}
              onClick={() => setActiveTab('courses')}
              onMouseEnter={() => handleButtonMouseEnter('tab-courses')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('tab-courses')}
              onMouseUp={handleButtonMouseUp}
            >
              📚 Courses
            </button>
            <button
              style={{
                ...styles.navTab,
                ...(activeTab === 'applications' ? styles.navTabActive : {}),
                ...(hoveredButton === 'tab-applications' ? styles.navTabHover : {}),
                ...(pressedButton === 'tab-applications' ? styles.navTabPressed : {})
              }}
              onClick={() => setActiveTab('applications')}
              onMouseEnter={() => handleButtonMouseEnter('tab-applications')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('tab-applications')}
              onMouseUp={handleButtonMouseUp}
            >
              📝 Seller Applications
            </button>
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>Admin: {user?.profile?.full_name}</span>
            <button
              onClick={handleLogout}
              style={{
                ...styles.logoutButton,
                ...(hoveredButton === 'logout' ? styles.logoutButtonHover : {}),
                ...(pressedButton === 'logout' ? styles.logoutButtonPressed : {})
              }}
              onMouseEnter={() => handleButtonMouseEnter('logout')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('logout')}
              onMouseUp={handleButtonMouseUp}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.container}>
        {/* Stats Cards - Always visible */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{stats.totalUsers}</h3>
            <p style={styles.statLabel}>Total Users</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{stats.totalCourses}</h3>
            <p style={styles.statLabel}>Total Courses</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{stats.publishedCourses}</h3>
            <p style={styles.statLabel}>Published</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{stats.pendingCourses}</h3>
            <p style={styles.statLabel}>Pending</p>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <div style={styles.tabContent}>
            <div style={styles.header}>
              <h2 style={styles.pageTitle}>📚 Course Management</h2>
              <button
                onClick={() => setShowWizard(true)}
                style={{
                  ...styles.createButton,
                  ...(hoveredButton === 'create-course' ? styles.createButtonHover : {}),
                  ...(pressedButton === 'create-course' ? styles.createButtonPressed : {})
                }}
                onMouseEnter={() => handleButtonMouseEnter('create-course')}
                onMouseLeave={handleButtonMouseLeave}
                onMouseDown={() => handleButtonMouseDown('create-course')}
                onMouseUp={handleButtonMouseUp}
              >
                + Create New Course
              </button>
            </div>

            <div style={styles.coursesList}>
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loader}></div>
                  <p>Loading courses...</p>
                </div>
              ) : courses.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>No courses found. Click "Create New Course" to get started!</p>
                </div>
              ) : (
                courses.map(course => (
                  <div key={course.id} style={styles.courseCard}>
                    <img 
                      src={course.thumbnail_url || 'https://via.placeholder.com/100x60?text=Course'}
                      alt={course.title}
                      style={styles.courseThumb}
                    />
                    <div style={styles.courseDetails}>
                      <h4 style={styles.courseTitle}>{course.title}</h4>
                      <p style={styles.courseMeta}>
                        Price: ${course.price} | Level: {course.level} | 
                        Status: <span style={{
                          color: course.status === 'published' ? '#10b981' : 
                                 course.status === 'draft' ? '#f59e0b' : '#6b7280',
                          fontWeight: 'bold'
                        }}>{course.status}</span>
                      </p>
                      <p style={styles.courseContentMeta}>
                        📹 {course.video_count || 0} videos | 📄 {course.pdf_count || 0} PDFs | 💬 {course.qa_count || 0} Q&A
                      </p>
                    </div>
                    <div style={styles.courseActions}>
                      <button
                        onClick={() => handleViewCourse(course)}
                        style={{
                          ...styles.actionButton,
                          ...styles.viewButton,
                          ...(hoveredButton === `view-${course.id}` ? styles.actionButtonHover : {})
                        }}
                        onMouseEnter={() => handleButtonMouseEnter(`view-${course.id}`)}
                        onMouseLeave={handleButtonMouseLeave}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleEditCourse(course)}
                        style={{
                          ...styles.actionButton,
                          ...styles.editButton,
                          ...(hoveredButton === `edit-${course.id}` ? styles.actionButtonHover : {})
                        }}
                        onMouseEnter={() => handleButtonMouseEnter(`edit-${course.id}`)}
                        onMouseLeave={handleButtonMouseLeave}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                          ...(hoveredButton === `delete-${course.id}` ? styles.actionButtonHover : {})
                        }}
                        onMouseEnter={() => handleButtonMouseEnter(`delete-${course.id}`)}
                        onMouseLeave={handleButtonMouseLeave}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div style={styles.tabContent}>
            <h2 style={styles.pageTitle}>📝 Seller Applications</h2>
            <SellerApplicationsManager />
          </div>
        )}
      </div>

      {/* Modals */}
      {showWizard && renderWizard()}
      {selectedCourse && renderCourseViewModal()}
    </div>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  navbar: {
    background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
    padding: '1rem 0',
    boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  logoContainer: {
    background: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  logoText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  navTabs: {
    display: 'flex',
    gap: '10px',
  },
  navTab: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  navTabHover: {
    background: 'rgba(255,255,255,0.2)',
    transform: 'translateY(-2px)',
  },
  navTabPressed: {
    transform: 'translateY(2px) scale(0.98)',
  },
  navTabActive: {
    background: 'white',
    color: '#dc2626',
    fontWeight: '600',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userName: {
    color: 'white',
    fontSize: '15px',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  logoutButtonHover: {
    background: 'rgba(255,255,255,0.2)',
    transform: 'translateY(-2px)',
  },
  logoutButtonPressed: {
    transform: 'translateY(2px) scale(0.98)',
  },
  container: {
    maxWidth: '1400px',
    margin: '30px auto',
    padding: '0 20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#dc2626',
    margin: '0 0 10px 0',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  tabContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  createButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
  },
  createButtonHover: {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 8px 20px rgba(16,185,129,0.4)',
  },
  createButtonPressed: {
    transform: 'translateY(2px) scale(0.98)',
  },
  coursesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  courseCard: {
    display: 'flex',
    alignItems: 'center',
    background: '#f8fafc',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: '#dc2626',
      boxShadow: '0 4px 12px rgba(220,38,38,0.1)',
    },
  },
  courseThumb: {
    width: '100px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginRight: '15px',
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '5px',
  },
  courseMeta: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '5px',
  },
  courseContentMeta: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  courseActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  viewButton: {
    background: '#6366f1',
    color: 'white',
  },
  editButton: {
    background: '#f59e0b',
    color: 'white',
  },
  deleteButton: {
    background: '#ef4444',
    color: 'white',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #dc2626',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    background: '#f8fafc',
    borderRadius: '8px',
    color: '#64748b',
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
  },
  modalHeader: {
    padding: '20px 25px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8fafc',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#64748b',
    ':hover': {
      color: '#dc2626',
    },
  },
  modalBody: {
    padding: '25px',
  },
  contentList: {
    marginBottom: '20px',
  },
  contentItem: {
    padding: '10px',
    background: '#f8fafc',
    borderRadius: '6px',
    marginBottom: '8px',
    fontSize: '14px',
  },

  // Wizard Styles
  wizardOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  wizardModal: {
    background: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
  },
  wizardHeader: {
    padding: '20px 25px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8fafc',
  },
  wizardSteps: {
    display: 'flex',
    padding: '20px',
    gap: '10px',
    borderBottom: '1px solid #e2e8f0',
  },
  step: {
    flex: 1,
    padding: '10px',
    textAlign: 'center',
    background: '#f1f5f9',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
  },
  stepActive: {
    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    color: 'white',
  },
  wizardContent: {
    padding: '25px',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    ':focus': {
      outline: 'none',
      borderColor: '#dc2626',
      boxShadow: '0 0 0 3px rgba(220,38,38,0.1)',
    },
  },
  textarea: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    ':focus': {
      outline: 'none',
      borderColor: '#dc2626',
      boxShadow: '0 0 0 3px rgba(220,38,38,0.1)',
    },
  },
  select: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    ':focus': {
      outline: 'none',
      borderColor: '#dc2626',
      boxShadow: '0 0 0 3px rgba(220,38,38,0.1)',
    },
  },
  uploadArea: {
    border: '2px dashed #e2e8f0',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    padding: '10px 20px',
    background: '#f1f5f9',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    ':hover': {
      background: '#e2e8f0',
    },
  },
  removeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#ef4444',
  },
  addButton: {
    padding: '10px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    alignSelf: 'flex-start',
  },
  qaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '15px',
  },
  qaItem: {
    padding: '15px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  qaInput: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
  },
  qaTextarea: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    resize: 'vertical',
  },
  qaActions: {
    display: 'flex',
    gap: '10px',
  },
  qaDisplay: {
    marginBottom: '10px',
  },
  saveButton: {
    padding: '5px 10px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteButton: {
    padding: '5px 10px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  editButton: {
    padding: '5px 10px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  wizardFooter: {
    padding: '20px 25px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
  },
  prevButton: {
    padding: '10px 20px',
    background: '#64748b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  nextButton: {
    padding: '10px 20px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  publishActions: {
    display: 'flex',
    gap: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    background: '#64748b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  draftButton: {
    padding: '10px 20px',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  publishButton: {
    padding: '10px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

// Global animations
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