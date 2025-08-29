import React from 'react';
import styles from './CoachDashboard.module.css';

const CoachDashboard = () => {
  return (
    <div className={styles.coachDashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏃‍♂️</div>
          <div className={styles.statContent}>
            <h3>Total Exercises</h3>
            <p className={styles.statValue}>89</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>Workout Plans</h3>
            <p className={styles.statValue}>34</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Active Patients</h3>
            <p className={styles.statValue}>22</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💪</div>
          <div className={styles.statContent}>
            <h3>Completed Workouts</h3>
            <p className={styles.statValue}>156</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h2>Welcome to your Coach Dashboard</h2>
        <p>Create workout plans, manage exercises, and help patients achieve their fitness goals.</p>
        
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>Create Workout Plan</button>
            <button className={styles.actionButton}>Manage Exercises</button>
            <button className={styles.actionButton}>View Patients</button>
            <button className={styles.actionButton}>Fitness Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
