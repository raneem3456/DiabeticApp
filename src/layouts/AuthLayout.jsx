import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>🩸 DiabeticApp</h1>
          <p>Your Health, Your Control</p>
        </div>
        
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          
          {children}
          
          <div className={styles.footer}>
            <p>
              {title === 'Login' ? (
                <>
                  Don't have an account? <Link to="/register">Sign up</Link>
                </>
              ) : (
                <>
                  Already have an account? <Link to="/login">Sign in</Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
