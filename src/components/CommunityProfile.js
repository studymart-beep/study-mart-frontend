import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function CommunityProfile({ userId, onClose, currentUser, onStartChat }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [friendStatus, setFriendStatus] = useState('none');
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    location: '',
    website: '',
    interests: [],
    skills: [],
    github: '',
    twitter: '',
    linkedin: '',
    available_for: [],
    show_email: true
  });

  useEffect(() => {
    fetchProfile();
    if (currentUser?.id !== userId) {
      checkFriendStatus();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/community-profiles/profile/${userId}`);
      if (response.data.success) {
        setProfile(response.data.profile);
        setFormData({
          display_name: response.data.profile.display_name || '',
          bio: response.data.profile.bio || '',
          location: response.data.profile.location || '',
          website: response.data.profile.website || '',
          interests: response.data.profile.interests || [],
          skills: response.data.profile.skills || [],
          github: response.data.profile.github || '',
          twitter: response.data.profile.twitter || '',
          linkedin: response.data.profile.linkedin || '',
          available_for: response.data.profile.available_for || [],
          show_email: response.data.profile.show_email !== false
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFriendStatus = async () => {
    try {
      const response = await api.get(`/friends/status/${userId}`);
      if (response.data.success) {
        setFriendStatus(response.data.status);
      }
    } catch (error) {
      console.error('Error checking friend status:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInput = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.post('/community-profiles/profile', formData);
      if (response.data.success) {
        setProfile(response.data.profile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSendMessage = () => {
    onClose();
    if (onStartChat) {
      onStartChat(profile?.user || { id: userId, full_name: profile?.display_name });
    }
  };

  const handleAddFriend = async () => {
    try {
      await api.post('/friends/request', { receiver_id: userId });
      setFriendStatus('pending');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
          <div style={styles.loader}></div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.avatarLarge}>
              {profile?.user?.avatar_url ? (
                <img src={profile.user.avatar_url} alt={profile.display_name} style={styles.avatarImage} />
              ) : (
                <span style={styles.avatarPlaceholder}>👤</span>
              )}
              <span style={{
                ...styles.statusDot,
                ...(profile?.user?.status === 'online' ? styles.online : styles.offline)
              }} />
            </div>
            <div style={styles.headerInfo}>
              <h2 style={styles.displayName}>{profile?.display_name || profile?.user?.full_name}</h2>
              <p style={styles.username}>@{profile?.user?.email?.split('@')[0]}</p>
              {profile?.location && <p style={styles.location}>📍 {profile.location}</p>}
            </div>
          </div>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        {/* Content */}
        {!isEditing ? (
          /* View Mode */
          <div style={styles.content}>
            {/* Bio */}
            {profile?.bio && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>About</h3>
                <p style={styles.bio}>{profile.bio}</p>
              </div>
            )}

            {/* Interests & Skills */}
            <div style={styles.twoColumn}>
              {profile?.interests?.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Interests</h3>
                  <div style={styles.tags}>
                    {profile.interests.map((interest, i) => (
                      <span key={i} style={styles.tag}>{interest}</span>
                    ))}
                  </div>
                </div>
              )}

              {profile?.skills?.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Skills</h3>
                  <div style={styles.tags}>
                    {profile.skills.map((skill, i) => (
                      <span key={i} style={styles.skillTag}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(profile?.github || profile?.twitter || profile?.linkedin || profile?.website) && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Connect</h3>
                <div style={styles.socialLinks}>
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                      <span style={styles.socialIcon}>🐙</span> GitHub
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={profile.twitter} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                      <span style={styles.socialIcon}>🐦</span> Twitter
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                      <span style={styles.socialIcon}>🔗</span> LinkedIn
                    </a>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                      <span style={styles.socialIcon}>🌐</span> Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Available For */}
            {profile?.available_for?.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Available For</h3>
                <div style={styles.availableTags}>
                  {profile.available_for.map((item, i) => (
                    <span key={i} style={styles.availableTag}>{item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={styles.actions}>
              {isOwnProfile ? (
                <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleSendMessage} style={styles.messageButton}>
                    💬 Send Message
                  </button>
                  {friendStatus === 'none' && (
                    <button onClick={handleAddFriend} style={styles.friendButton}>
                      ➕ Add Friend
                    </button>
                  )}
                  {friendStatus === 'pending' && (
                    <button disabled style={styles.pendingButton}>
                      ⏳ Request Sent
                    </button>
                  )}
                  {friendStatus === 'friends' && (
                    <button disabled style={styles.friendsButton}>
                      ✅ Friends
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Stats */}
            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{profile?.friends_count || 0}</span>
                <span style={styles.statLabel}>Friends</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{profile?.posts_count || 0}</span>
                <span style={styles.statLabel}>Posts</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{profile?.followers_count || 0}</span>
                <span style={styles.statLabel}>Followers</span>
              </div>
            </div>

            {/* Email (if allowed) */}
            {profile?.show_email && profile?.user?.email && (
              <div style={styles.emailSection}>
                <span style={styles.emailIcon}>📧</span>
                <a href={`mailto:${profile.user.email}`} style={styles.emailLink}>
                  {profile.user.email}
                </a>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode */
          <div style={styles.content}>
            <h3 style={styles.sectionTitle}>Edit Your Profile</h3>
            
            <div style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Display Name</label>
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  placeholder="How you want to be called"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell others about yourself..."
                  rows="4"
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Interests (comma separated)</label>
                <input
                  type="text"
                  value={formData.interests.join(', ')}
                  onChange={(e) => handleArrayInput(e, 'interests')}
                  placeholder="React, Music, Photography"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleArrayInput(e, 'skills')}
                  placeholder="JavaScript, Design, Writing"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/username"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Available For (comma separated)</label>
                <input
                  type="text"
                  value={formData.available_for.join(', ')}
                  onChange={(e) => handleArrayInput(e, 'available_for')}
                  placeholder="Freelance, Mentoring, Collaboration"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="show_email"
                    checked={formData.show_email}
                    onChange={handleInputChange}
                  />
                  Show email on profile
                </label>
              </div>

              <div style={styles.formActions}>
                <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} style={styles.saveButton}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
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
    backdropFilter: 'blur(5px)',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    animation: 'slideUp 0.3s ease',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  avatarLarge: {
    position: 'relative',
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
    border: '3px solid #ffffff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    fontSize: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  statusDot: {
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    width: '16px',
    height: '16px',
    borderRadius: '8px',
    border: '2px solid #ffffff',
  },
  online: {
    backgroundColor: '#10b981',
  },
  offline: {
    backgroundColor: '#94a3b8',
  },
  headerInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 5px 0',
    color: 'white',
  },
  username: {
    fontSize: '14px',
    margin: '0 0 5px 0',
    opacity: 0.9,
  },
  location: {
    fontSize: '14px',
    margin: 0,
    opacity: 0.9,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: 'white',
    padding: '0 5px',
    ':hover': {
      opacity: 0.8,
    },
  },
  content: {
    padding: '25px',
  },
  section: {
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 10px 0',
    paddingBottom: '5px',
    borderBottom: '2px solid #e2e8f0',
  },
  bio: {
    fontSize: '15px',
    color: '#334155',
    lineHeight: '1.6',
    margin: 0,
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '25px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    padding: '4px 12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '16px',
    fontSize: '13px',
    color: '#334155',
  },
  skillTag: {
    padding: '4px 12px',
    backgroundColor: '#e0f2fe',
    borderRadius: '16px',
    fontSize: '13px',
    color: '#0369a1',
  },
  socialLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
  },
  socialLink: {
    padding: '8px 15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#334155',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: '#f1f5f9',
    },
  },
  socialIcon: {
    fontSize: '18px',
  },
  availableTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  availableTag: {
    padding: '4px 12px',
    backgroundColor: '#fef3c7',
    borderRadius: '16px',
    fontSize: '13px',
    color: '#92400e',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
  },
  messageButton: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
    },
  },
  friendButton: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
    },
  },
  editButton: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
    },
  },
  pendingButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#94a3b8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  friendsButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'default',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
    marginBottom: '20px',
  },
  stat: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
  },
  emailSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  emailIcon: {
    fontSize: '18px',
  },
  emailLink: {
    color: '#6366f1',
    textDecoration: 'none',
    fontSize: '14px',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
  },
  input: {
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    ':focus': {
      outline: 'none',
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
    },
  },
  textarea: {
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    ':focus': {
      outline: 'none',
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
    },
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1e293b',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#cbd5e1',
    },
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#4f46e5',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
    },
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '40px auto',
  },
};

// Global animations
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}