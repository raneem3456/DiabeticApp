import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { chatAPI } from '../../api/chat';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import styles from './Chats.module.css';

const Chats = () => {
  const { user } = useAuthStore();
  const [chats, setChats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChat, setEditingChat] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_group_chat: false,
    participants: []
  });
  const { loading, error, callApi } = useApi();

  const fetchChats = async () => {
    const result = await callApi(chatAPI.getChats);
    if (result) {
      setChats(result);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiCall = editingChat
      ? () => chatAPI.updateChat(editingChat.id, formData)
      : () => chatAPI.createChat(formData);

    const result = await callApi(apiCall);
    if (result) {
      setShowForm(false);
      setEditingChat(null);
      setFormData({
        title: '',
        description: '',
        is_group_chat: false,
        participants: []
      });
      fetchChats();
    }
  };

  const handleEdit = (chat) => {
    setEditingChat(chat);
    setFormData({
      title: chat.title || '',
      description: chat.description || '',
      is_group_chat: chat.is_group_chat || false,
      participants: chat.participants || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      const result = await callApi(() => chatAPI.deleteChat(id));
      if (result) {
        fetchChats();
      }
    }
  };

  const getChatTypeColor = (isGroupChat) => {
    return isGroupChat ? styles.groupChat : styles.privateChat;
  };

  const getLastMessagePreview = (chat) => {
    if (chat.last_message) {
      return chat.last_message.content.length > 50 
        ? `${chat.last_message.content.substring(0, 50)}...`
        : chat.last_message.content;
    }
    return 'No messages yet';
  };

  const getParticipantCount = (chat) => {
    return chat.participants?.length || 1;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Chat Conversations</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Start New Chat
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statInfo}>
            <h3>{chats.length}</h3>
            <p>Total Chats</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <h3>{chats.filter(c => c.is_group_chat).length}</h3>
            <p>Group Chats</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👤</div>
          <div className={styles.statInfo}>
            <h3>{chats.filter(c => !c.is_group_chat).length}</h3>
            <p>Private Chats</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📱</div>
          <div className={styles.statInfo}>
            <h3>{chats.filter(c => c.last_message).length}</h3>
            <p>Active Chats</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingChat ? 'Edit Chat' : 'Start New Chat'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingChat(null);
                  setFormData({
                    title: '',
                    description: '',
                    is_group_chat: false,
                    participants: []
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Chat Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter chat title"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter chat description (optional)"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_group_chat"
                    checked={formData.is_group_chat}
                    onChange={handleInputChange}
                  />
                  Group Chat (multiple participants)
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingChat ? 'Update Chat' : 'Create Chat'}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingChat(null);
                    setFormData({
                      title: '',
                      description: '',
                      is_group_chat: false,
                      participants: []
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.chatsContainer}>
        {loading ? (
          <div className={styles.loading}>Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <h3>No chats yet</h3>
            <p>Start a conversation by creating a new chat!</p>
            <button 
              className={styles.createFirstButton}
              onClick={() => setShowForm(true)}
            >
              Start Your First Chat
            </button>
          </div>
        ) : (
          <div className={styles.chatsList}>
            {chats.map(chat => (
              <div key={chat.id} className={styles.chatCard}>
                <div className={styles.chatHeader}>
                  <div className={styles.chatInfo}>
                    <h3 className={styles.chatTitle}>{chat.title}</h3>
                    <span className={`${styles.chatType} ${getChatTypeColor(chat.is_group_chat)}`}>
                      {chat.is_group_chat ? 'Group Chat' : 'Private Chat'}
                    </span>
                  </div>
                  <div className={styles.chatMeta}>
                    <span className={styles.participantCount}>
                      👥 {getParticipantCount(chat)} participants
                    </span>
                    {chat.last_message && (
                      <span className={styles.lastMessageTime}>
                        {getRelativeTime(chat.last_message.created_at)}
                      </span>
                    )}
                  </div>
                </div>

                {chat.description && (
                  <p className={styles.chatDescription}>{chat.description}</p>
                )}

                <div className={styles.lastMessage}>
                  <span className={styles.lastMessageLabel}>Last message:</span>
                  <span className={styles.lastMessageContent}>
                    {getLastMessagePreview(chat)}
                  </span>
                </div>

                <div className={styles.chatFooter}>
                  <div className={styles.chatStats}>
                    <span className={styles.messageCount}>
                      💬 {chat.messages_count || 0} messages
                    </span>
                    <span className={styles.createdDate}>
                      Created {formatDate(chat.created_at)}
                    </span>
                  </div>
                  
                  <div className={styles.chatActions}>
                    <button className={styles.viewButton}>
                      View Chat
                    </button>
                    {user?.id === chat.created_by && (
                      <>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(chat)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(chat.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
