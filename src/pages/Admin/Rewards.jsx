import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { adminAPI } from '../../api/admin';
import { formatDate } from '../../utils/helpers';
import styles from './Rewards.module.css';

const Rewards = () => {
  const { user } = useAuthStore();
  const [rewards, setRewards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points_required: '',
    reward_type: '',
    value: '',
    is_active: true,
    image_url: '',
    expiry_date: ''
  });
  const { loading, error, callApi } = useApi();

  const fetchRewards = async () => {
    const result = await callApi(adminAPI.getRewards);
    if (result) {
      setRewards(result);
    }
  };

  useEffect(() => {
    fetchRewards();
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
    const apiCall = editingReward 
      ? () => adminAPI.updateReward(editingReward.id, formData)
      : () => adminAPI.createReward(formData);
    
    const result = await callApi(apiCall);
    if (result) {
      setShowForm(false);
      setEditingReward(null);
      setFormData({
        name: '',
        description: '',
        points_required: '',
        reward_type: '',
        value: '',
        is_active: true,
        image_url: '',
        expiry_date: ''
      });
      fetchRewards();
    }
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description,
      points_required: reward.points_required,
      reward_type: reward.reward_type,
      value: reward.value,
      is_active: reward.is_active,
      image_url: reward.image_url,
      expiry_date: reward.expiry_date
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      const result = await callApi(() => adminAPI.deleteReward(id));
      if (result) {
        fetchRewards();
      }
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? styles.active : styles.inactive;
  };

  const getRewardTypeColor = (type) => {
    const colors = {
      'discount': styles.typeDiscount,
      'free_item': styles.typeFreeItem,
      'cashback': styles.typeCashback,
      'gift_card': styles.typeGiftCard,
      'badge': styles.typeBadge,
      'other': styles.typeOther
    };
    return colors[type] || styles.typeOther;
  };

  if (user?.role !== 'admin') {
    return (
      <div className={styles.accessDenied}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Rewards Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Reward
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎁</div>
          <div className={styles.statInfo}>
            <h3>{rewards.length}</h3>
            <p>Total Rewards</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <h3>{rewards.filter(r => r.is_active).length}</h3>
            <p>Active Rewards</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statInfo}>
            <h3>{rewards.filter(r => r.reward_type === 'discount').length}</h3>
            <p>Discount Rewards</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statInfo}>
            <h3>{rewards.reduce((sum, r) => sum + (r.points_required || 0), 0)}</h3>
            <p>Total Points Required</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingReward ? 'Edit Reward' : 'Add New Reward'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingReward(null);
                  setFormData({
                    name: '',
                    description: '',
                    points_required: '',
                    reward_type: '',
                    value: '',
                    is_active: true,
                    image_url: '',
                    expiry_date: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Reward Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
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
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="reward_type">Reward Type</label>
                  <select
                    id="reward_type"
                    name="reward_type"
                    value={formData.reward_type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Type</option>
                    <option value="discount">Discount</option>
                    <option value="free_item">Free Item</option>
                    <option value="cashback">Cashback</option>
                    <option value="gift_card">Gift Card</option>
                    <option value="badge">Badge</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="points_required">Points Required</label>
                  <input
                    type="number"
                    id="points_required"
                    name="points_required"
                    value={formData.points_required}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="value">Value</label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder="e.g., 20%, $50, Free Shipping"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="expiry_date">Expiry Date</label>
                  <input
                    type="date"
                    id="expiry_date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleInputChange}
                  />
                </div>
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
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Active Reward
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingReward ? 'Update Reward' : 'Create Reward'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingReward(null);
                    setFormData({
                      name: '',
                      description: '',
                      points_required: '',
                      reward_type: '',
                      value: '',
                      is_active: true,
                      image_url: '',
                      expiry_date: ''
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

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading rewards...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reward</th>
                <th>Type</th>
                <th>Points Required</th>
                <th>Value</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map(reward => (
                <tr key={reward.id}>
                  <td>
                    <div className={styles.rewardInfo}>
                      {reward.image_url && (
                        <img 
                          src={reward.image_url} 
                          alt={reward.name}
                          className={styles.rewardImage}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className={styles.rewardDetails}>
                        <strong>{reward.name}</strong>
                        <div className={styles.rewardDescription}>
                          {reward.description || 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.typeBadge} ${getRewardTypeColor(reward.reward_type)}`}>
                      {reward.reward_type?.replace('_', ' ') || 'other'}
                    </span>
                  </td>
                  <td>
                    <span className={styles.pointsRequired}>
                      {reward.points_required || 0} pts
                    </span>
                  </td>
                  <td>
                    <span className={styles.rewardValue}>
                      {reward.value || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusColor(reward.is_active)}`}>
                      {reward.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.expiryDate}>
                      {reward.expiry_date ? formatDate(reward.expiry_date) : 'No expiry'}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(reward)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(reward.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Rewards;
