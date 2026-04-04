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
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    fetchCourse();
    fetchContents();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      if (response.data.success && response.data.course) {
        setCourse(response.data.course);
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
        const firstMaterial = response.data.contents.find(c => c.content_type === 'pdf');
        if (firstMaterial) setSelectedMaterial(firstMaterial);
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

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!course) {
    return (
      <div style={styles.errorContainer}>
        <h2>Course Not Found</h2>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back
        </button>
        <h1 style={styles.title}>{course.title}</h1>
        <p style={styles.instructor}>👨‍🏫 {course.instructor || 'Instructor'}</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('videos')} style={{...styles.tab, ...(activeTab === 'videos' ? styles.activeTab : {})}}>
          🎥 Videos
        </button>
        <button onClick={() => setActiveTab('materials')} style={{...styles.tab, ...(activeTab === 'materials' ? styles.activeTab : {})}}>
          📄 Materials
        </button>
      </div>

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div style={styles.tabContent}>
          {videos.length === 0 ? (
            <div style={styles.empty}>No videos uploaded yet</div>
          ) : (
            <div style={styles.videosContainer}>
              <div style={styles.videoPlayer}>
                {selectedVideo && extractVideoId(selectedVideo.video_url) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractVideoId(selectedVideo.video_url)}`}
                    title={selectedVideo.title}
                    style={styles.videoFrame}
                    allowFullScreen
                    frameBorder="0"
                  />
                ) : (
                  <div style={styles.videoPlaceholder}>Select a video to watch</div>
                )}
                <h3 style={styles.currentVideoTitle}>{selectedVideo?.title || 'No video selected'}</h3>
              </div>
              <div style={styles.videoList}>
                <h4>Course Videos</h4>
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

      {/* Materials Tab - Embedded PDF viewer (same tab) */}
      {activeTab === 'materials' && (
        <div style={styles.tabContent}>
          {materials.length === 0 ? (
            <div style={styles.empty}>No materials uploaded yet</div>
          ) : (
            <div style={styles.materialsContainer}>
              <div style={styles.materialViewer}>
                {selectedMaterial ? (
                  <iframe
                    src={selectedMaterial.file_url}
                    title={selectedMaterial.title}
                    style={styles.pdfFrame}
                    frameBorder="0"
                  />
                ) : (
                  <div style={styles.materialPlaceholder}>Select a material to view</div>
                )}
                <h3 style={styles.currentMaterialTitle}>{selectedMaterial?.title || 'No material selected'}</h3>
              </div>
              <div style={styles.materialList}>
                <h4>Course Materials</h4>
                {materials.map(material => (
                  <div
                    key={material.id}
                    onClick={() => setSelectedMaterial(material)}
                    style={{...styles.materialItem, ...(selectedMaterial?.id === material.id ? styles.materialItemActive : {})}}
                  >
                    <span>📄</span>
                    <span>{material.title}</span>
                  </div>
                ))}
              </div>
            </div>
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
    padding: '30px',
  },
  backButton: {
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
  instructor: {
    fontSize: '14px',
    opacity: 0.9,
  },
  tabs: {
    display: 'flex',
    backgroundColor: 'white',
    padding: '0 20px',
    borderBottom: '1px solid #ddd',
  },
  tab: {
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#666',
  },
  activeTab: {
    color: '#667eea',
    borderBottom: '2px solid #667eea',
  },
  tabContent: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
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
    minWidth: '300px',
  },
  videoFrame: {
    width: '100%',
    height: '350px',
    borderRadius: '8px',
  },
  videoPlaceholder: {
    width: '100%',
    height: '350px',
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
  },
  currentVideoTitle: {
    marginTop: '10px',
    fontSize: '16px',
  },
  videoList: {
    flex: 1,
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '200px',
  },
  videoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginBottom: '5px',
  },
  videoItemActive: {
    backgroundColor: '#e0e7ff',
  },
  materialsContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  materialViewer: {
    flex: 2,
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '300px',
  },
  pdfFrame: {
    width: '100%',
    height: '500px',
    borderRadius: '8px',
  },
  materialPlaceholder: {
    width: '100%',
    height: '500px',
    backgroundColor: '#f0f0f0',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
  },
  currentMaterialTitle: {
    marginTop: '10px',
    fontSize: '16px',
  },
  materialList: {
    flex: 1,
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '200px',
  },
  materialItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginBottom: '5px',
  },
  materialItemActive: {
    backgroundColor: '#e0e7ff',
  },
  empty: {
    textAlign: 'center',
    padding: '50px',
    color: '#999',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '50px',
  },
};