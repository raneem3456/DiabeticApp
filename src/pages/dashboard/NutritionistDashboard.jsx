import React from 'react';
import styles from './NutritionistDashboard.module.css';

const NutritionistDashboard = () => {
  return (
    <div className={styles.nutritionistDashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🍽️</div>
          <div className={styles.statContent}>
            <h3>Total Meals</h3>
            <p className={styles.statValue}>156</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>Meal Plans</h3>
            <p className={styles.statValue}>23</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Active Patients</h3>
            <p className={styles.statValue}>18</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h3>Average Rating</h3>
            <p className={styles.statValue}>4.8</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h2>Welcome to your Nutritionist Dashboard</h2>
        <p>Create meal plans, manage nutrition programs, and help patients achieve their dietary goals.</p>
        
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>Create Meal Plan</button>
            <button className={styles.actionButton}>Manage Meals</button>
            <button className={styles.actionButton}>View Patients</button>
            <button className={styles.actionButton}>Nutrition Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionistDashboard;
