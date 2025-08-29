import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { ROLES } from '../utils/constants.js';
import styles from './Dashboard.module.css';

// Import role-specific dashboard components
import PatientDashboard from './dashboard/PatientDashboard.jsx';
import DoctorDashboard from './dashboard/DoctorDashboard.jsx';
import NutritionistDashboard from './dashboard/NutritionistDashboard.jsx';
import CoachDashboard from './dashboard/CoachDashboard.jsx';
import AdminDashboard from './dashboard/AdminDashboard.jsx';
import FamilyDashboard from './dashboard/FamilyDashboard.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboardContent = () => {
    switch (user?.role) {
      case ROLES.PATIENT:
        return <PatientDashboard />;
      case ROLES.DOCTOR:
        return <DoctorDashboard />;
      case ROLES.NUTRITIONIST:
        return <NutritionistDashboard />;
      case ROLES.COACH:
        return <CoachDashboard />;
      case ROLES.ADMIN:
        return <AdminDashboard />;
      case ROLES.FAMILY:
        return <FamilyDashboard />;
      default:
        return <div>Welcome to your dashboard!</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your diabetes management today.</p>
        </div>
        
        {renderDashboardContent()}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
