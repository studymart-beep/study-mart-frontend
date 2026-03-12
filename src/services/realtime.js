import { createClient } from '@supabase/supabase-js';
import api from './api';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

class RealtimeService {
  constructor() {
    this.messageSubscriptions = new Map();
    this.presenceSubscriptions = new Map();
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  // Subscribe to messages with a specific user
  subscribeToMessages(userId, callback) {
    if (this.messageSubscriptions.has(userId)) {
      return;
    }

    const subscription = supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          callback({ type: 'UPDATE', data: payload.new });
        }
      )
      .subscribe();

    this.messageSubscriptions.set(userId, subscription);
  }

  // Unsubscribe from messages
  unsubscribeFromMessages(userId) {
    const subscription = this.messageSubscriptions.get(userId);
    if (subscription) {
      supabase.removeChannel(subscription);
      this.messageSubscriptions.delete(userId);
    }
  }

  // Subscribe to user presence (online/offline)
  subscribeToPresence(userIds, callback) {
    const channel = supabase.channel('presence', {
      config: {
        presence: {
          key: this.currentUser?.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        callback(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        callback({ type: 'join', userId: key, presences: newPresences });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        callback({ type: 'leave', userId: key });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: this.currentUser?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    this.presenceSubscriptions.set('presence', channel);
  }

  // Send a message
  async sendMessage(receiverId, content) {
    try {
      const response = await api.post('/messages/send', {
        receiver_id: receiverId,
        content,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  // Get conversation with a user
  async getConversation(userId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/messages/conversation/${userId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  }

  // Get all conversations
  async getConversations() {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  }

  // Clean up all subscriptions
  cleanup() {
    this.messageSubscriptions.forEach((subscription, userId) => {
      supabase.removeChannel(subscription);
    });
    this.messageSubscriptions.clear();

    const presenceChannel = this.presenceSubscriptions.get('presence');
    if (presenceChannel) {
      supabase.removeChannel(presenceChannel);
    }
    this.presenceSubscriptions.clear();
  }
}

export default new RealtimeService();