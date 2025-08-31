import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Import pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

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
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
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