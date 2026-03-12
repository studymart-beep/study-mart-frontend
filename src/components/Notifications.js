import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Notifications({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/admin/notifications');
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/admin/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/admin/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'seller_approved':
        return '🎉';
      case 'seller_rejected':
        return '❌';
      case 'new_message':
        return '💬';
      case 'new_order':
        return '🛒';
      default:
        return '📢';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h3 style={styles.title}>Notifications</h3>
          {unreadCount > 0 && (
            <span style={styles.badge}>{unreadCount}</span>
          )}
        </div>
        <div style={styles.headerRight}>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} style={styles.markAllButton}>
              Mark all as read
            </button>
          )}
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>
      </div>

      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🔔</span>
            <p>No notifications yet</p>
          </div>
        ) : (
          <div style={styles.notificationList}>
            {notifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  ...styles.notificationItem,
                  ...(notification.read ? styles.read : styles.unread)
                }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div style={styles.notificationIcon}>
                  {getIcon(notification.type)}
                </div>
                <div style={styles.notificationContent}>
                  <h4 style={styles.notificationTitle}>{notification.title}</h4>
                  <p style={styles.notificationMessage}>{notification.message}</p>
                  <span style={styles.notificationTime}>
                    {formatTime(notification.created_at)}
                  </span>
                </div>
                {!notification.read && <div style={styles.unreadDot} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '70px',
    right: '20px',
    width: '400px',
    maxHeight: '500px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    zIndex: 1000,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  badge: {
    backgroundColor: '#dc2626',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  markAllButton: {
    padding: '6px 12px',
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#cbd5e1',
    },
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#64748b',
    padding: '0 5px',
    ':hover': {
      color: '#dc2626',
    },
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '450px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    color: '#64748b',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  notificationList: {
    display: 'flex',
    flexDirection: 'column',
  },
  notificationItem: {
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    position: 'relative',
    ':hover': {
      backgroundColor: '#f8fafc',
    },
  },
  unread: {
    backgroundColor: '#eff6ff',
  },
  read: {
    backgroundColor: 'white',
    opacity: 0.8,
  },
  notificationIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#e2e8f0',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },
  notificationMessage: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '6px',
    lineHeight: '1.4',
  },
  notificationTime: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
};

// Add animation
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