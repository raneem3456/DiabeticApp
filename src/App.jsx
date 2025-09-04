import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProtectedLayout from './components/ProtectedLayout.jsx';
import { ROLES } from './utils/constants.js';

// Import pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

// Import role-specific pages
import PatientDashboard from './pages/dashboard/PatientDashboard.jsx';
import DoctorDashboard from './pages/dashboard/DoctorDashboard.jsx';
import NutritionistDashboard from './pages/dashboard/NutritionistDashboard.jsx';
import CoachDashboard from './pages/dashboard/CoachDashboard.jsx';
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import FamilyDashboard from './pages/dashboard/FamilyDashboard.jsx';

// Import subpages
import GlucoseReadings from './pages/Patient/GlucoseReadings.jsx';
import HbA1cReports from './pages/Patient/HbA1cReports.jsx';
import MoodTracking from './pages/Patient/MoodTracking.jsx';
import NutritionLogs from './pages/Patient/NutritionLogs.jsx';
import WorkoutLogs from './pages/Patient/WorkoutLogs.jsx';
import Profile from './pages/Patient/Profile.jsx';

import PatientsOverview from './pages/Doctor/PatientsOverview.jsx';
import Reports from './pages/Doctor/Reports.jsx';
import Medications from './pages/Doctor/Medications.jsx';
import Notes from './pages/Doctor/Notes.jsx';
import LabOrders from './pages/Doctor/LabOrders.jsx';

import Meals from './pages/Nutritionist/Meals.jsx';
import MealPlans from './pages/Nutritionist/MealPlans.jsx';

import Exercises from './pages/Coach/Exercises.jsx';
import WorkoutPlans from './pages/Coach/WorkoutPlans.jsx';

import Surveys from './pages/Admin/Surveys.jsx';
import Challenges from './pages/Admin/Challenges.jsx';
import Rewards from './pages/Admin/Rewards.jsx';
import UserPoints from './pages/Admin/UserPoints.jsx';

import CommunityPosts from './pages/Community/Posts.jsx';
import Comments from './pages/Community/Comments.jsx';

import Chats from './pages/Chat/Chats.jsx';

import EmergencyContacts from './pages/Emergency/EmergencyContacts.jsx';

// Import styles
import './styles/global.css';

function AppContent() {
  const { initialize } = useAuth();

  useEffect(() => {
    // Initialize auth state on app load
    initialize();
  }, [initialize]);

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Main Dashboard - redirects to role-specific dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          } 
        />
        
        {/* Role-specific dashboards */}
        <Route 
          path="/patient/dashboard" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.PATIENT]}>
              <PatientDashboard />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/doctor/dashboard" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.DOCTOR]}>
              <DoctorDashboard />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/nutritionist/dashboard" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.NUTRITIONIST]}>
              <NutritionistDashboard />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/coach/dashboard" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.COACH]}>
              <CoachDashboard />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/family/dashboard" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.FAMILY]}>
              <FamilyDashboard />
            </ProtectedLayout>
          } 
        />
        
        {/* Patient routes */}
        <Route 
          path="/patient/glucose-readings" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.PATIENT]}>
              <GlucoseReadings />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/patient/hba1c-reports" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.PATIENT]}>
              <HbA1cReports />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/patient/mood-tracking" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.PATIENT]}>
              <MoodTracking />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/patient/nutrition-logs" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.PATIENT]}>
              <NutritionLogs />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/patient/workout-logs" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.PATIENT]}>
              <WorkoutLogs />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/patient/profile" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.PATIENT]}>
              <Profile />
            </ProtectedLayout>
          } 
        />
        
        {/* Doctor routes */}
        <Route 
          path="/doctor/patients-overview" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.DOCTOR]}>
              <PatientsOverview />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/doctor/reports" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.DOCTOR]}>
              <Reports />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/doctor/medications" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.DOCTOR]}>
              <Medications />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/doctor/notes" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.DOCTOR]}>
              <Notes />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/doctor/lab-orders" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.DOCTOR]}>
              <LabOrders />
            </ProtectedLayout>
          } 
        />
        
        {/* Nutritionist routes */}
        <Route 
          path="/nutritionist/meals" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.NUTRITIONIST]}>
              <Meals />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/nutritionist/meal-plans" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.NUTRITIONIST]}>
              <MealPlans />
            </ProtectedLayout>
          } 
        />
        
        {/* Coach routes */}
        <Route 
          path="/coach/exercises" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.COACH]}>
              <Exercises />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/coach/workout-plans" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.COACH]}>
              <WorkoutPlans />
            </ProtectedLayout>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin/surveys" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.ADMIN]}>
              <Surveys />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/admin/challenges" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.ADMIN]}>
              <Challenges />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/admin/rewards" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.ADMIN]}>
              <Rewards />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/admin/user-points" 
          element={
            <ProtectedLayout allowedRoles={[ROLES.ADMIN]}>
              <UserPoints />
            </ProtectedLayout>
          } 
        />
        
        {/* Community routes */}
        <Route 
          path="/community/posts" 
          element={
            <ProtectedLayout>
              <CommunityPosts />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/community/comments" 
          element={
            <ProtectedLayout>
              <Comments />
            </ProtectedLayout>
          } 
        />
        
        {/* Chat routes */}
        <Route 
          path="/chat/chats" 
          element={
            <ProtectedLayout>
              <Chats />
            </ProtectedLayout>
          } 
        />
        
        {/* Emergency routes */}
        <Route 
          path="/emergency/contacts" 
          element={
            <ProtectedLayout>
              <EmergencyContacts />
            </ProtectedLayout>
          } 
        />
        
        {/* Redirect root to dashboard or login */}
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />
        
        {/* Catch all route */}
        <Route 
          path="*" 
          element={<Navigate to="/dashboard" replace />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
