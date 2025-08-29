import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { adminAPI } from '../../api/admin';
import { formatDate } from '../../utils/helpers';
import styles from './UserPoints.module.css';

const UserPoints = () => {
  const { user } = useAuthStore();
  const [userPoints, setUserPoints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPoints, setEditingPoints] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    points: '',
    reason: '',
    points_type: 'earned',
    is_active: true
  });
  const { loading, error, callApi } = useApi();

  const fetchUserPoints = async () => {
    const result = await callApi(adminAPI.getUserPoints);
    if (result) {
      setUserPoints(result);
    }
  };

  useEffect(() => {
    fetchUserPoints();
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
    const apiCall = editingPoints 
      ? () => adminAPI.updateUserPoints(editingPoints.id, formData)
      : () => adminAPI.createUserPoints(formData);
    
    const result = await callApi(apiCall);
    if (result) {
      setShowForm(false);
      setEditingPoints(null);
      setFormData({
        user_id: '',
        points: '',
        reason: '',
        points_type: 'earned',
        is_active: true
      });
      fetchUserPoints();
    }
  };

  const handleEdit = (points) => {
    setEditingPoints(points);
    setFormData({
      user_id: points.user_id,
      points: points.points,
      reason: points.reason,
      points_type: points.points_type,
      is_active: points.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user points record?')) {
      const result = await callApi(() => adminAPI.deleteUserPoints(id));
      if (result) {
        fetchUserPoints();
      }
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? styles.active : styles.inactive;
  };

  const getPointsTypeColor = (type) => {
    const colors = {
      'earned': styles.typeEarned,
      'spent': styles.typeSpent,
      'bonus': styles.typeBonus,
      'penalty': styles.typePenalty
    };
    return colors[type] || styles.typeEarned;
  };

  const getPointsDisplay = (points, type) => {
    const sign = type === 'spent' || type === 'penalty' ? '-' : '+';
    return `${sign}${points}`;
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
        <h1>User Points Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add User Points
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <h3>{userPoints.length}</h3>
            <p>Total Records</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <h3>{userPoints.filter(p => p.is_active).length}</h3>
            <p>Active Records</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>➕</div>
          <div className={styles.statInfo}>
            <h3>{userPoints.filter(p => p.points_type === 'earned').reduce((sum, p) => sum + (p.points || 0), 0)}</h3>
            <p>Total Earned</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>➖</div>
          <div className={styles.statInfo}>
            <h3>{userPoints.filter(p => p.points_type === 'spent').reduce((sum, p) => sum + (p.points || 0), 0)}</h3>
            <p>Total Spent</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingPoints ? 'Edit User Points' : 'Add User Points'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingPoints(null);
                  setFormData({
                    user_id: '',
                    points: '',
                    reason: '',
                    points_type: 'earned',
                    is_active: true
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="user_id">User ID *</label>
                  <input
                    type="number"
                    id="user_id"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="points">Points *</label>
                  <input
                    type="number"
                    id="points"
                    name="points"
                    value={formData.points}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="points_type">Points Type</label>
                  <select
                    id="points_type"
                    name="points_type"
                    value={formData.points_type}
                    onChange={handleInputChange}
                  >
                    <option value="earned">Earned</option>
                    <option value="spent">Spent</option>
                    <option value="bonus">Bonus</option>
                    <option value="penalty">Penalty</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reason">Reason</label>
                  <input
                    type="text"
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Survey completion, Challenge reward"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Active Record
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingPoints ? 'Update Points' : 'Add Points'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingPoints(null);
                    setFormData({
                      user_id: '',
                      points: '',
                      reason: '',
                      points_type: 'earned',
                      is_active: true
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
          <div className={styles.loading}>Loading user points...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Points</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userPoints.map(points => (
                <tr key={points.id}>
                  <td>
                    <span className={styles.userId}>
                      #{points.user_id}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.pointsValue} ${getPointsTypeColor(points.points_type)}`}>
                      {getPointsDisplay(points.points, points.points_type)}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.typeBadge} ${getPointsTypeColor(points.points_type)}`}>
                      {points.points_type}
                    </span>
                  </td>
                  <td>
                    <div className={styles.reason}>
                      {points.reason || 'No reason specified'}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusColor(points.is_active)}`}>
                      {points.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(points.created_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(points)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(points.id)}
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

export default UserPoints;
