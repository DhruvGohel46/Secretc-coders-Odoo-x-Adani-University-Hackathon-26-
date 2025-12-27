import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import TechnicianDashboard from './TechnicianDashboard';
import UserDashboard from './UserDashboard';

const DashboardRouter = () => {
  const { isAdmin, isManager, isTechnician } = useAuth();

  if (isAdmin()) {
    return <AdminDashboard />;
  }

  if (isManager()) {
    return <ManagerDashboard />;
  }

  if (isTechnician()) {
    return <TechnicianDashboard />;
  }

  return <UserDashboard />;
};

export default DashboardRouter;

