import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchCourse();
    fetchContents();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      if (response.data.success && response.data.course) {
        setCourse(response.data.course);
      } else {
        setCourse({
          id: courseId,
          title: 'Course',
          description: 'Course content',
          instructor: 'Study Mart'
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setLoading(false);
    }
  };

  const fetchContents = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/contents`);
      if (response.data.success && response.data.contents) {
        setContents(response.data.contents);
        const firstVideo = response.data.contents.find(c => c.content_type === 'video');
        if (firstVideo) setSelectedVideo(firstVideo);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('youtube.com/embed/')) {
      return url.split('/embed/')[1].split('?')[0];
    }
    return null;
  };

  const materials = contents.filter(c => c.content_type === 'pdf');
  const videos = contents.filter(c => c.content_type === 'video');
  const cbtList = contents.filter(c => c.content_type === 'cbt');

  if (loading) {
    return <div style={styles.loading}>Loading course...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>{course?.title || 'Course'}</h1>
        <p style={styles.instructor}>👨‍🏫 {course?.instructor || 'Study Mart'}</p>
        <div style={styles.stats}>
          <span>📄 {materials.length} Materials</span>
          <span>🎥 {videos.length} Videos</span>
          <span>📝 {cbtList.length} CBT</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('materials')} style={{...styles.tab, ...(activeTab === 'materials' ? styles.activeTab : {})}}>
          📄 Materials
        </button>
        <button onClick={() => setActiveTab('videos')} style={{...styles.tab, ...(activeTab === 'videos' ? styles.activeTab : {})}}>
          🎥 Videos
        </button>
        <button onClick={() => setActiveTab('cbt')} style={{...styles.tab, ...(activeTab === 'cbt' ? styles.activeTab : {})}}>
          📝 CBT
        </button>
      </div>

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div style={styles.tabContent}>
          {materials.length === 0 ? (
            <div style={styles.empty}>No materials available</div>
          ) : (
            materials.map(item => (
              <div key={item.id} style={styles.materialCard}>
                <span style={styles.materialIcon}>📄</span>
                <div style={styles.materialInfo}>
                  <h4>{item.title}</h4>
                  <p>PDF Document</p>
                </div>
                <button onClick={() => window.open(item.file_url, '_blank')} style={styles.downloadBtn}>
                  Download
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div style={styles.tabContent}>
          {videos.length === 0 ? (
            <div style={styles.empty}>No videos available</div>
          ) : (
            <div style={styles.videosContainer}>
              <div style={styles.videoPlayer}>
                {selectedVideo && extractVideoId(selectedVideo.video_url) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractVideoId(selectedVideo.video_url)}`}
                    title={selectedVideo.title}
                    style={styles.videoFrame}
                    allowFullScreen
                  />
                ) : (
                  <div style={styles.videoError}>Select a video to play</div>
                )}
                <h3>{selectedVideo?.title}</h3>
              </div>
              <div style={styles.videoList}>
                {videos.map(video => (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    style={{...styles.videoItem, ...(selectedVideo?.id === video.id ? styles.videoItemActive : {})}}
                  >
                    <span>🎬</span>
                    <span>{video.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CBT Tab */}
      {activeTab === 'cbt' && (
        <div style={styles.tabContent}>
          {cbtList.length === 0 ? (
            <div style={styles.empty}>No CBT available</div>
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
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '40px',
  },
  backButton: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    marginBottom: '20px',
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
    padding: '0 20px',
    borderBottom: '1px solid #ddd',
  },
  tab: {
    padding: '15px 25px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#666',
  },
  activeTab: {
    color: '#667eea',
    borderBottom: '2px solid #667eea',
  },
  tabContent: {
    padding: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  materialCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  materialIcon: {
    fontSize: '30px',
  },
  materialInfo: {
    flex: 1,
  },
  downloadBtn: {
    padding: '8px 16px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  videosContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  videoPlayer: {
    flex: 2,
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
  },
  videoFrame: {
    width: '100%',
    height: '315px',
    border: 'none',
    borderRadius: '8px',
  },
  videoList: {
    flex: 1,
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
  },
  videoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  videoItemActive: {
    backgroundColor: '#e0e7ff',
  },
  videoError: {
    textAlign: 'center',
    padding: '50px',
    color: '#999',
  },
  cbtCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '15px,
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
  loading: {
    textAlign: 'center',
    padding: '50px',
  },
  empty: {
    textAlign: 'center',
    padding: '50px',
    color: '#999',
  },
};