import React from 'react';
import styles from './FamilyDashboard.module.css';

const FamilyDashboard = () => {
  return (
    <div className={styles.familyDashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Connected Patients</h3>
            <p className={styles.statValue}>3</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🩸</div>
          <div className={styles.statContent}>
            <h3>Latest Glucose</h3>
            <p className={styles.statValue}>120 mg/dL</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🚨</div>
          <div className={styles.statContent}>
            <h3>Emergency Contacts</h3>
            <p className={styles.statValue}>5</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📱</div>
          <div className={styles.statContent}>
            <h3>Alerts Today</h3>
            <p className={styles.statValue}>2</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h2>Welcome to your Family Dashboard</h2>
        <p>Monitor your loved ones' diabetes management and stay connected with their health journey.</p>
        
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>View Patient Overview</button>
            <button className={styles.actionButton}>Emergency Contacts</button>
            <button className={styles.actionButton}>Health Alerts</button>
            <button className={styles.actionButton}>Communication</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDashboard;
