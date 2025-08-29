import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import AuthLayout from '../layouts/AuthLayout.jsx';
import { ROLES } from '../utils/constants.js';
import { validatePassword } from '../utils/helpers.js';
import styles from './Register.module.css';

const Register = () => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: ROLES.PATIENT,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Check password strength
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!passwordStrength.isValid) {
      errors.password = 'Password does not meet requirements';
    }
    
    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(formData);
    } catch (err) {
      // Error is handled by the auth store
      console.error('Registration error:', err);
    }
  };

  const getPasswordStrengthColor = () => {
    if (!formData.password) return '#6c757d';
    if (passwordStrength.isValid) return '#28a745';
    if (formData.password.length >= 6) return '#ffc107';
    return '#dc3545';
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join us to manage your diabetes journey"
    >
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.name ? styles.error : ''}`}
            placeholder="Enter your full name"
            disabled={loading}
          />
          {validationErrors.name && (
            <span className={styles.errorText}>{validationErrors.name}</span>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.email ? styles.error : ''}`}
            placeholder="Enter your email"
            disabled={loading}
          />
          {validationErrors.email && (
            <span className={styles.errorText}>{validationErrors.email}</span>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="role" className={styles.label}>
            I am a
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={styles.select}
            disabled={loading}
          >
            <option value={ROLES.PATIENT}>Patient</option>
            <option value={ROLES.DOCTOR}>Doctor</option>
            <option value={ROLES.NUTRITIONIST}>Nutritionist</option>
            <option value={ROLES.COACH}>Coach</option>
            <option value={ROLES.ADMIN}>Admin</option>
            <option value={ROLES.FAMILY}>Family Member</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.password ? styles.error : ''}`}
            placeholder="Create a strong password"
            disabled={loading}
          />
          {formData.password && (
            <div className={styles.passwordStrength}>
              <div 
                className={styles.strengthBar}
                style={{ backgroundColor: getPasswordStrengthColor() }}
              />
              <div className={styles.strengthRequirements}>
                <span className={passwordStrength.minLength ? styles.valid : styles.invalid}>
                  ✓ At least 8 characters
                </span>
                <span className={passwordStrength.hasUpperCase ? styles.valid : styles.invalid}>
                  ✓ One uppercase letter
                </span>
                <span className={passwordStrength.hasLowerCase ? styles.valid : styles.invalid}>
                  ✓ One lowercase letter
                </span>
                <span className={passwordStrength.hasNumbers ? styles.valid : styles.invalid}>
                  ✓ One number
                </span>
              </div>
            </div>
          )}
          {validationErrors.password && (
            <span className={styles.errorText}>{validationErrors.password}</span>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password_confirmation" className={styles.label}>
            Confirm Password
          </label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.password_confirmation ? styles.error : ''}`}
            placeholder="Confirm your password"
            disabled={loading}
          />
          {validationErrors.password_confirmation && (
            <span className={styles.errorText}>{validationErrors.password_confirmation}</span>
          )}
        </div>
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
