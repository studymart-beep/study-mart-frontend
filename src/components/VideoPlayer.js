import React, { useState } from 'react';

export default function VideoPlayer({ videos }) {
  const [selectedVideo, setSelectedVideo] = useState(videos && videos.length > 0 ? videos[0] : null);

  const getYoutubeId = (url) => {
    if (!url) return null;
    if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    if (url.includes('embed/')) return url.split('/embed/')[1].split('?')[0];
    return null;
  };

  if (!videos || videos.length === 0) {
    return <div style={styles.empty}>No videos available</div>;
  }

  return (
    <div style={styles.container}>
      {/* Video Player */}
      <div style={styles.playerSection}>
        {selectedVideo && getYoutubeId(selectedVideo.video_url) ? (
          <>
            <h3 style={styles.videoTitle}>{selectedVideo.title}</h3>
            <div style={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.video_url)}?autoplay=1`}
                title={selectedVideo.title}
                style={styles.videoFrame}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </>
        ) : (
          <div style={styles.placeholder}>
            <span>🎬</span>
            <p>Select a video to play</p>
          </div>
        )}
      </div>

      {/* Video Playlist */}
      <div style={styles.playlistSection}>
        <h3>Course Videos ({videos.length})</h3>
        <div style={styles.playlist}>
          {videos.map(video => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              style={selectedVideo?.id === video.id ? styles.playlistItemActive : styles.playlistItem}
            >
              <span style={styles.playIcon}>▶</span>
              <div style={styles.playlistInfo}>
                <div style={styles.playlistTitle}>{video.title}</div>
                <small>Click to play</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '25px',
    flexWrap: 'wrap',
  },
  playerSection: {
    flex: 2,
    minWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  videoFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  videoTitle: {
    fontSize: '18px',
    marginBottom: '15px',
  },
  playlistSection: {
    flex: 1,
    minWidth: '280px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  playlist: {
    marginTop: '15px',
  },
  playlistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '8px',
  },
  playlistItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#e0e7ff',
    marginBottom: '8px',
  },
  playIcon: {
    fontSize: '20px',
    color: '#6366f1',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontWeight: '500',
  },
  placeholder: {
    textAlign: 'center',
    padding: '80px',
    color: '#64748b',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
  },
};