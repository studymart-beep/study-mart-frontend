import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import PDFViewer from '../components/PDFViewer';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    loadCourse();
    loadContents();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      if (res.data.success && res.data.course) {
        setCourse(res.data.course);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadContents = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/contents`);
      if (res.data.success) {
        setContents(res.data.contents || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const videos = contents.filter(c => c.content_type === 'video');
  const materials = contents.filter(c => c.content_type === 'pdf');
  const cbtList = contents.filter(c => c.content_type === 'cbt');

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (!course) return <div style={styles.center}>Course not found</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
        <h1 style={styles.title}>{course.title}</h1>
        <p style={styles.instructor}>👨‍🏫 {course.instructor || 'Study Mart Instructor'}</p>
        <div style={styles.stats}>
          <span>🎥 {videos.length} Videos</span>
          <span>📄 {materials.length} Materials</span>
          <span>📝 {cbtList.length} CBT</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('videos')} style={activeTab === 'videos' ? styles.activeTab : styles.tab}>
          🎥 Videos
        </button>
        <button onClick={() => setActiveTab('materials')} style={activeTab === 'materials' ? styles.activeTab : styles.tab}>
          📄 Materials
        </button>
        <button onClick={() => setActiveTab('cbt')} style={activeTab === 'cbt' ? styles.activeTab : styles.tab}>
          📝 CBT
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === 'videos' && <VideoPlayer videos={videos} />}
        {activeTab === 'materials' && <PDFViewer materials={materials} />}
        {activeTab === 'cbt' && (
          <div style={styles.cbtGrid}>
            {cbtList.length === 0 ? (
              <div style={styles.emptyState}>No CBT available yet</div>
            ) : (
              cbtList.map(cbt => (
                <div key={cbt.id} style={styles.cbtCard}>
                  <div style={styles.cbtIcon}>📝</div>
                  <div style={styles.cbtInfo}>
                    <h3>{cbt.title}</h3>
                    <p>Computer Based Test - Practice questions</p>
                    <button style={styles.startBtn}>Start Test →</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '40px',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  instructor: {
    fontSize: '16px',
    opacity: 0.9,
    marginBottom: '15px',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
  },
  tabs: {
    display: 'flex',
    backgroundColor: 'white',
    padding: '0 30px',
    borderBottom: '1px solid #e2e8f0',
    gap: '10px',
  },
  tab: {
    padding: '15px 25px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#64748b',
    borderBottom: '2px solid transparent',
  },
  activeTab: {
    padding: '15px 25px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#6366f1',
    borderBottom: '2px solid #6366f1',
  },
  tabContent: {
    padding: '30px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  cbtGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  cbtCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    gap: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cbtIcon: {
    fontSize: '40px',
  },
  cbtInfo: {
    flex: 1,
  },
  startBtn: {
    marginTop: '15px',
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '12px',
    color: '#64748b',
  },
  center: {
    textAlign: 'center',
    padding: '50px',
  },
};