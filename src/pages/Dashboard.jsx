import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROLES } from '../utils/constants.js';

const Dashboard = () => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to role-specific dashboard
  if (user?.role) {
    switch (user.role) {
      case ROLES.PATIENT:
        return <Navigate to="/patient/dashboard" replace />;
      case ROLES.DOCTOR:
        return <Navigate to="/doctor/dashboard" replace />;
      case ROLES.NUTRITIONIST:
        return <Navigate to="/nutritionist/dashboard" replace />;
      case ROLES.COACH:
        return <Navigate to="/coach/dashboard" replace />;
      case ROLES.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case ROLES.FAMILY:
        return <Navigate to="/family/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If no user, redirect to login
  return <Navigate to="/login" replace />;
};

export default Dashboard;
