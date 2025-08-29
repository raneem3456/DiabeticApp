import apiClient from './config.js';

export const communityAPI = {
  // Posts
  getPosts: async () => {
    const response = await apiClient.get('/community/posts');
    return response.data;
  },

  createPost: async (data) => {
    const response = await apiClient.post('/community/posts', data);
    return response.data;
  },

  getPost: async (id) => {
    const response = await apiClient.get(`/community/posts/${id}`);
    return response.data;
  },

  updatePost: async (id, data) => {
    const response = await apiClient.put(`/community/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await apiClient.delete(`/community/posts/${id}`);
    return response.data;
  },

  // Comments
  getComments: async () => {
    const response = await apiClient.get('/community/comments');
    return response.data;
  },

  createComment: async (data) => {
    const response = await apiClient.post('/community/comments', data);
    return response.data;
  },

  getPostComments: async (postId) => {
    const response = await apiClient.get(`/community/posts/${postId}/comments`);
    return response.data;
  },

  // Likes
  getLikes: async () => {
    const response = await apiClient.get('/community/likes');
    return response.data;
  },

  createLike: async (data) => {
    const response = await apiClient.post('/community/likes', data);
    return response.data;
  },

  getPostLikes: async (postId) => {
    const response = await apiClient.get(`/community/posts/${postId}/likes`);
    return response.data;
  },
};
