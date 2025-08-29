import apiClient from './config.js';

export const chatAPI = {
  // Chats
  getChats: async () => {
    const response = await apiClient.get('/chat/chats');
    return response.data;
  },

  createChat: async (data) => {
    const response = await apiClient.post('/chat/chats', data);
    return response.data;
  },

  getChat: async (id) => {
    const response = await apiClient.get(`/chat/chats/${id}`);
    return response.data;
  },

  updateChat: async (id, data) => {
    const response = await apiClient.put(`/chat/chats/${id}`, data);
    return response.data;
  },

  deleteChat: async (id) => {
    const response = await apiClient.delete(`/chat/chats/${id}`);
    return response.data;
  },

  // Messages
  getMessages: async () => {
    const response = await apiClient.get('/chat/messages');
    return response.data;
  },

  createMessage: async (data) => {
    const response = await apiClient.post('/chat/messages', data);
    return response.data;
  },

  getChatMessages: async (chatId) => {
    const response = await apiClient.get(`/chat/chats/${chatId}/messages`);
    return response.data;
  },

  getMessage: async (id) => {
    const response = await apiClient.get(`/chat/messages/${id}`);
    return response.data;
  },

  updateMessage: async (id, data) => {
    const response = await apiClient.put(`/chat/messages/${id}`, data);
    return response.data;
  },

  deleteMessage: async (id) => {
    const response = await apiClient.delete(`/chat/messages/${id}`);
    return response.data;
  },
};
