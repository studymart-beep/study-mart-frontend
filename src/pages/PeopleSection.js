import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function PeopleSection({ currentUser, onStartChat }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'friends', 'requests'

  useEffect(() => {
    fetchPeople();
    fetchFriendRequests();
    fetchSentRequests();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPeople();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const response = await api.get('/friends/people', {
        params: { search: searchTerm }
      });
      if (response.data.success) {
        setPeople(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await api.get('/friends/requests');
      if (response.data.success) {
        setFriendRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await api.get('/friends/sent');
      if (response.data.success) {
        setSentRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const response = await api.post('/friends/request', { receiver_id: userId });
      if (response.data.success) {
        fetchPeople();
        fetchSentRequests();
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const response = await api.put(`/friends/request/${requestId}/accept`);
      if (response.data.success) {
        fetchFriendRequests();
        fetchPeople();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      const response = await api.put(`/friends/request/${requestId}/reject`);
      if (response.data.success) {
        fetchFriendRequests();
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const getFilteredPeople = () => {
    if (activeTab === 'friends') {
      return people.filter(p => p.friend_status === 'friends');
    }
    return people;
  };

  const filteredPeople = getFilteredPeople();

  return (
    <div style={styles.container}>
      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div style={styles.requestsSection}>
          <h3 style={styles.sectionTitle}>Friend Requests ({friendRequests.length})</h3>
          {friendRequests.map(request => (
            <div key={request.id} style={styles.requestCard}>
              <div style={styles.requestInfo}>
                <div style={styles.requestAvatar}>
                  {request.sender?.avatar_url ? (
                    <img src={request.sender.avatar_url} alt={request.sender.full_name} style={styles.avatarImage} />
                  ) : (
                    <span style={styles.avatarPlaceholder}>👤</span>
                  )}
                </div>
                <div>
                  <h4 style={styles.requestName}>{request.sender?.full_name}</h4>
                  <p style={styles.requestEmail}>{request.sender?.email}</p>
                </div>
              </div>
              <div style={styles.requestActions}>
                <button
                  onClick={() => acceptFriendRequest(request.id)}
                  style={styles.acceptButton}
                >
                  ✓ Accept
                </button>
                <button
                  onClick={() => rejectFriendRequest(request.id)}
                  style={styles.rejectButton}
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'all' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('all')}
        >
          All People ({people.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'friends' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('friends')}
        >
          Friends ({people.filter(p => p.friend_status === 'friends').length})
        </button>
        {sentRequests.length > 0 && (
          <span style={styles.sentBadge}>
            {sentRequests.length} pending
          </span>
        )}
      </div>

      {/* Search Bar */}
      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="Search people by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* People Grid */}
      <div style={styles.peopleGrid}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <p>Loading people...</p>
          </div>
        ) : filteredPeople.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No people found</p>
          </div>
        ) : (
          filteredPeople.map(person => (
            <div key={person.id} style={styles.personCard}>
              <div style={styles.personHeader}>
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>
                    {person.avatar_url ? (
                      <img src={person.avatar_url} alt={person.full_name} style={styles.avatarImage} />
                    ) : (
                      <span style={styles.avatarPlaceholder}>👤</span>
                    )}
                  </div>
                  <span style={{
                    ...styles.statusDot,
                    ...(person.online ? styles.online : styles.offline)
                  }} />
                </div>
                <h4 style={styles.personName}>{person.full_name}</h4>
                <p style={styles.personRole}>{person.role || 'Student'}</p>
                {person.friend_status === 'friends' && (
                  <span style={styles.friendsBadge}>✓ Friends</span>
                )}
              </div>
              
              <div style={styles.personActions}>
                <button
                  onClick={() => onStartChat(person)}
                  style={styles.messageButton}
                >
                  💬 Message
                </button>
                
                {person.friend_status === 'none' && (
                  <button
                    onClick={() => sendFriendRequest(person.id)}
                    style={styles.addButton}
                  >
                    ➕ Add Friend
                  </button>
                )}
                
                {person.friend_status === 'pending' && (
                  <span style={styles.pendingBadge}>⏳ Request Sent</span>
                )}
                
                {person.friend_status === 'friends' && (
                  <span style={styles.friendsBadge}>✓ Friend</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sent Requests Section */}
      {sentRequests.length > 0 && (
        <div style={styles.sentSection}>
          <h3 style={styles.sectionTitle}>Sent Requests</h3>
          {sentRequests.map(request => (
            <div key={request.id} style={styles.sentCard}>
              <div style={styles.sentInfo}>
                <div style={styles.sentAvatar}>👤</div>
                <div>
                  <h4 style={styles.sentName}>{request.receiver?.full_name}</h4>
                  <p style={styles.sentEmail}>{request.receiver?.email}</p>
                </div>
              </div>
              <span style={styles.pendingBadge}>Pending</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },

  // Friend Requests Section
  requestsSection: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '15px',
  },
  requestCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '10px',
  },
  requestInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  requestAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  requestName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  requestEmail: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  requestActions: {
    display: 'flex',
    gap: '8px',
  },
  acceptButton: {
    padding: '6px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#059669',
    },
  },
  rejectButton: {
    padding: '6px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#dc2626',
    },
  },

  // Tabs
  tabBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    position: 'relative',
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '15px',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#6366f1',
    borderBottomColor: '#6366f1',
  },
  sentBadge: {
    position: 'absolute',
    right: 0,
    padding: '4px 12px',
    backgroundColor: '#f59e0b',
    color: 'white',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },

  // Search Section
  searchSection: {
    marginBottom: '25px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '15px',
    transition: 'all 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
    },
  },

  // People Grid
  peopleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  personCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    },
  },
  personHeader: {
    textAlign: 'center',
    marginBottom: '15px',
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    width: '80px',
    height: '80px',
    margin: '0 auto 10px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '40px',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '3px solid #fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    fontSize: '40px',
  },
  statusDot: {
    position: 'absolute',
    bottom: '5px',
    right: '15px',
    width: '14px',
    height: '14px',
    borderRadius: '7px',
    border: '2px solid #ffffff',
  },
  online: {
    backgroundColor: '#10b981',
  },
  offline: {
    backgroundColor: '#94a3b8',
  },
  personName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  personRole: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 8px 0',
  },
  friendsBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  personActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  messageButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#4f46e5',
    },
  },
  addButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#059669',
    },
  },
  pendingBadge: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    borderRadius: '8px',
    fontSize: '13px',
    textAlign: 'center',
  },

  // Sent Requests Section
  sentSection: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    marginTop: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  sentCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '10px',
  },
  sentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sentAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  sentName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  sentEmail: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },

  // Loading States
  loadingContainer: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  emptyState: {
    gridColumn: '1 / -1',
    padding: '60px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '16px',
  },
};

// Global animations
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}