import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { patientAPI } from '../../api/patient';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, login } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    height: '',
    weight: '',
    diabetes_type: '',
    diagnosis_date: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  });

  const { loading, error, callApi } = useApi();

  // Fetch profile data
  const fetchProfile = async () => {
    const data = await callApi(patientAPI.getProfile);
    if (data) {
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || '',
        height: data.height || '',
        weight: data.weight || '',
        diabetes_type: data.diabetes_type || '',
        diagnosis_date: data.diagnosis_date || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
        emergency_contact_relationship: data.emergency_contact_relationship || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip_code: data.zip_code || '',
        country: data.country || ''
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedProfile = await callApi(() => patientAPI.updateProfile(formData));
      if (updatedProfile) {
        setProfile(updatedProfile);
        setIsEditing(false);
        // Update the user in auth store
        login({
          ...user,
          name: updatedProfile.name,
          email: updatedProfile.email
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Check if user has access
  if (user?.role !== 'patient') {
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
        <h1>Profile</h1>
        <button 
          className={isEditing ? styles.cancelButton : styles.editButton}
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
              // Reset form data to original values
              setFormData({
                name: profile?.name || '',
                email: profile?.email || '',
                phone: profile?.phone || '',
                date_of_birth: profile?.date_of_birth || '',
                gender: profile?.gender || '',
                height: profile?.height || '',
                weight: profile?.weight || '',
                diabetes_type: profile?.diabetes_type || '',
                diagnosis_date: profile?.diagnosis_date || '',
                emergency_contact_name: profile?.emergency_contact_name || '',
                emergency_contact_phone: profile?.emergency_contact_phone || '',
                emergency_contact_relationship: profile?.emergency_contact_relationship || '',
                address: profile?.address || '',
                city: profile?.city || '',
                state: profile?.state || '',
                zip_code: profile?.zip_code || '',
                country: profile?.country || ''
              });
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading profile...</div>
      ) : (
        <div className={styles.profileContainer}>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className={styles.section}>
              <h2>Personal Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="date_of_birth">Date of Birth</label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className={styles.section}>
              <h2>Health Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="height">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="50"
                    max="300"
                    step="0.1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="20"
                    max="500"
                    step="0.1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="diabetes_type">Diabetes Type</label>
                  <select
                    id="diabetes_type"
                    name="diabetes_type"
                    value={formData.diabetes_type}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select Type</option>
                    <option value="type_1">Type 1</option>
                    <option value="type_2">Type 2</option>
                    <option value="gestational">Gestational</option>
                    <option value="prediabetes">Prediabetes</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="diagnosis_date">Diagnosis Date</label>
                  <input
                    type="date"
                    id="diagnosis_date"
                    name="diagnosis_date"
                    value={formData.diagnosis_date}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className={styles.section}>
              <h2>Emergency Contact</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="emergency_contact_name">Contact Name</label>
                  <input
                    type="text"
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="emergency_contact_phone">Contact Phone</label>
                  <input
                    type="tel"
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="emergency_contact_relationship">Relationship</label>
                  <input
                    type="text"
                    id="emergency_contact_relationship"
                    name="emergency_contact_relationship"
                    value={formData.emergency_contact_relationship}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g., Spouse, Parent, Friend"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className={styles.section}>
              <h2>Address Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="address">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="state">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="zip_code">ZIP/Postal Code</label>
                  <input
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className={styles.actions}>
                <button type="submit" className={styles.saveButton} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
