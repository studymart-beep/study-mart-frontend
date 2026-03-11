import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SellerApplicationModal from '../components/SellerApplicationModal';
import SellerDashboard from '../components/SellerDashboard';

export default function StudentDashboard() {
  const { user, signOut } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseContent, setCourseContent] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfError, setPdfError] = useState(false);

  // Profile state
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    expertise: [],
    avatar_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  // Community state
  const [communityTab, setCommunityTab] = useState('feed');
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [feedError, setFeedError] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [posting, setPosting] = useState(false);

  // Marketplace & Seller states
  const [showSellerApplication, setShowSellerApplication] = useState(false);
  const [sellerApplicationStatus, setSellerApplicationStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  // Groups and messages state
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [topContributors, setTopContributors] = useState([]);
  const [events, setEvents] = useState([]);

  // Hover states for buttons
  const [hoveredButton, setHoveredButton] = useState(null);
  const [pressedButton, setPressedButton] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeSection === 'socials') {
      if (communityTab === 'feed') fetchFeedPosts();
      if (communityTab === 'groups') fetchGroups();
      if (communityTab === 'messages') fetchMessages();
      fetchTopContributors();
      fetchEvents();
    }
    if (activeSection === 'marketplace') {
      fetchProducts();
      fetchSellerApplicationStatus();
    }
  }, [activeSection, communityTab]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      if (response.data.success) {
        const publishedCourses = response.data.courses.filter(c => c.status === 'published');
        setCourses(publishedCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data.success) {
        setProfileData(response.data.profile);
        setEditedProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchFeedPosts = async () => {
    setLoadingFeed(true);
    setFeedError(null);
    try {
      const response = await api.get('/community/posts');
      if (response.data.success) {
        setFeedPosts(response.data.posts);
      } else {
        setFeedError('Failed to load feed');
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
      setFeedError('Network error');
    } finally {
      setLoadingFeed(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (newPostImage) {
        formData.append('image', newPostImage);
      }

      const response = await api.post('/community/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setFeedPosts([response.data.post, ...feedPosts]);
        setNewPostContent('');
        setNewPostImage(null);
        document.getElementById('post-image-input').value = '';
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setPosting(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await api.post(`/community/posts/${postId}/like`);
      if (response.data.success) {
        setFeedPosts(feedPosts.map(post =>
          post.id === postId
            ? { ...post, likes: response.data.likes, liked: response.data.liked }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await api.get('/community/groups');
      if (response.data.success) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await api.post(`/community/groups/${groupId}/join`);
      if (response.data.success) {
        setGroups(groups.map(g =>
          g.id === groupId ? { ...g, joined: true, members: g.members + 1 } : g
        ));
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const response = await api.post(`/community/groups/${groupId}/leave`);
      if (response.data.success) {
        setGroups(groups.map(g =>
          g.id === groupId ? { ...g, joined: false, members: g.members - 1 } : g
        ));
      }
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleCreateGroup = () => {
    alert('Create group functionality - to be implemented');
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await api.get('/community/messages');
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchTopContributors = async () => {
    try {
      const response = await api.get('/community/contributors');
      if (response.data.success) {
        setTopContributors(response.data.contributors);
      }
    } catch (error) {
      console.error('Error fetching contributors:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/community/events');
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAttendEvent = async (eventId) => {
    try {
      const response = await api.post(`/community/events/${eventId}/attend`);
      if (response.data.success) {
        setEvents(events.map(e =>
          e.id === eventId ? { ...e, attending: true, attendees: e.attendees + 1 } : e
        ));
      }
    } catch (error) {
      console.error('Error attending event:', error);
    }
  };

  const handleViewProfile = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      if (response.data.success) {
        setSelectedUserProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Marketplace functions
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await api.get('/seller/products');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchSellerApplicationStatus = async () => {
    try {
      const response = await api.get('/seller/my-application');
      if (response.data.success && response.data.application) {
        setSellerApplicationStatus(response.data.application);
        if (response.data.application.status === 'approved') {
          setIsSeller(true);
        }
      }
    } catch (error) {
      console.error('Error fetching application status:', error);
    }
  };

  const handleBuyProduct = (product) => {
    alert(`Buying ${product.name} - Payment integration coming soon!`);
  };

  const fetchCourseContent = async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      if (response.data.success) {
        setCourseContent(response.data.course);
        setSelectedCourse(response.data.course);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
    }
  };

  const handleCourseClick = (course) => {
    fetchCourseContent(course.id);
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setCourseContent(null);
    setSelectedVideo(null);
    setSelectedPdf(null);
    setPdfError(false);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handlePdfSelect = (pdf) => {
    setSelectedPdf(pdf);
    setPdfError(false);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const closePdf = () => {
    setSelectedPdf(null);
    setPdfError(false);
  };

  // Profile functions
  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedProfile({ ...profileData });
  };

  const handleProfileChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await api.put('/users/profile', editedProfile);
      if (response.data.success) {
        setProfileData(editedProfile);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile({ ...profileData });
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

  // Profile Modal (self)
  const renderProfileModal = () => (
    <div style={styles.modalOverlay} onClick={() => setShowProfile(false)}>
      <div style={styles.profileModal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.profileHeader}>
          <h2 style={styles.modalTitle}>My Profile</h2>
          <button onClick={() => setShowProfile(false)} style={styles.closeButton}>×</button>
        </div>
        <div style={styles.profileContent}>
          {!isEditing ? (
            <>
              <div style={styles.profileAvatar}>
                <div style={styles.avatarLarge}>
                  {profileData.avatar_url ? (
                    <img src={profileData.avatar_url} alt="Avatar" style={styles.avatarImage} />
                  ) : (
                    <span style={styles.avatarEmoji}>👤</span>
                  )}
                </div>
                <button 
                  onClick={handleEditProfile} 
                  style={styles.editProfileButton}
                  onMouseEnter={() => handleButtonMouseEnter('editProfile')}
                  onMouseLeave={handleButtonMouseLeave}
                  onMouseDown={() => handleButtonMouseDown('editProfile')}
                  onMouseUp={handleButtonMouseUp}
                >
                  Edit Profile
                </button>
              </div>
              <div style={styles.profileInfo}>
                <div style={styles.infoRow}><label>Full Name</label><p>{profileData.full_name || user?.profile?.full_name || 'Not set'}</p></div>
                <div style={styles.infoRow}><label>Email</label><p>{user?.email}</p></div>
                <div style={styles.infoRow}><label>Role</label><p>{profileData.role || user?.profile?.role || 'Student'}</p></div>
                <div style={styles.infoRow}><label>Bio</label><p>{profileData.bio || 'No bio added yet'}</p></div>
                <div style={styles.infoRow}><label>Expertise</label><p>{profileData.expertise?.length > 0 ? profileData.expertise.join(', ') : 'No expertise added'}</p></div>
              </div>
              <button 
                onClick={handleLogout} 
                style={styles.logoutButtonLarge}
                onMouseEnter={() => handleButtonMouseEnter('logout')}
                onMouseLeave={handleButtonMouseLeave}
                onMouseDown={() => handleButtonMouseDown('logout')}
                onMouseUp={handleButtonMouseUp}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <div style={styles.profileAvatar}>
                <div style={styles.avatarLarge}>
                  {editedProfile.avatar_url ? <img src={editedProfile.avatar_url} alt="Avatar" style={styles.avatarImage} /> : <span style={styles.avatarEmoji}>👤</span>}
                </div>
                <input type="text" name="avatar_url" placeholder="Avatar URL" value={editedProfile.avatar_url || ''} onChange={handleProfileChange} style={styles.profileInput} />
              </div>
              <div style={styles.profileInfo}>
                <div style={styles.infoRow}><label>Full Name</label><input type="text" name="full_name" value={editedProfile.full_name || ''} onChange={handleProfileChange} style={styles.profileInput} /></div>
                <div style={styles.infoRow}><label>Email</label><p style={styles.readOnlyText}>{user?.email}</p></div>
                <div style={styles.infoRow}><label>Bio</label><textarea name="bio" value={editedProfile.bio || ''} onChange={handleProfileChange} style={styles.profileTextarea} rows="4" placeholder="Tell us about yourself..." /></div>
                <div style={styles.infoRow}><label>Expertise (comma separated)</label><input type="text" name="expertise" value={editedProfile.expertise?.join(', ') || ''} onChange={(e) => setEditedProfile({ ...editedProfile, expertise: e.target.value.split(',').map(s => s.trim()).filter(s => s) })} style={styles.profileInput} placeholder="React, Node.js, Python" /></div>
              </div>
              <div style={styles.profileActions}>
                <button 
                  onClick={handleSaveProfile} 
                  style={styles.saveButton}
                  onMouseEnter={() => handleButtonMouseEnter('save')}
                  onMouseLeave={handleButtonMouseLeave}
                  onMouseDown={() => handleButtonMouseDown('save')}
                  onMouseUp={handleButtonMouseUp}
                >
                  Save Changes
                </button>
                <button 
                  onClick={handleCancelEdit} 
                  style={styles.cancelButton}
                  onMouseEnter={() => handleButtonMouseEnter('cancel')}
                  onMouseLeave={handleButtonMouseLeave}
                  onMouseDown={() => handleButtonMouseDown('cancel')}
                  onMouseUp={handleButtonMouseUp}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Other User Profile Modal
  const renderUserProfileModal = () => {
    if (!selectedUserProfile) return null;
    return (
      <div style={styles.modalOverlay} onClick={() => setSelectedUserProfile(null)}>
        <div style={styles.profileModal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.profileHeader}>
            <h2 style={styles.modalTitle}>{selectedUserProfile.full_name}'s Profile</h2>
            <button onClick={() => setSelectedUserProfile(null)} style={styles.closeButton}>×</button>
          </div>
          <div style={styles.profileContent}>
            <div style={styles.profileAvatar}>
              <div style={styles.avatarLarge}>
                {selectedUserProfile.avatar_url ? (
                  <img src={selectedUserProfile.avatar_url} alt="Avatar" style={styles.avatarImage} />
                ) : (
                  <span style={styles.avatarEmoji}>👤</span>
                )}
              </div>
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.infoRow}><label>Name</label><p>{selectedUserProfile.full_name}</p></div>
              <div style={styles.infoRow}><label>Role</label><p>{selectedUserProfile.role}</p></div>
              <div style={styles.infoRow}><label>Bio</label><p>{selectedUserProfile.bio || 'No bio'}</p></div>
              <div style={styles.infoRow}><label>Joined</label><p>{new Date(selectedUserProfile.created_at).toLocaleDateString()}</p></div>
            </div>
            <button 
              style={styles.messageButton} 
              onClick={() => alert(`Start conversation with ${selectedUserProfile.full_name}`)}
              onMouseEnter={() => handleButtonMouseEnter('message')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('message')}
              onMouseUp={handleButtonMouseUp}
            >
              💬 Send Message
            </button>
          </div>
        </div>
      </div>
    );
  };

  // If a course is selected, show its content
  if (selectedCourse && courseContent) {
    return (
      <div style={styles.appContainer}>
        <nav style={styles.navbar}>
          <div style={styles.navContainer}>
            <img src="/images/logo.jpg" alt="StudyMart" style={styles.logoImage} />
            <div style={styles.navButtons}>
              <button 
                style={{
                  ...styles.navButton,
                  ...(activeSection === 'home' ? styles.navButtonActive : {}),
                  ...(hoveredButton === 'nav-home' ? styles.navButtonHover : {}),
                  ...(pressedButton === 'nav-home' ? styles.navButtonPressed : {})
                }}
                onClick={() => setActiveSection('home')}
                onMouseEnter={() => handleButtonMouseEnter('nav-home')}
                onMouseLeave={handleButtonMouseLeave}
                onMouseDown={() => handleButtonMouseDown('nav-home')}
                onMouseUp={handleButtonMouseUp}
              >
                Home
              </button>
              <button 
                style={{
                  ...styles.navButton,
                  ...(activeSection === 'learning' ? styles.navButtonActive : {}),
                  ...(hoveredButton === 'nav-learning' ? styles.navButtonHover : {}),
                  ...(pressedButton === 'nav-learning' ? styles.navButtonPressed : {})
                }}
                onClick={() => setActiveSection('learning')}
                onMouseEnter={() => handleButtonMouseEnter('nav-learning')}
                onMouseLeave={handleButtonMouseLeave}
                onMouseDown={() => handleButtonMouseDown('nav-learning')}
                onMouseUp={handleButtonMouseUp}
              >
                Learning
              </button>
              <button 
                style={{
                  ...styles.navButton,
                  ...(activeSection === 'marketplace' ? styles.navButtonActive : {}),
                  ...(hoveredButton === 'nav-marketplace' ? styles.navButtonHover : {}),
                  ...(pressedButton === 'nav-marketplace' ? styles.navButtonPressed : {})
                }}
                onClick={() => setActiveSection('marketplace')}
                onMouseEnter={() => handleButtonMouseEnter('nav-marketplace')}
                onMouseLeave={handleButtonMouseLeave}
                onMouseDown={() => handleButtonMouseDown('nav-marketplace')}
                onMouseUp={handleButtonMouseUp}
              >
                Marketplace
              </button>
              <button 
                style={{
                  ...styles.navButton,
                  ...(activeSection === 'socials' ? styles.navButtonActive : {}),
                  ...(hoveredButton === 'nav-socials' ? styles.navButtonHover : {}),
                  ...(pressedButton === 'nav-socials' ? styles.navButtonPressed : {})
                }}
                onClick={() => setActiveSection('socials')}
                onMouseEnter={() => handleButtonMouseEnter('nav-socials')}
                onMouseLeave={handleButtonMouseLeave}
                onMouseDown={() => handleButtonMouseDown('nav-socials')}
                onMouseUp={handleButtonMouseUp}
              >
                Community
              </button>
            </div>
            <button 
              onClick={() => setShowProfile(true)} 
              style={{
                ...styles.profileButton,
                ...(hoveredButton === 'profile' ? styles.profileButtonHover : {}),
                ...(pressedButton === 'profile' ? styles.profileButtonPressed : {})
              }}
              onMouseEnter={() => handleButtonMouseEnter('profile')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('profile')}
              onMouseUp={handleButtonMouseUp}
            >
              <span style={styles.userName}>{user?.profile?.full_name || 'Profile'}</span>
              <div style={styles.avatarSmall}>
                {profileData.avatar_url ? <img src={profileData.avatar_url} alt="Avatar" style={styles.avatarSmallImage} /> : <span>👤</span>}
              </div>
            </button>
          </div>
        </nav>

        <div style={styles.container}>
          <button 
            onClick={handleBack} 
            style={{
              ...styles.backButton,
              ...(hoveredButton === 'back' ? styles.backButtonHover : {}),
              ...(pressedButton === 'back' ? styles.backButtonPressed : {})
            }}
            onMouseEnter={() => handleButtonMouseEnter('back')}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown('back')}
            onMouseUp={handleButtonMouseUp}
          >
            ← Back to Dashboard
          </button>
          <div style={styles.courseHeader}>
            <h1 style={styles.courseTitle}>{selectedCourse.title}</h1>
            <p style={styles.courseDescription}>{selectedCourse.description}</p>
            <div style={styles.courseMeta}><span>Price: ${selectedCourse.price}</span><span>Level: {selectedCourse.level}</span></div>
          </div>
          <div style={styles.tabContainer}>
            <button 
              style={{
                ...styles.tab,
                ...(activeTab === 'videos' ? styles.activeTab : {}),
                ...(hoveredButton === 'tab-videos' ? styles.tabHover : {}),
                ...(pressedButton === 'tab-videos' ? styles.tabPressed : {})
              }}
              onClick={() => setActiveTab('videos')}
              onMouseEnter={() => handleButtonMouseEnter('tab-videos')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('tab-videos')}
              onMouseUp={handleButtonMouseUp}
            >
              📹 Videos ({courseContent.videos?.length || 0})
            </button>
            <button 
              style={{
                ...styles.tab,
                ...(activeTab === 'pdfs' ? styles.activeTab : {}),
                ...(hoveredButton === 'tab-pdfs' ? styles.tabHover : {}),
                ...(pressedButton === 'tab-pdfs' ? styles.tabPressed : {})
              }}
              onClick={() => setActiveTab('pdfs')}
              onMouseEnter={() => handleButtonMouseEnter('tab-pdfs')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('tab-pdfs')}
              onMouseUp={handleButtonMouseUp}
            >
              📄 PDFs ({courseContent.pdfs?.length || 0})
            </button>
            <button 
              style={{
                ...styles.tab,
                ...(activeTab === 'qas' ? styles.activeTab : {}),
                ...(hoveredButton === 'tab-qas' ? styles.tabHover : {}),
                ...(pressedButton === 'tab-qas' ? styles.tabPressed : {})
              }}
              onClick={() => setActiveTab('qas')}
              onMouseEnter={() => handleButtonMouseEnter('tab-qas')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('tab-qas')}
              onMouseUp={handleButtonMouseUp}
            >
              💬 Q&A ({courseContent.qas?.length || 0})
            </button>
          </div>
          <div style={styles.contentArea}>
            {activeTab === 'videos' && (
              <div>
                {courseContent.videos?.length > 0 ? (
                  <div style={styles.videoGrid}>
                    {courseContent.videos.map((video) => (
                      <div key={video.id} style={styles.videoCard} onClick={() => handleVideoSelect(video)}>
                        <div style={styles.videoThumbnail}>🎬</div>
                        <div style={styles.videoInfo}>
                          <h4 style={styles.videoTitle}>{video.title}</h4>
                          <p style={styles.videoDuration}>Click to play</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p>No videos available for this course.</p>}
              </div>
            )}
            {activeTab === 'pdfs' && (
              <div>
                {courseContent.pdfs?.length > 0 ? (
                  <div style={styles.pdfGrid}>
                    {courseContent.pdfs.map((pdf) => (
                      <div key={pdf.id} style={styles.pdfCard} onClick={() => handlePdfSelect(pdf)}>
                        <div style={styles.pdfIcon}>📄</div>
                        <div style={styles.pdfInfo}>
                          <h4 style={styles.pdfTitle}>{pdf.title}</h4>
                          <p style={styles.pdfSize}>Click to view</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p>No PDFs available for this course.</p>}
              </div>
            )}
            {activeTab === 'qas' && (
              <div>
                {courseContent.qas?.length > 0 ? (
                  courseContent.qas.map((qa, index) => (
                    <div key={qa.id} style={styles.qaItem}>
                      <h3 style={styles.qaQuestion}>Q{index + 1}: {qa.question}</h3>
                      <p style={styles.qaAnswer}><strong>Answer:</strong> {qa.answer}</p>
                    </div>
                  ))
                ) : <p>No Q&A available for this course.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div style={styles.modalOverlay} onClick={closeVideo}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{selectedVideo.title}</h3>
                <button onClick={closeVideo} style={styles.closeButton}>×</button>
              </div>
              <div style={styles.videoContainer}>
                <video controls autoPlay style={styles.modalVideo} src={`http://localhost:5000${selectedVideo.file_path}`} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += '<p style="color: white; text-align: center;">Video failed to load</p>'; }} />
              </div>
            </div>
          </div>
        )}

        {/* PDF Viewer Modal */}
        {selectedPdf && (
          <div style={styles.modalOverlay} onClick={closePdf}>
            <div style={styles.pdfModalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{selectedPdf.title}</h3>
                <button onClick={closePdf} style={styles.closeButton}>×</button>
              </div>
              <div style={styles.pdfContainer}>
                {!pdfError ? (
                  <iframe src={`http://localhost:5000${selectedPdf.file_path}#toolbar=1&navpanes=1`} style={styles.pdfViewer} title={selectedPdf.title} onError={() => setPdfError(true)} />
                ) : (
                  <div style={styles.pdfErrorContainer}>
                    <p style={styles.pdfErrorIcon}>📄</p>
                    <h3 style={styles.pdfErrorTitle}>Unable to display PDF</h3>
                    <p style={styles.pdfErrorMessage}>Click the button below to download</p>
                    <a 
                      href={`http://localhost:5000${selectedPdf.file_path}`} 
                      download={selectedPdf.title} 
                      style={styles.pdfDownloadButton}
                      onMouseEnter={() => handleButtonMouseEnter('pdf-download')}
                      onMouseLeave={handleButtonMouseLeave}
                      onMouseDown={() => handleButtonMouseDown('pdf-download')}
                      onMouseUp={handleButtonMouseUp}
                    >
                      ⬇️ Download PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showProfile && renderProfileModal()}
        {selectedUserProfile && renderUserProfileModal()}
      </div>
    );
  }

  // Main dashboard view
  return (
    <div style={styles.appContainer}>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <img src="/images/logo.jpg" alt="StudyMart" style={styles.logoImage} />
          <div style={styles.navButtons}>
            <button 
              style={{
                ...styles.navButton,
                ...(activeSection === 'home' ? styles.navButtonActive : {}),
                ...(hoveredButton === 'nav-home' ? styles.navButtonHover : {}),
                ...(pressedButton === 'nav-home' ? styles.navButtonPressed : {})
              }}
              onClick={() => setActiveSection('home')}
              onMouseEnter={() => handleButtonMouseEnter('nav-home')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('nav-home')}
              onMouseUp={handleButtonMouseUp}
            >
              Home
            </button>
            <button 
              style={{
                ...styles.navButton,
                ...(activeSection === 'learning' ? styles.navButtonActive : {}),
                ...(hoveredButton === 'nav-learning' ? styles.navButtonHover : {}),
                ...(pressedButton === 'nav-learning' ? styles.navButtonPressed : {})
              }}
              onClick={() => setActiveSection('learning')}
              onMouseEnter={() => handleButtonMouseEnter('nav-learning')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('nav-learning')}
              onMouseUp={handleButtonMouseUp}
            >
              Learning
            </button>
            <button 
              style={{
                ...styles.navButton,
                ...(activeSection === 'marketplace' ? styles.navButtonActive : {}),
                ...(hoveredButton === 'nav-marketplace' ? styles.navButtonHover : {}),
                ...(pressedButton === 'nav-marketplace' ? styles.navButtonPressed : {})
              }}
              onClick={() => setActiveSection('marketplace')}
              onMouseEnter={() => handleButtonMouseEnter('nav-marketplace')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('nav-marketplace')}
              onMouseUp={handleButtonMouseUp}
            >
              Marketplace
            </button>
            <button 
              style={{
                ...styles.navButton,
                ...(activeSection === 'socials' ? styles.navButtonActive : {}),
                ...(hoveredButton === 'nav-socials' ? styles.navButtonHover : {}),
                ...(pressedButton === 'nav-socials' ? styles.navButtonPressed : {})
              }}
              onClick={() => setActiveSection('socials')}
              onMouseEnter={() => handleButtonMouseEnter('nav-socials')}
              onMouseLeave={handleButtonMouseLeave}
              onMouseDown={() => handleButtonMouseDown('nav-socials')}
              onMouseUp={handleButtonMouseUp}
            >
              Community
            </button>
          </div>
          <button 
            onClick={() => setShowProfile(true)} 
            style={{
              ...styles.profileButton,
              ...(hoveredButton === 'profile' ? styles.profileButtonHover : {}),
              ...(pressedButton === 'profile' ? styles.profileButtonPressed : {})
            }}
            onMouseEnter={() => handleButtonMouseEnter('profile')}
            onMouseLeave={handleButtonMouseLeave}
            onMouseDown={() => handleButtonMouseDown('profile')}
            onMouseUp={handleButtonMouseUp}
          >
            <span style={styles.userName}>{user?.profile?.full_name || 'Profile'}</span>
            <div style={styles.avatarSmall}>
              {profileData.avatar_url ? <img src={profileData.avatar_url} alt="Avatar" style={styles.avatarSmallImage} /> : <span>👤</span>}
            </div>
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {activeSection === 'home' && (
              <div style={styles.fadeIn}>
                <h2 style={styles.sectionTitle}>🏠 Home</h2>
                <div style={styles.welcomeCard}>
                  <h3 style={styles.welcomeTitle}>Welcome back, {user?.profile?.full_name || 'Student'}!</h3>
                  <p style={styles.welcomeText}>Continue your learning journey with Study-Mart</p>
                  <div style={styles.welcomeGlow}></div>
                </div>
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <h3 style={styles.statNumber}>0</h3>
                    <p style={styles.statLabel}>Courses In Progress</p>
                  </div>
                  <div style={styles.statCard}>
                    <h3 style={styles.statNumber}>0</h3>
                    <p style={styles.statLabel}>Completed Courses</p>
                  </div>
                  <div style={styles.statCard}>
                    <h3 style={styles.statNumber}>{courses.length}</h3>
                    <p style={styles.statLabel}>Available Courses</p>
                  </div>
                </div>
                <h3 style={styles.subTitle}>Continue Learning</h3>
                <div style={styles.courseGrid}>
                  {courses.slice(0,3).map(course => (
                    <div 
                      key={course.id} 
                      style={styles.courseCard} 
                      onClick={() => handleCourseClick(course)}
                      onMouseEnter={() => handleButtonMouseEnter(`course-${course.id}`)}
                      onMouseLeave={handleButtonMouseLeave}
                    >
                      <img src={course.thumbnail_url || 'https://picsum.photos/300/150?random=1'} alt={course.title} style={styles.courseImage} />
                      <div style={styles.courseContent}>
                        <h4 style={styles.courseTitle}>{course.title}</h4>
                        <p style={styles.courseInstructor}>By {course.profiles?.full_name || 'Instructor'}</p>
                        <div style={styles.courseFooter}><span style={styles.coursePrice}>${course.price || 0}</span><span style={styles.courseLevel}>{course.level}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'learning' && (
              <div style={styles.fadeIn}>
                <h2 style={styles.sectionTitle}>📚 Learning</h2>
                {courses.length > 0 ? (
                  <div style={styles.courseGrid}>
                    {courses.map(course => (
                      <div 
                        key={course.id} 
                        style={styles.courseCard} 
                        onClick={() => handleCourseClick(course)}
                        onMouseEnter={() => handleButtonMouseEnter(`course-${course.id}`)}
                        onMouseLeave={handleButtonMouseLeave}
                      >
                        <img src={course.thumbnail_url || 'https://picsum.photos/300/150?random=2'} alt={course.title} style={styles.courseImage} />
                        <div style={styles.courseContent}>
                          <h3 style={styles.courseTitle}>{course.title}</h3>
                          <p style={styles.courseInstructor}>By {course.profiles?.full_name || 'Admin'}</p>
                          <div style={styles.courseFooter}><span style={styles.coursePrice}>${course.price || 0}</span><span style={styles.courseLevel}>{course.level}</span></div>
                          <button 
                            style={{
                              ...styles.enrollButton,
                              ...(hoveredButton === `enroll-${course.id}` ? styles.enrollButtonHover : {}),
                              ...(pressedButton === `enroll-${course.id}` ? styles.enrollButtonPressed : {})
                            }}
                            onMouseEnter={() => handleButtonMouseEnter(`enroll-${course.id}`)}
                            onMouseLeave={handleButtonMouseLeave}
                            onMouseDown={() => handleButtonMouseDown(`enroll-${course.id}`)}
                            onMouseUp={handleButtonMouseUp}
                          >
                            Start Learning
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <p>You haven't started any courses yet.</p>
                    <button 
                      style={{
                        ...styles.browseButton,
                        ...(hoveredButton === 'browse' ? styles.browseButtonHover : {}),
                        ...(pressedButton === 'browse' ? styles.browseButtonPressed : {})
                      }}
                      onClick={() => setActiveSection('marketplace')}
                      onMouseEnter={() => handleButtonMouseEnter('browse')}
                      onMouseLeave={handleButtonMouseLeave}
                      onMouseDown={() => handleButtonMouseDown('browse')}
                      onMouseUp={handleButtonMouseUp}
                    >
                      Browse Marketplace
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'marketplace' && (
              <div style={styles.fadeIn}>
                <div style={styles.marketplaceHeader}>
                  <h2 style={styles.sectionTitle}>🛒 Marketplace</h2>
                  {!sellerApplicationStatus && !isSeller && (
                    <button 
                      style={{
                        ...styles.becomeSellerButton,
                        ...(hoveredButton === 'become-seller' ? styles.becomeSellerButtonHover : {}),
                        ...(pressedButton === 'become-seller' ? styles.becomeSellerButtonPressed : {})
                      }}
                      onClick={() => setShowSellerApplication(true)}
                      onMouseEnter={() => handleButtonMouseEnter('become-seller')}
                      onMouseLeave={handleButtonMouseLeave}
                      onMouseDown={() => handleButtonMouseDown('become-seller')}
                      onMouseUp={handleButtonMouseUp}
                    >
                      Become a Seller
                    </button>
                  )}
                </div>

                {/* Seller Application Status */}
                {sellerApplicationStatus && sellerApplicationStatus.status === 'pending' && (
                  <div style={styles.applicationStatus}>
                    <p>Your seller application is under review.</p>
                    <p>Status: <strong>Pending</strong></p>
                  </div>
                )}

                {sellerApplicationStatus && sellerApplicationStatus.status === 'rejected' && (
                  <div style={styles.applicationStatusRejected}>
                    <p>Your seller application was rejected.</p>
                    <p>Status: <strong>Rejected</strong></p>
                  </div>
                )}

                {/* Seller Dashboard for approved sellers */}
                {isSeller && (
                  <div style={styles.sellerDashboardContainer}>
                    <SellerDashboard />
                  </div>
                )}

                {/* Product Grid */}
                <h3 style={styles.subTitle}>Available Products</h3>
                {loadingProducts ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.loader}></div>
                    <p style={styles.loadingText}>Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div style={styles.emptyState}>
                    <p>No products available yet.</p>
                    {!isSeller && !sellerApplicationStatus && (
                      <button 
                        style={{
                          ...styles.browseButton,
                          ...(hoveredButton === 'become-seller-empty' ? styles.browseButtonHover : {}),
                          ...(pressedButton === 'become-seller-empty' ? styles.browseButtonPressed : {})
                        }}
                        onClick={() => setShowSellerApplication(true)}
                        onMouseEnter={() => handleButtonMouseEnter('become-seller-empty')}
                        onMouseLeave={handleButtonMouseLeave}
                        onMouseDown={() => handleButtonMouseDown('become-seller-empty')}
                        onMouseUp={handleButtonMouseUp}
                      >
                        Become a Seller
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={styles.productGrid}>
                    {products.map(product => (
                      <div 
                        key={product.id} 
                        style={styles.productCard}
                        onMouseEnter={() => handleButtonMouseEnter(`product-${product.id}`)}
                        onMouseLeave={handleButtonMouseLeave}
                      >
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={`https://study-mart-backend.onrender.com${product.images.find(img => img.is_primary)?.image_url || product.images[0].image_url}`}
                            alt={product.name}
                            style={styles.productImage}
                          />
                        ) : (
                          <div style={styles.productImagePlaceholder}>📦</div>
                        )}
                        <div style={styles.productContent}>
                          <h4 style={styles.productName}>{product.name}</h4>
                          <p style={styles.productSeller}>{product.seller?.business_name}</p>
                          <p style={styles.productPrice}>₦{product.price}</p>
                          <p style={styles.productDescription}>
                            {product.description?.substring(0, 60)}...
                          </p>
                          <button 
                            style={{
                              ...styles.buyButton,
                              ...(hoveredButton === `buy-${product.id}` ? styles.buyButtonHover : {}),
                              ...(pressedButton === `buy-${product.id}` ? styles.buyButtonPressed : {})
                            }}
                            onClick={() => handleBuyProduct(product)}
                            onMouseEnter={() => handleButtonMouseEnter(`buy-${product.id}`)}
                            onMouseLeave={handleButtonMouseLeave}
                            onMouseDown={() => handleButtonMouseDown(`buy-${product.id}`)}
                            onMouseUp={handleButtonMouseUp}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showSellerApplication && (
                  <SellerApplicationModal 
                    onClose={() => setShowSellerApplication(false)} 
                  />
                )}
              </div>
            )}

            {activeSection === 'socials' && (
              <div style={styles.communityContainer}>
                {/* Community Hero with Background Image */}
                <div style={styles.communityHero}>
                  <div style={styles.heroOverlay}></div>
                  <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>StudyMart Community</h1>
                    <p style={styles.heroSubtitle}>Connect, Learn, Grow Together</p>
                    <div style={styles.heroStats}>
                      <div style={styles.heroStat}>
                        <span style={styles.heroStatNumber}>12.5k+</span>
                        <span style={styles.heroStatLabel}>Members</span>
                      </div>
                      <div style={styles.heroStat}>
                        <span style={styles.heroStatNumber}>345</span>
                        <span style={styles.heroStatLabel}>Online Now</span>
                      </div>
                      <div style={styles.heroStat}>
                        <span style={styles.heroStatNumber}>724</span>
                        <span style={styles.heroStatLabel}>Topics</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Action Tabs */}
                <div style={styles.communityActionTabs}>
                  <button 
                    style={{
                      ...styles.communityTab,
                      ...(communityTab === 'feed' ? styles.communityTabActive : {}),
                      ...(hoveredButton === 'tab-feed' ? styles.communityTabHover : {}),
                      ...(pressedButton === 'tab-feed' ? styles.communityTabPressed : {})
                    }}
                    onClick={() => setCommunityTab('feed')}
                    onMouseEnter={() => handleButtonMouseEnter('tab-feed')}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => handleButtonMouseDown('tab-feed')}
                    onMouseUp={handleButtonMouseUp}
                  >
                    Feed
                  </button>
                  <button 
                    style={{
                      ...styles.communityTab,
                      ...(communityTab === 'qna' ? styles.communityTabActive : {}),
                      ...(hoveredButton === 'tab-qna' ? styles.communityTabHover : {}),
                      ...(pressedButton === 'tab-qna' ? styles.communityTabPressed : {})
                    }}
                    onClick={() => setCommunityTab('qna')}
                    onMouseEnter={() => handleButtonMouseEnter('tab-qna')}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => handleButtonMouseDown('tab-qna')}
                    onMouseUp={handleButtonMouseUp}
                  >
                    Q&A
                  </button>
                  <button 
                    style={{
                      ...styles.communityTab,
                      ...(communityTab === 'tips' ? styles.communityTabActive : {}),
                      ...(hoveredButton === 'tab-tips' ? styles.communityTabHover : {}),
                      ...(pressedButton === 'tab-tips' ? styles.communityTabPressed : {})
                    }}
                    onClick={() => setCommunityTab('tips')}
                    onMouseEnter={() => handleButtonMouseEnter('tab-tips')}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => handleButtonMouseDown('tab-tips')}
                    onMouseUp={handleButtonMouseUp}
                  >
                    Study Tips
                  </button>
                  <button 
                    style={{
                      ...styles.communityTab,
                      ...(communityTab === 'resources' ? styles.communityTabActive : {}),
                      ...(hoveredButton === 'tab-resources' ? styles.communityTabHover : {}),
                      ...(pressedButton === 'tab-resources' ? styles.communityTabPressed : {})
                    }}
                    onClick={() => setCommunityTab('resources')}
                    onMouseEnter={() => handleButtonMouseEnter('tab-resources')}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => handleButtonMouseDown('tab-resources')}
                    onMouseUp={handleButtonMouseUp}
                  >
                    Resources
                  </button>
                  <button 
                    style={{
                      ...styles.communityTab,
                      ...(communityTab === 'live' ? styles.communityTabActive : {}),
                      ...(hoveredButton === 'tab-live' ? styles.communityTabHover : {}),
                      ...(pressedButton === 'tab-live' ? styles.communityTabPressed : {})
                    }}
                    onClick={() => setCommunityTab('live')}
                    onMouseEnter={() => handleButtonMouseEnter('tab-live')}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => handleButtonMouseDown('tab-live')}
                    onMouseUp={handleButtonMouseUp}
                  >
                    Live
                  </button>
                  <button 
                    style={{
                      ...styles.communityTab,
                      ...(communityTab === 'groups' ? styles.communityTabActive : {}),
                      ...(hoveredButton === 'tab-groups' ? styles.communityTabHover : {}),
                      ...(pressedButton === 'tab-groups' ? styles.communityTabPressed : {})
                    }}
                    onClick={() => setCommunityTab('groups')}
                    onMouseEnter={() => handleButtonMouseEnter('tab-groups')}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => handleButtonMouseDown('tab-groups')}
                    onMouseUp={handleButtonMouseUp}
                  >
                    Groups
                  </button>
                  <button 
                    style={{
                      ...styles.communityTab,
                      ...(communityTab === 'messages' ? styles.communityTabActive : {}),
                      ...(hoveredButton === 'tab-messages' ? styles.communityTabHover : {}),
                      ...(pressedButton === 'tab-messages' ? styles.communityTabPressed : {})
                    }}
                    onClick={() => setCommunityTab('messages')}
                    onMouseEnter={() => handleButtonMouseEnter('tab-messages')}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={() => handleButtonMouseDown('tab-messages')}
                    onMouseUp={handleButtonMouseUp}
                  >
                    Messages
                  </button>
                </div>

                {/* Main Community Grid */}
                <div style={styles.communityGrid}>
                  {/* Left Main Area */}
                  <div style={styles.communityMain}>
                    {communityTab === 'feed' && (
                      <div>
                        <h3 style={styles.columnTitle}>Feed</h3>
                        {/* Create Post Form */}
                        <form onSubmit={handleCreatePost} style={styles.createPostForm}>
                          <textarea
                            placeholder="What's on your mind?"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            style={styles.postTextarea}
                            rows="3"
                          />
                          <div style={styles.postActions}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setNewPostImage(e.target.files[0])}
                              id="post-image-input"
                              style={{ display: 'none' }}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById('post-image-input').click()}
                              style={{
                                ...styles.imageUploadButton,
                                ...(hoveredButton === 'image-upload' ? styles.imageUploadButtonHover : {}),
                                ...(pressedButton === 'image-upload' ? styles.imageUploadButtonPressed : {})
                              }}
                              onMouseEnter={() => handleButtonMouseEnter('image-upload')}
                              onMouseLeave={handleButtonMouseLeave}
                              onMouseDown={() => handleButtonMouseDown('image-upload')}
                              onMouseUp={handleButtonMouseUp}
                            >
                              📷 Add Image
                            </button>
                            {newPostImage && <span style={styles.fileName}>{newPostImage.name}</span>}
                            <button 
                              type="submit" 
                              disabled={posting} 
                              style={{
                                ...styles.submitPostButton,
                                ...(hoveredButton === 'submit-post' && !posting ? styles.submitPostButtonHover : {}),
                                ...(pressedButton === 'submit-post' && !posting ? styles.submitPostButtonPressed : {})
                              }}
                              onMouseEnter={() => !posting && handleButtonMouseEnter('submit-post')}
                              onMouseLeave={handleButtonMouseLeave}
                              onMouseDown={() => !posting && handleButtonMouseDown('submit-post')}
                              onMouseUp={handleButtonMouseUp}
                            >
                              {posting ? 'Posting...' : 'Post'}
                            </button>
                          </div>
                        </form>

                        {loadingFeed ? (
                          <div style={styles.loadingContainer}>
                            <div style={styles.loader}></div>
                            <p style={styles.loadingText}>Loading feed...</p>
                          </div>
                        ) : feedError ? (
                          <p style={{ color: 'red' }}>{feedError}</p>
                        ) : feedPosts.length === 0 ? (
                          <p>No posts yet. Be the first to post!</p>
                        ) : (
                          feedPosts.map((post) => (
                            <div key={post.id} style={styles.feedPost}>
                              <div style={styles.postHeader} onClick={() => handleViewProfile(post.user_id)}>
                                <div style={styles.authorAvatar}>
                                  {post.user?.avatar_url ? (
                                    <img src={post.user.avatar_url} alt="avatar" style={styles.avatarThumb} />
                                  ) : (
                                    '👤'
                                  )}
                                </div>
                                <div>
                                  <h4 style={styles.authorName}>
                                    {post.user?.full_name} <span style={styles.authorRole}>• {post.user?.role}</span>
                                  </h4>
                                  <p style={styles.postTime}>{new Date(post.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                              <p style={styles.postContent}>{post.content}</p>
                              {post.image_url && <img src={post.image_url} alt="post" style={styles.postImage} />}
                              <div style={styles.postStats}>
                                <button
                                  style={{
                                    ...styles.likeButton,
                                    ...(post.liked ? styles.likedButton : {}),
                                    ...(hoveredButton === `like-${post.id}` ? styles.likeButtonHover : {}),
                                    ...(pressedButton === `like-${post.id}` ? styles.likeButtonPressed : {})
                                  }}
                                  onClick={() => handleLikePost(post.id)}
                                  onMouseEnter={() => handleButtonMouseEnter(`like-${post.id}`)}
                                  onMouseLeave={handleButtonMouseLeave}
                                  onMouseDown={() => handleButtonMouseDown(`like-${post.id}`)}
                                  onMouseUp={handleButtonMouseUp}
                                >
                                  ❤️ {post.likes}
                                </button>
                                <span>💬 {post.comments || 0}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {communityTab === 'qna' && <div><h3 style={styles.columnTitle}>Q&A Forums</h3><p>Coming soon...</p></div>}
                    {communityTab === 'tips' && <div><h3 style={styles.columnTitle}>Study Tips</h3><p>Coming soon...</p></div>}
                    {communityTab === 'resources' && <div><h3 style={styles.columnTitle}>Resources</h3><p>Coming soon...</p></div>}
                    {communityTab === 'live' && <div><h3 style={styles.columnTitle}>Live Sessions</h3><p>Coming soon...</p></div>}

                    {communityTab === 'groups' && (
                      <div>
                        <h3 style={styles.columnTitle}>Study Groups</h3>
                        <button 
                          onClick={handleCreateGroup} 
                          style={{
                            ...styles.createGroupButton,
                            ...(hoveredButton === 'create-group' ? styles.createGroupButtonHover : {}),
                            ...(pressedButton === 'create-group' ? styles.createGroupButtonPressed : {})
                          }}
                          onMouseEnter={() => handleButtonMouseEnter('create-group')}
                          onMouseLeave={handleButtonMouseLeave}
                          onMouseDown={() => handleButtonMouseDown('create-group')}
                          onMouseUp={handleButtonMouseUp}
                        >
                          + Create New Group
                        </button>
                        {loadingGroups ? (
                          <div style={styles.loadingContainer}>
                            <div style={styles.loader}></div>
                            <p style={styles.loadingText}>Loading groups...</p>
                          </div>
                        ) : groups.length === 0 ? (
                          <p>No groups yet.</p>
                        ) : (
                          groups.map(group => (
                            <div key={group.id} style={styles.groupCard}>
                              <div style={styles.groupIcon}>👥</div>
                              <div style={styles.groupInfo}>
                                <h4>{group.name}</h4>
                                <p>{group.members} members • {group.description}</p>
                                {group.joined ? (
                                  <button 
                                    style={{
                                      ...styles.leaveButton,
                                      ...(hoveredButton === `leave-${group.id}` ? styles.leaveButtonHover : {}),
                                      ...(pressedButton === `leave-${group.id}` ? styles.leaveButtonPressed : {})
                                    }}
                                    onClick={() => handleLeaveGroup(group.id)}
                                    onMouseEnter={() => handleButtonMouseEnter(`leave-${group.id}`)}
                                    onMouseLeave={handleButtonMouseLeave}
                                    onMouseDown={() => handleButtonMouseDown(`leave-${group.id}`)}
                                    onMouseUp={handleButtonMouseUp}
                                  >
                                    Leave
                                  </button>
                                ) : (
                                  <button 
                                    style={{
                                      ...styles.joinButton,
                                      ...(hoveredButton === `join-${group.id}` ? styles.joinButtonHover : {}),
                                      ...(pressedButton === `join-${group.id}` ? styles.joinButtonPressed : {})
                                    }}
                                    onClick={() => handleJoinGroup(group.id)}
                                    onMouseEnter={() => handleButtonMouseEnter(`join-${group.id}`)}
                                    onMouseLeave={handleButtonMouseLeave}
                                    onMouseDown={() => handleButtonMouseDown(`join-${group.id}`)}
                                    onMouseUp={handleButtonMouseUp}
                                  >
                                    Join
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {communityTab === 'messages' && (
                      <div>
                        <h3 style={styles.columnTitle}>Messages</h3>
                        {loadingMessages ? (
                          <div style={styles.loadingContainer}>
                            <div style={styles.loader}></div>
                            <p style={styles.loadingText}>Loading messages...</p>
                          </div>
                        ) : messages.length === 0 ? (
                          <p>No messages yet.</p>
                        ) : (
                          messages.map(chat => (
                            <div 
                              key={chat.id} 
                              style={styles.messageCard} 
                              onClick={() => alert(`Open chat with ${chat.with_name}`)}
                              onMouseEnter={() => handleButtonMouseEnter(`chat-${chat.id}`)}
                              onMouseLeave={handleButtonMouseLeave}
                            >
                              <div style={styles.messageAvatar}>👤</div>
                              <div style={styles.messageInfo}>
                                <h4>{chat.with_name}</h4>
                                <p>{chat.last_message}</p>
                              </div>
                              <div style={styles.messageMeta}>
                                <span>{new Date(chat.updated_at).toLocaleTimeString()}</span>
                                {chat.unread > 0 && <span style={styles.unreadBadge}>{chat.unread}</span>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar - Quick Info */}
                  <div style={styles.communitySidebar}>
                    <div style={styles.sidebarSection}>
                      <h3 style={styles.sidebarTitle}>Top Contributors</h3>
                      {topContributors.map(contributor => (
                        <div 
                          key={contributor.id} 
                          style={styles.contributorCard} 
                          onClick={() => handleViewProfile(contributor.id)}
                          onMouseEnter={() => handleButtonMouseEnter(`contributor-${contributor.id}`)}
                          onMouseLeave={handleButtonMouseLeave}
                        >
                          <span>{contributor.full_name}</span>
                          <span>{contributor.posts} posts</span>
                        </div>
                      ))}
                    </div>
                    <div style={styles.sidebarSection}>
                      <h3 style={styles.sidebarTitle}>Upcoming Events</h3>
                      {events.map(event => (
                        <div key={event.id} style={styles.eventCard}>
                          <span>📅 {event.title}</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          {!event.attending && (
                            <button 
                              style={{
                                ...styles.attendButton,
                                ...(hoveredButton === `attend-${event.id}` ? styles.attendButtonHover : {}),
                                ...(pressedButton === `attend-${event.id}` ? styles.attendButtonPressed : {})
                              }}
                              onClick={() => handleAttendEvent(event.id)}
                              onMouseEnter={() => handleButtonMouseEnter(`attend-${event.id}`)}
                              onMouseLeave={handleButtonMouseLeave}
                              onMouseDown={() => handleButtonMouseDown(`attend-${event.id}`)}
                              onMouseUp={handleButtonMouseUp}
                            >
                              Attend
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Profile Modals */}
      {showProfile && renderProfileModal()}
      {selectedUserProfile && renderUserProfileModal()}
    </div>
  );
}

// ==================== STYLES ====================
const styles = {
  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  
  // Navbar - Blue
  navbar: {
    background: 'linear-gradient(90deg, #1E3A8A 0%, #2563EB 100%)',
    padding: '0.8rem 0',
    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
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
  logoImage: {
    height: '45px',
    width: 'auto',
    cursor: 'pointer',
    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))',
    transition: 'all 0.3s ease',
  },
  navButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  navButton: {
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(5px)',
    letterSpacing: '0.3px',
  },
  navButtonHover: {
    background: 'rgba(255, 255, 255, 0.25)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)',
  },
  navButtonPressed: {
    transform: 'translateY(2px) scale(0.98)',
    background: 'rgba(46, 204, 113, 0.4)',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)',
  },
  navButtonActive: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '40px',
    padding: '5px 20px 5px 5px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(5px)',
  },
  profileButtonHover: {
    background: 'rgba(46, 204, 113, 0.3)',
    borderColor: '#2ECC71',
    transform: 'scale(1.05)',
  },
  profileButtonPressed: {
    transform: 'scale(0.98)',
    background: 'rgba(46, 204, 113, 0.5)',
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  avatarSmall: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  avatarSmallImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  // Container
  container: {
    maxWidth: '1400px',
    margin: '30px auto',
    padding: '0 20px',
  },

  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
  },
  loader: {
    border: '4px solid rgba(37, 99, 235, 0.2)',
    borderTop: '4px solid #FF6B35',
    borderRight: '4px solid #2ECC71',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '16px',
    color: '#1E293B',
    fontWeight: '500',
  },

  // Section Titles
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '25px',
    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #FF6B35 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    '@media (max-width: 768px)': {
      fontSize: '24px',
    },
    '@media (max-width: 480px)': {
      fontSize: '20px',
    },
  },
  subTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '30px 0 20px',
    position: 'relative',
    paddingLeft: '15px',
    borderLeft: '4px solid #FF6B35',
    '@media (max-width: 768px)': {
      fontSize: '20px',
    },
    '@media (max-width: 480px)': {
      fontSize: '18px',
    },
  },

  // Welcome Card
  welcomeCard: {
    position: 'relative',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    padding: '40px',
    borderRadius: '24px',
    marginBottom: '40px',
    boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)',
    overflow: 'hidden',
    border: '1px solid rgba(46, 204, 113, 0.2)',
    '@media (max-width: 768px)': {
      padding: '20px',
    },
  },
  welcomeGlow: {
    position: 'absolute',
    top: '-50%',
    right: '-10%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, rgba(46,204,113,0.1) 50%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '10px',
    position: 'relative',
    zIndex: 1,
    '@media (max-width: 768px)': {
      fontSize: '20px',
    },
  },
  welcomeText: {
    fontSize: '18px',
    color: '#4B5563',
    position: 'relative',
    zIndex: 1,
    '@media (max-width: 768px)': {
      fontSize: '16px',
    },
  },

  // Stats Cards
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  statCard: {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    padding: '25px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
    border: '1px solid rgba(37, 99, 235, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(255,107,53,0.15)',
    },
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '16px',
    color: '#4B5563',
    fontWeight: '500',
  },

  // Course Grid
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  courseCard: {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    border: '1px solid rgba(46, 204, 113, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 30px rgba(255,107,53,0.2)',
      borderColor: '#FF6B35',
    },
  },
  courseImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
  },
  courseContent: {
    padding: '20px',
  },
  courseTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1E293B',
  },
  courseInstructor: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '15px',
  },
  courseFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  coursePrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#FF6B35',
  },
  courseLevel: {
    fontSize: '12px',
    padding: '4px 10px',
    backgroundColor: '#EFF6FF',
    borderRadius: '20px',
    color: '#2563EB',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  enrollButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  enrollButtonHover: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    transform: 'scale(1.02)',
    boxShadow: '0 8px 20px rgba(255,107,53,0.4)',
  },
  enrollButtonPressed: {
    transform: 'scale(0.98)',
    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)',
  },

  // Buttons
  backButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '25px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  backButtonHover: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    transform: 'translateX(-5px)',
  },
  backButtonPressed: {
    transform: 'translateX(-2px) scale(0.98)',
  },
  browseButton: {
    padding: '12px 30px',
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(255,107,53,0.3)',
  },
  browseButtonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 30px rgba(46,204,113,0.4)',
  },
  browseButtonPressed: {
    transform: 'scale(0.98)',
  },

  // Tabs
  tabContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    borderBottom: '2px solid rgba(37, 99, 235, 0.1)',
    paddingBottom: '10px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#64748B',
    fontWeight: '500',
    borderRadius: '10px 10px 0 0',
    transition: 'all 0.2s ease',
  },
  tabHover: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    color: '#FF6B35',
  },
  tabPressed: {
    transform: 'scale(0.98)',
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
  },
  activeTab: {
    color: '#FF6B35',
    borderBottom: '3px solid #FF6B35',
    fontWeight: '600',
  },

  // Course Content
  courseHeader: {
    marginBottom: '30px',
  },
  courseDescription: {
    fontSize: '18px',
    color: '#4B5563',
    marginBottom: '15px',
    lineHeight: '1.6',
  },
  courseMeta: {
    display: 'flex',
    gap: '30px',
    fontSize: '16px',
    color: '#64748B',
    flexWrap: 'wrap',
  },

  // Video/PDF Grid
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(255,107,53,0.2)',
      borderColor: '#FF6B35',
    },
  },
  videoThumbnail: {
    height: '140px',
    background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: 'white',
  },
  videoInfo: {
    padding: '15px',
  },
  videoTitle: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '5px',
    color: '#1E293B',
  },
  videoDuration: {
    fontSize: '13px',
    color: '#64748B',
  },
  pdfGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  pdfCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(46,204,113,0.2)',
      borderColor: '#2ECC71',
    },
  },
  pdfIcon: {
    fontSize: '36px',
  },
  pdfTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1E293B',
  },
  pdfSize: {
    fontSize: '13px',
    color: '#64748B',
  },
  qaItem: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  qaQuestion: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#1E293B',
  },
  qaAnswer: {
    fontSize: '16px',
    color: '#4B5563',
    lineHeight: '1.6',
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  },
  pdfModalContent: {
    backgroundColor: '#F8FAFC',
    borderRadius: '20px',
    width: '95%',
    maxWidth: '1200px',
    height: '90vh',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '20px 25px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(90deg, #F8FAFC 0%, #FFFFFF 100%)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#64748B',
    padding: '0 10px',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#FF6B35',
      transform: 'rotate(90deg)',
    },
  },
  videoContainer: {
    padding: '20px',
    backgroundColor: '#000',
  },
  modalVideo: {
    width: '100%',
    maxHeight: '70vh',
    outline: 'none',
  },
  pdfContainer: {
    height: 'calc(90vh - 60px)',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    overflow: 'auto',
  },
  pdfViewer: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: 'white',
  },
  pdfErrorContainer: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  pdfErrorIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    color: '#dc2626',
  },
  pdfErrorTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '10px',
  },
  pdfErrorMessage: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  pdfDownloadButton: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#6366f1',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
  },

  // Profile Modal Styles
  profileModal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  profileHeader: {
    padding: '20px',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  profileContent: {
    padding: '30px',
  },
  profileAvatar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  avatarLarge: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    backgroundColor: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    marginBottom: '15px',
    overflow: 'hidden',
    border: '4px solid #FF6B35',
    boxShadow: '0 8px 20px rgba(255,107,53,0.3)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarEmoji: {
    fontSize: '48px',
  },
  editProfileButton: {
    padding: '8px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  profileInfo: {
    marginBottom: '30px',
  },
  infoRow: {
    marginBottom: '20px',
  },
  readOnlyText: {
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333',
  },
  profileInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  profileTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
  },
  profileActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  logoutButtonLarge: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '20px',
  },

  // Marketplace Styles
  marketplaceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  becomeSellerButton: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  becomeSellerButtonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 20px rgba(255,107,53,0.3)',
  },
  becomeSellerButtonPressed: {
    transform: 'scale(0.98)',
  },
  applicationStatus: {
    backgroundColor: '#fef3c7',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #fcd34d',
  },
  applicationStatusRejected: {
    backgroundColor: '#fee2e2',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f87171',
  },
  sellerDashboardContainer: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
  },
  productImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '180px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: '#999',
  },
  productContent: {
    padding: '15px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '5px',
    color: '#333',
  },
  productSeller: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '5px',
  },
  productPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: '8px',
  },
  productDescription: {
    fontSize: '13px',
    color: '#777',
    marginBottom: '10px',
    lineHeight: '1.4',
  },
  buyButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  buyButtonHover: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    transform: 'scale(1.02)',
  },
  buyButtonPressed: {
    transform: 'scale(0.98)',
  },

  // Community Styles
  communityContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  communityHero: {
    position: 'relative',
    height: '300px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '30px',
    backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '@media (max-width: 768px)': {
      height: '250px',
    },
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(30,58,138,0.8) 0%, rgba(37,99,235,0.7) 100%)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
    '@media (max-width: 768px)': {
      fontSize: '28px',
    },
  },
  heroSubtitle: {
    fontSize: '18px',
    marginBottom: '20px',
    '@media (max-width: 768px)': {
      fontSize: '16px',
    },
  },
  heroStats: {
    display: 'flex',
    gap: '30px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '10px',
    },
  },
  heroStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  heroStatLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
  communityActionTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  communityTab: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    '@media (max-width: 768px)': {
      padding: '6px 12px',
      fontSize: '13px',
    },
  },
  communityTabHover: {
    backgroundColor: '#FF6B35',
    color: 'white',
    transform: 'translateY(-2px)',
  },
  communityTabPressed: {
    transform: 'scale(0.95)',
  },
  communityTabActive: {
    backgroundColor: '#6366f1',
    color: 'white',
  },
  communityGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  communityMain: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  communitySidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sidebarSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  columnTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  createPostForm: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  postTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '10px',
    resize: 'vertical',
  },
  postActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  imageUploadButton: {
    padding: '8px 12px',
    backgroundColor: '#e0e7ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  fileName: {
    fontSize: '12px',
    color: '#666',
  },
  submitPostButton: {
    padding: '8px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: 'auto',
  },
  feedPost: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  authorAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    overflow: 'hidden',
  },
  avatarThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  authorName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '2px',
  },
  authorRole: {
    fontSize: '12px',
    color: '#666',
  },
  postTime: {
    fontSize: '12px',
    color: '#888',
  },
  postContent: {
    fontSize: '14px',
    marginBottom: '10px',
  },
  postImage: {
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  postStats: {
    display: 'flex',
    gap: '15px',
    fontSize: '13px',
    color: '#666',
  },
  likeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    fontSize: '13px',
  },
  likeButtonHover: {
    color: '#FF6B35',
    transform: 'scale(1.1)',
  },
  likeButtonPressed: {
    transform: 'scale(0.95)',
  },
  likedButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#FF6B35',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  groupCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  groupIcon: {
    fontSize: '32px',
  },
  groupInfo: {
    flex: 1,
  },
  joinButton: {
    padding: '4px 12px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  joinButtonHover: {
    backgroundColor: '#FF6B35',
    transform: 'scale(1.05)',
  },
  joinButtonPressed: {
    transform: 'scale(0.95)',
  },
  leaveButton: {
    padding: '4px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  leaveButtonHover: {
    transform: 'scale(1.05)',
  },
  leaveButtonPressed: {
    transform: 'scale(0.95)',
  },
  createGroupButton: {
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  messageCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  messageAvatar: {
    fontSize: '32px',
  },
  messageInfo: {
    flex: 1,
  },
  messageMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px',
  },
  unreadBadge: {
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 6px',
    fontSize: '11px',
  },
  messageButton: {
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  contributorCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
  },
  eventCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  attendButton: {
    padding: '4px 8px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
  },
  fadeIn: {
    animation: 'fadeIn 0.5s ease-in-out',
  },
};

// Add keyframes to global CSS
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}