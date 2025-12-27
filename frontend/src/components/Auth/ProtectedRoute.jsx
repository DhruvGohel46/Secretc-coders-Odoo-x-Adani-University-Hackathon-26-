import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireManager = false, requirePrivileged = false }) => {
  const { isAuthenticated, loading, isAdmin, isManager, isPrivileged } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireManager && !isManager() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requirePrivileged && !isPrivileged()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

