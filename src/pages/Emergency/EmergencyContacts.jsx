import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { emergencyAPI } from '../../api/emergency';
import { formatDate } from '../../utils/helpers';
import styles from './EmergencyContacts.module.css';

const EmergencyContacts = () => {
  const { user } = useAuthStore();
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    is_primary: false,
    notes: ''
  });
  const { loading, error, callApi } = useApi();

  const fetchContacts = async () => {
    const result = await callApi(emergencyAPI.getEmergencyContacts);
    if (result) {
      setContacts(result);
    }
  };

  useEffect(() => {
    fetchContacts();
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
    const apiCall = editingContact
      ? () => emergencyAPI.updateEmergencyContact(editingContact.id, formData)
      : () => emergencyAPI.createEmergencyContact(formData);

    const result = await callApi(apiCall);
    if (result) {
      setShowForm(false);
      setEditingContact(null);
      setFormData({
        name: '',
        relationship: '',
        phone: '',
        email: '',
        address: '',
        is_primary: false,
        notes: ''
      });
      fetchContacts();
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name || '',
      relationship: contact.relationship || '',
      phone: contact.phone || '',
      email: contact.email || '',
      address: contact.address || '',
      is_primary: contact.is_primary || false,
      notes: contact.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this emergency contact?')) {
      const result = await callApi(() => emergencyAPI.deleteEmergencyContact(id));
      if (result) {
        fetchContacts();
      }
    }
  };

  const getPrimaryContactColor = (isPrimary) => {
    return isPrimary ? styles.primaryContact : styles.secondaryContact;
  };

  const getRelationshipColor = (relationship) => {
    const colors = {
      'spouse': styles.relationshipSpouse,
      'parent': styles.relationshipParent,
      'child': styles.relationshipChild,
      'sibling': styles.relationshipSibling,
      'friend': styles.relationshipFriend,
      'doctor': styles.relationshipDoctor,
      'other': styles.relationshipOther
    };
    return colors[relationship.toLowerCase()] || styles.relationshipOther;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Emergency Contacts</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add Emergency Contact
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📞</div>
          <div className={styles.statInfo}>
            <h3>{contacts.length}</h3>
            <p>Total Contacts</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statInfo}>
            <h3>{contacts.filter(c => c.is_primary).length}</h3>
            <p>Primary Contacts</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👨‍⚕️</div>
          <div className={styles.statInfo}>
            <h3>{contacts.filter(c => c.relationship?.toLowerCase() === 'doctor').length}</h3>
            <p>Medical Contacts</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📧</div>
          <div className={styles.statInfo}>
            <h3>{contacts.filter(c => c.email).length}</h3>
            <p>With Email</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingContact(null);
                  setFormData({
                    name: '',
                    relationship: '',
                    phone: '',
                    email: '',
                    address: '',
                    is_primary: false,
                    notes: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="relationship">Relationship *</label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="child">Child</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="doctor">Doctor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter full address"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Additional notes or instructions"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_primary"
                    checked={formData.is_primary}
                    onChange={handleInputChange}
                  />
                  Primary Emergency Contact
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingContact(null);
                    setFormData({
                      name: '',
                      relationship: '',
                      phone: '',
                      email: '',
                      address: '',
                      is_primary: false,
                      notes: ''
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

      <div className={styles.contactsContainer}>
        {loading ? (
          <div className={styles.loading}>Loading emergency contacts...</div>
        ) : contacts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📞</div>
            <h3>No emergency contacts yet</h3>
            <p>Add emergency contacts to ensure help is available when needed.</p>
            <button 
              className={styles.createFirstButton}
              onClick={() => setShowForm(true)}
            >
              Add Your First Contact
            </button>
          </div>
        ) : (
          <div className={styles.contactsList}>
            {contacts.map(contact => (
              <div key={contact.id} className={styles.contactCard}>
                <div className={styles.contactHeader}>
                  <div className={styles.contactInfo}>
                    <h3 className={styles.contactName}>{contact.name}</h3>
                    <div className={styles.contactMeta}>
                      <span className={`${styles.relationship} ${getRelationshipColor(contact.relationship)}`}>
                        {contact.relationship}
                      </span>
                      <span className={`${styles.primaryBadge} ${getPrimaryContactColor(contact.is_primary)}`}>
                        {contact.is_primary ? 'Primary Contact' : 'Secondary Contact'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.contactActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(contact)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(contact.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>📞 Phone:</span>
                    <span className={styles.contactValue}>{contact.phone}</span>
                  </div>
                  
                  {contact.email && (
                    <div className={styles.contactItem}>
                      <span className={styles.contactLabel}>📧 Email:</span>
                      <span className={styles.contactValue}>{contact.email}</span>
                    </div>
                  )}
                  
                  {contact.address && (
                    <div className={styles.contactItem}>
                      <span className={styles.contactLabel}>📍 Address:</span>
                      <span className={styles.contactValue}>{contact.address}</span>
                    </div>
                  )}
                  
                  {contact.notes && (
                    <div className={styles.contactItem}>
                      <span className={styles.contactLabel}>📝 Notes:</span>
                      <span className={styles.contactValue}>{contact.notes}</span>
                    </div>
                  )}
                </div>

                <div className={styles.contactFooter}>
                  <span className={styles.createdDate}>
                    Added {formatDate(contact.created_at)}
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

export default EmergencyContacts;
