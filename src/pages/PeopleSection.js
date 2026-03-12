import React, { useState, useEffect } from 'react';
import api from '../services/api';
import realtimeService from '../services/realtime';
import ChatWindow from '../components/ChatWindow';

export default function PeopleSection({ currentUser }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchPeople();
    fetchFriendRequests();
    setupRealtime();

    return () => {
      realtimeService.cleanup();
    };
  }, []);

  const setupRealtime = () => {
    realtimeService.setCurrentUser(currentUser);

    // Subscribe to presence (online/offline)
    realtimeService.subscribeToPresence([], (presence) => {
      if (presence.type === 'join') {
        setOnlineUsers(prev => new Set([...prev, presence.userId]));
      } else if (presence.type === 'leave') {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(presence.userId);
          return newSet;
        });
      } else {
        // Full presence sync
        const online = new Set();
        Object.keys(presence).forEach(key => {
          presence[key].forEach(p => online.add(p.user_id));
        });
        setOnlineUsers(online);
      }
    });
  };

  const fetchPeople = async () => {
    try {
      const response = await api.get('/users/people');
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

  const sendFriendRequest = async (userId) => {
    try {
      const response = await api.post('/friends/request', { receiver_id: userId });
      if (response.data.success) {
        alert('Friend request sent!');
        fetchPeople();
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
        alert('Friend request accepted!');
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
        alert('Friend request rejected');
        fetchFriendRequests();
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const startChat = (user) => {
    setSelectedUser(user);
    setShowChat(true);
  };

  const filteredPeople = people.filter(person =>
    person.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div style={styles.requestsSection}>
          <h3 style={styles.sectionTitle}>Friend Requests</h3>
          {friendRequests.map(request => (
            <div key={request.id} style={styles.requestCard}>
              <div style={styles.requestInfo}>
                <div style={styles.requestAvatar}>👤</div>
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
                  Accept
                </button>
                <button
                  onClick={() => rejectFriendRequest(request.id)}
                  style={styles.rejectButton}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                    ...(onlineUsers.has(person.id) ? styles.online : styles.offline)
                  }} />
                </div>
                <h4 style={styles.personName}>{person.full_name}</h4>
                <p style={styles.personRole}>{person.role || 'Student'}</p>
              </div>
              
              <div style={styles.personStats}>
                <span>📚 {person.courses_count || 0} courses</span>
                <span>👥 {person.friends_count || 0} friends</span>
              </div>

              <div style={styles.personActions}>
                {person.friend_status === 'pending' ? (
                  <span style={styles.pendingBadge}>Request Sent</span>
                ) : person.friend_status === 'accepted' ? (
                  <button
                    onClick={() => startChat(person)}
                    style={styles.messageButton}
                  >
                    💬 Message
                  </button>
                ) : (
                  <button
                    onClick={() => sendFriendRequest(person.id)}
                    style={styles.addFriendButton}
                  >
                    ➕ Add Friend
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      {showChat && selectedUser && (
        <ChatWindow
          user={selectedUser}
          onClose={() => setShowChat(false)}
          currentUser={currentUser}
        />
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
    backgroundColor: '#e2e8f0',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  requestName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  requestEmail: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0',
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

  // Search Section
  searchSection: {
    marginBottom: '25px',
  },
  searchInput: {
    width: '100%',
    padding: '14px 20px',
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
    borderRadius: '50%',
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
    borderRadius: '50%',
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
    margin: 0,
  },
  personStats: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '15px',
    fontSize: '12px',
    color: '#64748b',
  },
  personActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  addFriendButton: {
    padding: '8px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#4f46e5',
      transform: 'scale(1.05)',
    },
  },
  messageButton: {
    padding: '8px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#059669',
      transform: 'scale(1.05)',
    },
  },
  pendingBadge: {
    padding: '8px 20px',
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    borderRadius: '8px',
    fontSize: '14px',
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