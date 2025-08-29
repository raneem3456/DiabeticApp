// src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🚫 Unauthorized</h1>
      <p>You do not have access to this page.</p>
      <Link to="/dashboard">Go back to Dashboard</Link>
    </div>
  );
};

export default Unauthorized;
