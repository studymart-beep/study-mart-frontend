/* eslint-disable no-dupe-keys, no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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

  // Seller applications state
  const [sellerApplications, setSellerApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchCourses();
    fetchCategories();
    fetchSellerApplications();
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
      console.log('📚 ========== FETCHING COURSES ==========');
      console.log('📚 Making API request to /admin/courses...');
      
      const response = await api.get('/admin/courses');
      
      console.log('📚 Response Status:', response.status);
      console.log('📚 Response Data:', response.data);
      
      if (response.data && response.data.success) {
        console.log(`✅ SUCCESS! Loaded ${response.data.courses.length} courses`);
        
        if (response.data.courses.length > 0) {
          console.log('📋 First course:', response.data.courses[0]);
        } else {
          console.log('⚠️ No courses returned from API');
        }
        
        setCourses(response.data.courses);
      } else {
        console.error('❌ API returned success: false', response.data);
      }
    } catch (error) {
      console.error('❌ ERROR fetching courses:');
      if (error.response) {
        console.error('❌ Error response:', error.response.data);
      } else {
        console.error('❌ Error message:', error.message);
      }
    } finally {
      setLoading(false);
      console.log('📚 ========== FETCH COMPLETE ==========');
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

  const fetchSellerApplications = async () => {
    setLoadingApps(true);
    try {
      const response = await api.get('/admin/seller-applications');
      if (response.data.success) {
        setSellerApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching seller applications:', error);
    } finally {
      setLoadingApps(false);
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
        // Update existing course and publish
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
        // Create new course and publish
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

  const handleApproveSeller = async (appId, userId) => {
    const subaccount_code = prompt('Enter Paystack subaccount code for this seller:');
    if (!subaccount_code) return;
    try {
      const response = await api.post(`/admin/seller-applications/${appId}/approve`, { subaccount_code });
      if (response.data.success) {
        alert('Seller approved');
        fetchSellerApplications();
      }
    } catch (error) {
      console.error('Error approving seller:', error);
      alert('Approval failed');
    }
  };

  const handleRejectSeller = async (appId) => {
    if (!window.confirm('Reject this application?')) return;
    try {
      const response = await api.post(`/admin/seller-applications/${appId}/reject`);
      if (response.data.success) {
        alert('Application rejected');
        fetchSellerApplications();
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Rejection failed');
    }
  };

  const handleLogout = () => {
    signOut();
  };

  // View course content
  if (selectedCourse) {
    return (
      <div>
        <nav style={styles.navbar}>
          <div style={styles.navContainer}>
            <img src="/images/logo.jpg" alt="StudyMart" style={styles.logoImage} />
            <div style={styles.userInfo}>
              <span style={styles.userName}>
                Welcome, Admin {user?.profile?.full_name}!
              </span>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div style={styles.container}>
          <button onClick={() => setSelectedCourse(null)} style={styles.backButton}>
            ← Back to Dashboard
          </button>

          <div style={styles.courseHeader}>
            <h1 style={styles.courseTitle}>{selectedCourse.title}</h1>
            <p style={styles.courseDescription}>{selectedCourse.description}</p>
            <div style={styles.courseMeta}>
              <span>Price: ${selectedCourse.price}</span>
              <span>Level: {selectedCourse.level}</span>
              <span>Status: <span style={{
                color: selectedCourse.status === 'published' ? '#10b981' : 
                       selectedCourse.status === 'draft' ? '#f59e0b' : '#6b7280'
              }}>{selectedCourse.status}</span></span>
            </div>
            <button 
              onClick={() => handleEditCourse(selectedCourse)} 
              style={styles.editCourseButton}
            >
              ✏️ Edit Course
            </button>
          </div>

          <div style={styles.contentSection}>
            <h3>Videos ({courseContent.videos?.length || 0})</h3>
            <div style={styles.videoList}>
              {courseContent.videos?.map((video, index) => (
                <div key={video.id} style={styles.contentItem}>
                  <span>🎬 {video.title}</span>
                </div>
              ))}
            </div>

            <h3>PDFs ({courseContent.pdfs?.length || 0})</h3>
            <div style={styles.pdfList}>
              {courseContent.pdfs?.map((pdf, index) => (
                <div key={pdf.id} style={styles.contentItem}>
                  <span>📄 {pdf.title}</span>
                </div>
              ))}
            </div>

            <h3>Q&A ({courseContent.qas?.length || 0})</h3>
            <div style={styles.qaList}>
              {courseContent.qas?.map((qa, index) => (
                <div key={qa.id} style={styles.qaItem}>
                  <p><strong>Q{index + 1}:</strong> {qa.question}</p>
                  <p><strong>A:</strong> {qa.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Wizard
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
    <div>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <img src="/images/logo.jpg" alt="StudyMart" style={styles.logoImage} />
          <div style={styles.userInfo}>
            <span style={styles.userName}>
              Welcome, Admin {user?.profile?.full_name}!
            </span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>Admin Dashboard</h2>
          <button onClick={() => setShowWizard(true)} style={styles.createButton}>
            + Create New Course
          </button>
        </div>

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

        <h3 style={styles.subTitle}>All Courses</h3>
        <div style={styles.coursesList}>
          {loading ? (
            <p>Loading courses...</p>
          ) : courses.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No courses found. Click "Create New Course" to get started!</p>
            </div>
          ) : (
            courses.map(course => (
              <div key={course.id} style={styles.courseItem}>
                <img 
                  src={course.thumbnail_url || 'https://picsum.photos/100/60?random=1'}
                  alt={course.title}
                  style={styles.courseThumb}
                />
                <div style={styles.courseDetails}>
                  <h4 style={styles.courseTitle}>{course.title}</h4>
                  <p style={styles.courseMeta}>
                    Price: ${course.price} | Level: {course.level} | 
                    Status: <span style={{
                      color: course.status === 'published' ? '#10b981' : 
                             course.status === 'draft' ? '#f59e0b' : '#6b7280'
                    }}>{course.status}</span>
                  </p>
                  <p style={styles.courseContentMeta}>
                    📹 {course.video_count || 0} videos | 📄 {course.pdf_count || 0} PDFs | 💬 {course.qa_count || 0} Q&A
                  </p>
                </div>
                <div style={styles.courseActions}>
                  <button 
                    onClick={() => handleViewCourse(course)} 
                    style={styles.viewButton}
                  >
                    👁️ View
                  </button>
                  <button 
                    onClick={() => handleEditCourse(course)} 
                    style={styles.editButton}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)} 
                    style={styles.deleteButton}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Seller Applications Section */}
        <div style={styles.section}>
          <h3 style={styles.subTitle}>Seller Applications</h3>
          {loadingApps ? (
            <p>Loading applications...</p>
          ) : sellerApplications.length === 0 ? (
            <p style={styles.emptyMessage}>No seller applications</p>
          ) : (
            sellerApplications.map(app => (
              <div key={app.id} style={styles.applicationCard}>
                <div style={styles.applicationHeader}>
                  <strong>{app.full_name}</strong> ({app.business_name})
                </div>
                <p><strong>Email:</strong> {app.user?.email}</p>
                <p><strong>Category:</strong> {app.category}</p>
                <p><strong>Location:</strong> {app.location}</p>
                <p><strong>Payment Details:</strong> {app.payment_details}</p>
                <p><strong>Status:</strong> 
                  <span style={{
                    color: app.status === 'approved' ? '#10b981' : 
                           app.status === 'rejected' ? '#dc2626' : '#f59e0b',
                    fontWeight: 'bold',
                    marginLeft: '5px'
                  }}>
                    {app.status}
                  </span>
                </p>
                {app.status === 'pending' && app.fee_paid && (
                  <div style={styles.applicationActions}>
                    <button 
                      onClick={() => handleApproveSeller(app.id, app.user_id)}
                      style={styles.approveButton}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleRejectSeller(app.id)}
                      style={styles.rejectButton}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showWizard && renderWizard()}
    </div>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#dc2626',
    padding: '0.5rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoImage: {
    height: '40px',
    width: 'auto',
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userName: {
    color: 'white',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  pageTitle: {
    fontSize: '28px',
    color: '#333',
    margin: 0,
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '32px',
    color: '#dc2626',
    margin: '0 0 10px 0',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  subTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#333',
  },
  coursesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    color: '#666',
  },
  courseItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  courseThumb: {
    width: '100px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '15px',
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#333',
  },
  courseMeta: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '5px',
  },
  courseContentMeta: {
    fontSize: '12px',
    color: '#888',
  },
  courseActions: {
    display: 'flex',
    gap: '10px',
  },
  viewButton: {
    padding: '6px 12px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '20px',
  },
  courseHeader: {
    marginBottom: '30px',
  },
  courseDescription: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.6',
  },
  courseMeta: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#888',
    marginBottom: '20px',
  },
  editCourseButton: {
    padding: '10px 20px',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  contentSection: {
    marginTop: '30px',
  },
  videoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  pdfList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  qaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px',
  },
  contentItem: {
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    marginBottom: '5px',
  },
  qaItem: {
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },

  // Wizard Styles
  wizardOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  wizardModal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  wizardHeader: {
    padding: '20px',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  wizardSteps: {
    display: 'flex',
    padding: '20px',
    gap: '10px',
    borderBottom: '1px solid #eee',
  },
  step: {
    flex: 1,
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '14px',
  },
  stepActive: {
    backgroundColor: '#6366f1',
    color: 'white',
  },
  wizardContent: {
    padding: '20px',
    maxHeight: '60vh',
    overflow: 'auto',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  uploadArea: {
    border: '2px dashed #ddd',
    borderRadius: '4px',
    padding: '30px',
    textAlign: 'center',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    backgroundColor: '#f5f5f5',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-block',
  },
  contentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '15px',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#dc2626',
  },
  addButton: {
    padding: '10px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    alignSelf: 'flex-start',
  },
  qaInput: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  qaTextarea: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
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
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  wizardFooter: {
    padding: '20px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
  },
  prevButton: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  nextButton: {
    padding: '10px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  publishActions: {
    display: 'flex',
    gap: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  draftButton: {
    padding: '10px 20px',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  publishButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  // Seller Application Styles
  section: {
    marginTop: '30px',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  applicationCard: {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9',
  },
  applicationHeader: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  applicationActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  approveButton: {
    padding: '6px 12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  rejectButton: {
    padding: '6px 12px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};