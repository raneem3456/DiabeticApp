import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { communityAPI } from '../../api/community';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import styles from './Posts.module.css';

const Posts = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    is_public: true
  });
  const { loading, error, callApi } = useApi();

  const fetchPosts = async () => {
    const result = await callApi(communityAPI.getPosts);
    if (result) {
      setPosts(result);
    }
  };

  useEffect(() => {
    fetchPosts();
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
    const apiCall = editingPost
      ? () => communityAPI.updatePost(editingPost.id, formData)
      : () => communityAPI.createPost(formData);

    const result = await callApi(apiCall);
    if (result) {
      setShowForm(false);
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        image_url: '',
        is_public: true
      });
      fetchPosts();
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image_url: post.image_url || '',
      is_public: post.is_public
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await callApi(() => communityAPI.deletePost(id));
      if (result) {
        fetchPosts();
      }
    }
  };

  const getPrivacyColor = (isPublic) => {
    return isPublic ? styles.public : styles.private;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Community Posts</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Create New Post
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <h3>{posts.length}</h3>
            <p>Total Posts</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🌍</div>
          <div className={styles.statInfo}>
            <h3>{posts.filter(p => p.is_public).length}</h3>
            <p>Public Posts</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔒</div>
          <div className={styles.statInfo}>
            <h3>{posts.filter(p => !p.is_public).length}</h3>
            <p>Private Posts</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📸</div>
          <div className={styles.statInfo}>
            <h3>{posts.filter(p => p.image_url).length}</h3>
            <p>Posts with Images</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                  setFormData({
                    title: '',
                    content: '',
                    image_url: '',
                    is_public: true
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="content">Content *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="6"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image_url">Image URL</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                  />
                  Public Post (visible to everyone)
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    setFormData({
                      title: '',
                      content: '',
                      image_url: '',
                      is_public: true
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

      <div className={styles.postsGrid}>
        {loading ? (
          <div className={styles.loading}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
            <button 
              className={styles.createFirstButton}
              onClick={() => setShowForm(true)}
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className={styles.postCard}>
              {post.image_url && (
                <div className={styles.postImage}>
                  <img src={post.image_url} alt={post.title} />
                </div>
              )}
              
              <div className={styles.postContent}>
                <div className={styles.postHeader}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <span className={`${styles.privacyBadge} ${getPrivacyColor(post.is_public)}`}>
                    {post.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
                
                <p className={styles.postText}>{post.content}</p>
                
                <div className={styles.postMeta}>
                  <span className={styles.postAuthor}>
                    By {post.user?.name || 'Unknown User'}
                  </span>
                  <span className={styles.postDate}>
                    {getRelativeTime(post.created_at)}
                  </span>
                </div>

                <div className={styles.postStats}>
                  <span className={styles.stat}>
                    💬 {post.comments_count || 0} comments
                  </span>
                  <span className={styles.stat}>
                    ❤️ {post.likes_count || 0} likes
                  </span>
                </div>

                {user?.id === post.user_id && (
                  <div className={styles.postActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
