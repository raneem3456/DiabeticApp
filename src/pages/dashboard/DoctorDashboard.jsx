import React from 'react';
import styles from './DoctorDashboard.module.css';

const DoctorDashboard = () => {
  return (
    <div className={styles.doctorDashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Total Patients</h3>
            <p className={styles.statValue}>24</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>Reports Generated</h3>
            <p className={styles.statValue}>156</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💊</div>
          <div className={styles.statContent}>
            <h3>Active Medications</h3>
            <p className={styles.statValue}>89</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔬</div>
          <div className={styles.statContent}>
            <h3>Lab Orders</h3>
            <p className={styles.statValue}>12</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h2>Welcome to your Doctor Dashboard</h2>
        <p>Manage your patients, view reports, and track their progress.</p>
        
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>View Patients</button>
            <button className={styles.actionButton}>Generate Reports</button>
            <button className={styles.actionButton}>Manage Medications</button>
            <button className={styles.actionButton}>Lab Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
