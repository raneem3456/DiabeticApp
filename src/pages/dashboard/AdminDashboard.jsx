import React from 'react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  return (
    <div className={styles.adminDashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Total Users</h3>
            <p className={styles.statValue}>1,234</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <h3>Active Surveys</h3>
            <p className={styles.statValue}>15</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statContent}>
            <h3>Challenges</h3>
            <p className={styles.statValue}>8</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎁</div>
          <div className={styles.statContent}>
            <h3>Rewards Given</h3>
            <p className={styles.statValue}>456</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h2>Welcome to your Admin Dashboard</h2>
        <p>Manage the platform, users, surveys, challenges, and rewards system.</p>
        
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>Manage Users</button>
            <button className={styles.actionButton}>Create Survey</button>
            <button className={styles.actionButton}>Manage Challenges</button>
            <button className={styles.actionButton}>Rewards System</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
