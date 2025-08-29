import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { communityAPI } from '../../api/community';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import styles from './Comments.module.css';

const Comments = () => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [selectedPost, setSelectedPost] = useState('');
  const [formData, setFormData] = useState({
    content: '',
    post_id: ''
  });
  const { loading, error, callApi } = useApi();

  const fetchComments = async () => {
    const result = await callApi(communityAPI.getComments);
    if (result) {
      setComments(result);
    }
  };

  const fetchPosts = async () => {
    const result = await callApi(communityAPI.getPosts);
    if (result) {
      setPosts(result);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiCall = editingComment
      ? () => communityAPI.updateComment(editingComment.id, formData)
      : () => communityAPI.createComment(formData);

    const result = await callApi(apiCall);
    if (result) {
      setShowForm(false);
      setEditingComment(null);
      setFormData({
        content: '',
        post_id: selectedPost
      });
      fetchComments();
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setFormData({
      content: comment.content,
      post_id: comment.post_id
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const result = await callApi(() => communityAPI.deleteComment(id));
      if (result) {
        fetchComments();
      }
    }
  };

  const handlePostSelect = (postId) => {
    setSelectedPost(postId);
    setFormData(prev => ({
      ...prev,
      post_id: postId
    }));
  };

  const getPostTitle = (postId) => {
    const post = posts.find(p => p.id === postId);
    return post ? post.title : 'Unknown Post';
  };

  const filteredComments = selectedPost 
    ? comments.filter(comment => comment.post_id === parseInt(selectedPost))
    : comments;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Community Comments</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Comment
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statInfo}>
            <h3>{comments.length}</h3>
            <p>Total Comments</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <h3>{new Set(comments.map(c => c.post_id)).size}</h3>
            <p>Posts with Comments</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <h3>{new Set(comments.map(c => c.user_id)).size}</h3>
            <p>Active Commenters</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <h3>{comments.length > 0 ? (comments.length / posts.length).toFixed(1) : 0}</h3>
            <p>Avg Comments per Post</p>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="postFilter">Filter by Post:</label>
          <select
            id="postFilter"
            value={selectedPost}
            onChange={(e) => handlePostSelect(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Posts</option>
            {posts.map(post => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingComment ? 'Edit Comment' : 'Add New Comment'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingComment(null);
                  setFormData({
                    content: '',
                    post_id: selectedPost
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              {!editingComment && (
                <div className={styles.formGroup}>
                  <label htmlFor="post_id">Post *</label>
                  <select
                    id="post_id"
                    name="post_id"
                    value={formData.post_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a post</option>
                    {posts.map(post => (
                      <option key={post.id} value={post.id}>
                        {post.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="content">Comment *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  placeholder="Write your comment here..."
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingComment ? 'Update Comment' : 'Add Comment'}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingComment(null);
                    setFormData({
                      content: '',
                      post_id: selectedPost
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

      <div className={styles.commentsContainer}>
        {loading ? (
          <div className={styles.loading}>Loading comments...</div>
        ) : filteredComments.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <h3>No comments yet</h3>
            <p>
              {selectedPost 
                ? "This post doesn't have any comments yet. Be the first to comment!"
                : "No comments found. Start a conversation by adding a comment!"
              }
            </p>
            <button 
              className={styles.createFirstButton}
              onClick={() => setShowForm(true)}
            >
              Add Your First Comment
            </button>
          </div>
        ) : (
          <div className={styles.commentsList}>
            {filteredComments.map(comment => (
              <div key={comment.id} className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentAuthor}>
                      {comment.user?.name || 'Unknown User'}
                    </span>
                    <span className={styles.commentDate}>
                      {getRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  {user?.id === comment.user_id && (
                    <div className={styles.commentActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(comment)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.commentContent}>
                  <p>{comment.content}</p>
                </div>

                <div className={styles.commentFooter}>
                  <span className={styles.postReference}>
                    On: <strong>{getPostTitle(comment.post_id)}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
