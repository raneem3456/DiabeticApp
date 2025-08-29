import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { doctorAPI } from '../../api/doctor';
import { formatDate } from '../../utils/helpers';
import styles from './LabOrders.module.css';

const LabOrders = () => {
  const { user } = useAuthStore();
  const [labOrders, setLabOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    test_name: '',
    test_date: '',
    lab_name: '',
    instructions: '',
    status: 'ordered'
  });
  const { loading, error, callApi } = useApi();

  const fetchLabOrders = async () => {
    try {
      const data = await callApi(doctorAPI.getLabOrders);
      setLabOrders(data.lab_orders || []);
    } catch (err) {
      console.error('Error fetching lab orders:', err);
    }
  };

  useEffect(() => {
    fetchLabOrders();
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
    try {
      if (editingOrder) {
        // Update lab order logic would go here
        console.log('Update lab order:', formData);
      } else {
        await callApi(() => doctorAPI.createLabOrder(formData));
        setShowForm(false);
        setFormData({
          patient_id: '',
          test_name: '',
          test_date: '',
          lab_name: '',
          instructions: '',
          status: 'ordered'
        });
        fetchLabOrders();
      }
    } catch (err) {
      console.error('Error saving lab order:', err);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      patient_id: order.patient_id || '',
      test_name: order.test_name || '',
      test_date: order.test_date || '',
      lab_name: order.lab_name || '',
      instructions: order.instructions || '',
      status: order.status || 'ordered'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lab order?')) {
      try {
        // Delete lab order logic would go here
        console.log('Delete lab order:', id);
        fetchLabOrders();
      } catch (err) {
        console.error('Error deleting lab order:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered': return 'ordered';
      case 'in_progress': return 'in_progress';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'other';
    }
  };

  if (user?.role !== 'doctor') {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lab Orders Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Lab Order
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔬</div>
          <div className={styles.statContent}>
            <h3>Total Orders</h3>
            <p>{labOrders.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>Ordered</h3>
            <p>{labOrders.filter(o => o.status === 'ordered').length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚡</div>
          <div className={styles.statContent}>
            <h3>In Progress</h3>
            <p>{labOrders.filter(o => o.status === 'in_progress').length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>Completed</h3>
            <p>{labOrders.filter(o => o.status === 'completed').length}</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingOrder ? 'Edit Lab Order' : 'Add New Lab Order'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingOrder(null);
                  setFormData({
                    patient_id: '',
                    test_name: '',
                    test_date: '',
                    lab_name: '',
                    instructions: '',
                    status: 'ordered'
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="patient_id">Patient ID</label>
                  <input
                    type="text"
                    id="patient_id"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="test_name">Test Name</label>
                  <input
                    type="text"
                    id="test_name"
                    name="test_name"
                    value={formData.test_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="test_date">Test Date</label>
                  <input
                    type="date"
                    id="test_date"
                    name="test_date"
                    value={formData.test_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lab_name">Laboratory</label>
                  <input
                    type="text"
                    id="lab_name"
                    name="lab_name"
                    value={formData.lab_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="ordered">Ordered</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="instructions">Instructions</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter any special instructions for the lab test..."
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton} disabled={loading}>
                  {loading ? 'Saving...' : (editingOrder ? 'Update' : 'Save')}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingOrder(null);
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
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading lab orders...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Test Name</th>
                <th>Test Date</th>
                <th>Laboratory</th>
                <th>Status</th>
                <th>Instructions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {labOrders.map((order) => (
                <tr key={order.id} className={styles.tableRow}>
                  <td>{order.patient_id}</td>
                  <td>
                    <div className={styles.testInfo}>
                      <strong>{order.test_name}</strong>
                    </div>
                  </td>
                  <td>{formatDate(order.test_date)}</td>
                  <td>{order.lab_name}</td>
                  <td>
                    <span className={`${styles.status} ${styles[getStatusColor(order.status)]}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className={styles.instructions}>
                      {order.instructions ? (
                        <span title={order.instructions}>
                          {order.instructions.length > 50 
                            ? `${order.instructions.substring(0, 50)}...` 
                            : order.instructions}
                        </span>
                      ) : (
                        <span className={styles.noInstructions}>No instructions</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(order)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(order.id)}
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

export default LabOrders;
