// Update the extractVideoId function
const extractVideoId = (url) => {
  if (!url) return null;
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  
  return null;
};

// Update the video player to show error if video not found
{selectedVideo && extractVideoId(selectedVideo.video_url) ? (
  <div style={styles.videoWrapper}>
    <iframe
      src={`https://www.youtube.com/embed/${extractVideoId(selectedVideo.video_url)}?modestbranding=1&controls=1&rel=0&showinfo=0`}
      title={selectedVideo.title}
      style={styles.videoFrame}
      allowFullScreen
    />
  </div>
) : (
  <div style={styles.videoError}>
    <p>🎥 Video unavailable</p>
    <small>Check back later for video content</small>
  </div>
)}