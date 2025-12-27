import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTools, 
  faClock, 
  faCheckCircle, 
  faExclamationTriangle,
  faUsers,
  faBuilding,
  faChartLine,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { getDashboardStats, getAllTeams, getOverdueRequests, getAllUsers, getAllDepartments, getAllRequests, getAllEquipment } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from './StatsCard';
import './Dashboard.css';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    totalUsers: 0,
    totalTeams: 0,
    totalDepartments: 0,
    totalEquipment: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, teamsRes, overdueRes, usersRes, deptsRes, requestsRes, equipmentRes] = await Promise.all([
        getDashboardStats(),
        getAllTeams(),
        getOverdueRequests(),
        getAllUsers().catch(() => ({ data: [] })),
        getAllDepartments().catch(() => ({ data: [] })),
        getAllRequests().catch(() => ({ data: [] })),
        getAllEquipment().catch(() => ({ data: [] }))
      ]);

      setStats({
        ...statsRes.data,
        overdue: overdueRes.data.length,
        totalUsers: usersRes.data.length,
        totalTeams: teamsRes.data.length,
        totalDepartments: deptsRes.data.length,
        totalEquipment: equipmentRes.data.length
      });

      // Get recent requests
      const recent = requestsRes.data
        .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
        .slice(0, 5);
      setRecentRequests(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: faTools,
      color: '#2563eb',
      description: 'All maintenance requests',
      onClick: () => navigate('/requests')
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: faClock,
      color: '#3b82f6',
      description: 'Active requests',
      onClick: () => navigate('/requests?status=IN_PROGRESS')
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: faCheckCircle,
      color: '#60a5fa',
      description: 'Finished requests',
      onClick: () => navigate('/requests?status=REPAIRED')
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: faExclamationTriangle,
      color: '#1d4ed8',
      description: 'Requires attention',
      onClick: () => navigate('/requests?overdue=1')
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: faUsers,
      color: '#1e40af',
      description: 'System users',
      onClick: () => navigate('/users')
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      icon: faBuilding,
      color: '#1e3a8a',
      description: 'Organizational units',
      onClick: () => navigate('/departments')
    },
    {
      title: 'Equipment',
      value: stats.totalEquipment,
      icon: faTools,
      color: '#3b82f6',
      description: 'Total equipment',
      onClick: () => navigate('/equipment')
    },
    {
      title: 'Teams',
      value: stats.totalTeams,
      icon: faUsers,
      color: '#2563eb',
      description: 'Maintenance teams',
      onClick: () => navigate('/teams')
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Complete system overview and management</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-secondary" onClick={fetchDashboardData}>
            <FontAwesomeIcon icon={faChartLine} /> Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn" onClick={() => navigate('/users')}>
              <FontAwesomeIcon icon={faUsers} />
              <span>Manage Users</span>
              <FontAwesomeIcon icon={faArrowRight} className="action-arrow" />
            </button>
            <button className="action-btn" onClick={() => navigate('/departments')}>
              <FontAwesomeIcon icon={faBuilding} />
              <span>Manage Departments</span>
              <FontAwesomeIcon icon={faArrowRight} className="action-arrow" />
            </button>
            <button className="action-btn" onClick={() => navigate('/requests')}>
              <FontAwesomeIcon icon={faTools} />
              <span>View All Requests</span>
              <FontAwesomeIcon icon={faArrowRight} className="action-arrow" />
            </button>
            <button className="action-btn" onClick={() => navigate('/equipment')}>
              <FontAwesomeIcon icon={faTools} />
              <span>Manage Equipment</span>
              <FontAwesomeIcon icon={faArrowRight} className="action-arrow" />
            </button>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Recent Requests</h3>
          <div className="recent-requests">
            {recentRequests.length === 0 ? (
              <p className="empty-state">No recent requests</p>
            ) : (
              recentRequests.map((request) => (
                <div key={request.id} className="request-item" onClick={() => navigate('/requests')}>
                  <div className="request-icon">
                    <FontAwesomeIcon icon={faTools} />
                  </div>
                  <div className="request-info">
                    <h4>{request.subject}</h4>
                    <p>{request.equipment?.name || 'N/A'} • {request.team?.name || 'Unassigned'}</p>
                  </div>
                  <div className="request-status">
                    <span className={`badge badge-${request.status.toLowerCase().replace('_', '-')}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

