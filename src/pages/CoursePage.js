import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

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

  const getYoutubeId = (url) => {
    if (!url) return null;
    if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    if (url.includes('embed/')) return url.split('/embed/')[1].split('?')[0];
    return null;
  };

  const videos = contents.filter(c => c.content_type === 'video');
  const materials = contents.filter(c => c.content_type === 'pdf');
  const cbtList = contents.filter(c => c.content_type === 'cbt');

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (!course) return <div style={styles.center}>Course not found</div>;

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
        <h1 style={styles.title}>{course.title}</h1>
        <p>👨‍🏫 {course.instructor || 'Instructor'}</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('videos')} style={activeTab === 'videos' ? styles.activeTabBtn : styles.tabBtn}>🎥 Videos</button>
        <button onClick={() => setActiveTab('materials')} style={activeTab === 'materials' ? styles.activeTabBtn : styles.tabBtn}>📄 Materials</button>
        <button onClick={() => setActiveTab('cbt')} style={activeTab === 'cbt' ? styles.activeTabBtn : styles.tabBtn}>📝 CBT</button>
      </div>

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div style={styles.tabContent}>
          {videos.length === 0 ? (
            <p>No videos yet</p>
          ) : (
            videos.map(video => (
              <div key={video.id} style={styles.videoCard}>
                <h3>{video.title}</h3>
                {getYoutubeId(video.video_url) && (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(video.video_url)}`}
                    style={styles.videoFrame}
                    allowFullScreen
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Materials Tab - PDF Viewer inside */}
      {activeTab === 'materials' && (
        <div style={styles.tabContent}>
          {materials.length === 0 ? (
            <p>No materials yet</p>
          ) : (
            materials.map(mat => (
              <div key={mat.id} style={styles.materialCard}>
                <h3>📄 {mat.title}</h3>
                {mat.file_url && (
                  <iframe src={mat.file_url} style={styles.pdfFrame} title={mat.title} />
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* CBT Tab */}
      {activeTab === 'cbt' && (
        <div style={styles.tabContent}>
          {cbtList.length === 0 ? (
            <p>No CBT available</p>
          ) : (
            cbtList.map(cbt => (
              <div key={cbt.id} style={styles.cbtCard}>
                <h3>📝 {cbt.title}</h3>
                <p>Practice Test</p>
                <button style={styles.startBtn}>Start Test</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    padding: '30px',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  tabs: {
    display: 'flex',
    backgroundColor: 'white',
    padding: '0 20px',
    borderBottom: '1px solid #ddd',
  },
  tabBtn: {
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#666',
  },
  activeTabBtn: {
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#667eea',
    borderBottom: '2px solid #667eea',
  },
  tabContent: {
    padding: '20px',
  },
  videoCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  videoFrame: {
    width: '100%',
    height: '315px',
    border: 'none',
    marginTop: '10px',
  },
  materialCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  pdfFrame: {
    width: '100%',
    height: '500px',
    border: 'none',
    marginTop: '10px',
  },
  cbtCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  startBtn: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  center: {
    textAlign: 'center',
    padding: '50px',
  },
};