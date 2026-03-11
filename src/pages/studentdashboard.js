import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import HomeSection from './HomeSection';
import LearningSection from './LearningSection';
import MarketplaceSection from './MarketplaceSection';
import CommunitySection from './CommunitySection';
import SellerApplicationModal from '../components/SellerApplicationModal';

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
    if (activeSection === 'community') {
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
        <Navbar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setShowProfile={setShowProfile}
          profileData={profileData}
          hoveredButton={hoveredButton}
          pressedButton={pressedButton}
          handleButtonMouseEnter={handleButtonMouseEnter}
          handleButtonMouseLeave={handleButtonMouseLeave}
          handleButtonMouseDown={handleButtonMouseDown}
          handleButtonMouseUp={handleButtonMouseUp}
        />

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
      <Navbar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setShowProfile={setShowProfile}
        profileData={profileData}
        hoveredButton={hoveredButton}
        pressedButton={pressedButton}
        handleButtonMouseEnter={handleButtonMouseEnter}
        handleButtonMouseLeave={handleButtonMouseLeave}
        handleButtonMouseDown={handleButtonMouseDown}
        handleButtonMouseUp={handleButtonMouseUp}
      />

      <div style={styles.container}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {activeSection === 'home' && (
              <HomeSection 
                user={user}
                courses={courses}
                handleCourseClick={handleCourseClick}
                hoveredButton={hoveredButton}
                handleButtonMouseEnter={handleButtonMouseEnter}
                handleButtonMouseLeave={handleButtonMouseLeave}
              />
            )}

            {activeSection === 'learning' && (
              <LearningSection 
                courses={courses}
                handleCourseClick={handleCourseClick}
                setActiveSection={setActiveSection}
                hoveredButton={hoveredButton}
                pressedButton={pressedButton}
                handleButtonMouseEnter={handleButtonMouseEnter}
                handleButtonMouseLeave={handleButtonMouseLeave}
                handleButtonMouseDown={handleButtonMouseDown}
                handleButtonMouseUp={handleButtonMouseUp}
              />
            )}

            {activeSection === 'marketplace' && (
              <MarketplaceSection 
                sellerApplicationStatus={sellerApplicationStatus}
                isSeller={isSeller}
                products={products}
                loadingProducts={loadingProducts}
                showSellerApplication={showSellerApplication}
                setShowSellerApplication={setShowSellerApplication}
                handleBuyProduct={handleBuyProduct}
                hoveredButton={hoveredButton}
                pressedButton={pressedButton}
                handleButtonMouseEnter={handleButtonMouseEnter}
                handleButtonMouseLeave={handleButtonMouseLeave}
                handleButtonMouseDown={handleButtonMouseDown}
                handleButtonMouseUp={handleButtonMouseUp}
              />
            )}

            {activeSection === 'community' && (
              <CommunitySection 
                communityTab={communityTab}
                setCommunityTab={setCommunityTab}
                feedPosts={feedPosts}
                loadingFeed={loadingFeed}
                feedError={feedError}
                newPostContent={newPostContent}
                setNewPostContent={setNewPostContent}
                newPostImage={newPostImage}
                setNewPostImage={setNewPostImage}
                posting={posting}
                handleCreatePost={handleCreatePost}
                handleLikePost={handleLikePost}
                groups={groups}
                loadingGroups={loadingGroups}
                messages={messages}
                loadingMessages={loadingMessages}
                topContributors={topContributors}
                events={events}
                handleJoinGroup={handleJoinGroup}
                handleLeaveGroup={handleLeaveGroup}
                handleCreateGroup={handleCreateGroup}
                handleAttendEvent={handleAttendEvent}
                handleViewProfile={handleViewProfile}
                hoveredButton={hoveredButton}
                pressedButton={pressedButton}
                handleButtonMouseEnter={handleButtonMouseEnter}
                handleButtonMouseLeave={handleButtonMouseLeave}
                handleButtonMouseDown={handleButtonMouseDown}
                handleButtonMouseUp={handleButtonMouseUp}
              />
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
  container: {
    maxWidth: '1400px',
    margin: '30px auto',
    padding: '0 20px',
  },
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
  courseHeader: {
    marginBottom: '30px',
  },
  courseTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '10px',
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
  contentArea: {
    minHeight: '400px',
  },
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
  messageButton: {
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
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
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}