import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROLES } from '../utils/constants.js';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to role-specific dashboard if user doesn't have required role
    const roleDashboardMap = {
      [ROLES.PATIENT]: '/patient/dashboard',
      [ROLES.DOCTOR]: '/doctor/dashboard',
      [ROLES.NUTRITIONIST]: '/nutritionist/dashboard',
      [ROLES.COACH]: '/coach/dashboard',
      [ROLES.ADMIN]: '/admin/dashboard',
      [ROLES.FAMILY]: '/family/dashboard',
    };
    
    const redirectPath = roleDashboardMap[user.role] || '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
