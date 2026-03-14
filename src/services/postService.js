import supabase from './supabase';
import api from './api';

// For media uploads (images/videos)
export const uploadMedia = async (file, type = 'image') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `posts/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('post-media')
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('post-media')
      .getPublicUrl(filePath);
    
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading media:', error);
    return { success: false, error: error.message };
  }
};

// Create post (using your existing API)
export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message };
  }
};

// Real-time subscriptions
export const subscribeToPosts = (callback) => {
  return supabase
    .channel('public:posts')
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'posts' 
      },
      (payload) => {
        // Fetch full post data with user info
        fetchPostWithDetails(payload.new.id).then(callback);
      }
    )
    .subscribe();
};

export const subscribeToLikes = (postId, callback) => {
  return supabase
    .channel(`post-likes-${postId}`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'post_likes',
        filter: `post_id=eq.${postId}`
      },
      () => {
        // Refresh likes count
        fetchPostLikes(postId).then(callback);
      }
    )
    .subscribe();
};

export const subscribeToComments = (postId, callback) => {
  return supabase
    .channel(`post-comments-${postId}`)
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'post_comments',
        filter: `post_id=eq.${postId}`
      },
      (payload) => {
        // Fetch new comment with user info
        fetchCommentWithDetails(payload.new.id).then(callback);
      }
    )
    .subscribe();
};

// Helper functions
async function fetchPostWithDetails(postId) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user:profiles!user_id(
        id, full_name, avatar_url, role
      ),
      likes:post_likes(count),
      comments:post_comments(count)
    `)
    .eq('id', postId)
    .single();
    
  if (error) return null;
  return data;
}

async function fetchPostLikes(postId) {
  const { count, error } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);
    
  return { postId, count: count || 0 };
}

async function fetchCommentWithDetails(commentId) {
  const { data, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      user:profiles!user_id(
        id, full_name, avatar_url
      )
    `)
    .eq('id', commentId)
    .single();
    
  return data;
}

// Like/unlike post
export const toggleLike = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message };
  }
};

// Add comment
export const addComment = async (postId, content) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: error.message };
  }
};