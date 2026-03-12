import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import realtimeService from '../services/realtime';

export default function ChatWindow({ user, onClose, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();

    return () => {
      realtimeService.unsubscribeFromMessages(user.id);
    };
  }, [user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await realtimeService.getConversation(user.id);
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    realtimeService.subscribeToMessages(currentUser.id, (newMsg) => {
      if (newMsg.sender_id === user.id || newMsg.receiver_id === user.id) {
        setMessages(prev => [...prev, newMsg]);
        if (newMsg.sender_id === user.id) {
          realtimeService.markAsRead(newMsg.id);
        }
      }
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await realtimeService.sendMessage(user.id, newMessage);
      if (response.success) {
        setMessages(prev => [...prev, response.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Chat Header */}
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} style={styles.avatarImage} />
              ) : (
                <span style={styles.avatarPlaceholder}>👤</span>
              )}
            </div>
            <div>
              <h3 style={styles.userName}>{user.full_name}</h3>
              <span style={styles.userStatus}>Online</span>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        {/* Messages Area */}
        <div style={styles.messagesArea} ref={chatContainerRef}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loader}></div>
            </div>
          ) : messages.length === 0 ? (
            <div style={styles.emptyMessages}>
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id || index}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: msg.sender_id === currentUser.id ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    ...styles.message,
                    ...(msg.sender_id === currentUser.id ? styles.sentMessage : styles.receivedMessage),
                  }}
                >
                  <p style={styles.messageText}>{msg.content}</p>
                  <span style={styles.messageTime}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.read && msg.sender_id === currentUser.id && (
                      <span style={styles.readReceipt}> ✓✓</span>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={styles.inputArea}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={styles.input}
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            style={{
              ...styles.sendButton,
              ...(sending || !newMessage.trim() ? styles.sendButtonDisabled : {}),
            }}
          >
            {sending ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '380px',
    height: '500px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    zIndex: 1000,
    overflow: 'hidden',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    padding: '15px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    fontSize: '20px',
  },
  userName: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
  },
  userStatus: {
    fontSize: '12px',
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
  messagesArea: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f8fafc',
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '15px',
  },
  message: {
    maxWidth: '70%',
    padding: '10px 15px',
    borderRadius: '16px',
    position: 'relative',
  },
  sentMessage: {
    backgroundColor: '#6366f1',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  receivedMessage: {
    backgroundColor: '#ffffff',
    color: '#1e293b',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  messageText: {
    fontSize: '14px',
    margin: '0 0 4px 0',
    lineHeight: '1.4',
    wordWrap: 'break-word',
  },
  messageTime: {
    fontSize: '10px',
    opacity: 0.7,
    display: 'block',
    textAlign: 'right',
  },
  readReceipt: {
    marginLeft: '4px',
  },
  inputArea: {
    padding: '15px',
    backgroundColor: 'white',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'none',
    ':focus': {
      outline: 'none',
      borderColor: '#6366f1',
    },
  },
  sendButton: {
    width: '40px',
    height: '40px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#4f46e5',
      transform: 'scale(1.05)',
    },
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#6366f1',
      transform: 'none',
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loader: {
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    animation: 'spin 1s linear infinite',
  },
  emptyMessages: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#94a3b8',
    textAlign: 'center',
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