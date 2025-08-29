import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { doctorAPI } from '../../api/doctor';
import { formatDate, formatTime } from '../../utils/helpers';
import styles from './Notes.module.css';

const Notes = () => {
  const { user } = useAuthStore();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    note: '',
    type: 'consultation',
    is_private: false
  });
  const { loading, error, callApi } = useApi();

  const fetchNotes = async () => {
    try {
      const data = await callApi(doctorAPI.getNotes);
      setNotes(data.notes || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
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
    try {
      if (editingNote) {
        // Update note logic would go here
        console.log('Update note:', formData);
      } else {
        await callApi(() => doctorAPI.createNote(formData));
        setShowForm(false);
        setFormData({
          patient_id: '',
          note: '',
          type: 'consultation',
          is_private: false
        });
        fetchNotes();
      }
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      patient_id: note.patient_id || '',
      note: note.note || '',
      type: note.type || 'consultation',
      is_private: note.is_private || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        // Delete note logic would go here
        console.log('Delete note:', id);
        fetchNotes();
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'consultation': return 'consultation';
      case 'follow_up': return 'follow_up';
      case 'emergency': return 'emergency';
      case 'routine': return 'routine';
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
        <h1>Patient Notes</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Note
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <h3>Total Notes</h3>
            <p>{notes.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Patients</h3>
            <p>{new Set(notes.map(n => n.patient_id)).size}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔒</div>
          <div className={styles.statContent}>
            <h3>Private Notes</h3>
            <p>{notes.filter(n => n.is_private).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <h3>This Month</h3>
            <p>{notes.filter(n => {
              const noteDate = new Date(n.created_at);
              const now = new Date();
              return noteDate.getMonth() === now.getMonth() && 
                     noteDate.getFullYear() === now.getFullYear();
            }).length}</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingNote ? 'Edit Note' : 'Add New Note'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingNote(null);
                  setFormData({
                    patient_id: '',
                    note: '',
                    type: 'consultation',
                    is_private: false
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
                  <label htmlFor="type">Note Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                    <option value="routine">Routine</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="note">Note Content</label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows="8"
                  placeholder="Enter detailed notes about the patient..."
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_private"
                    checked={formData.is_private}
                    onChange={handleInputChange}
                  />
                  Private Note (Only visible to doctors)
                </label>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton} disabled={loading}>
                  {loading ? 'Saving...' : (editingNote ? 'Update' : 'Save')}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingNote(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.notesContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading notes...</p>
          </div>
        ) : (
          <div className={styles.notesGrid}>
            {notes.map((note) => (
              <div key={note.id} className={styles.noteCard}>
                <div className={styles.noteHeader}>
                  <div className={styles.noteMeta}>
                    <span className={`${styles.badge} ${styles[getTypeColor(note.type)]}`}>
                      {note.type.replace('_', ' ')}
                    </span>
                    {note.is_private && (
                      <span className={`${styles.badge} ${styles.private}`}>
                        🔒 Private
                      </span>
                    )}
                  </div>
                  <div className={styles.noteActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(note)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className={styles.noteContent}>
                  <p>{note.note}</p>
                </div>
                
                <div className={styles.noteFooter}>
                  <div className={styles.noteInfo}>
                    <span>Patient ID: {note.patient_id}</span>
                    <span>Created: {formatDate(note.created_at)} at {formatTime(note.created_at)}</span>
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

export default Notes;
