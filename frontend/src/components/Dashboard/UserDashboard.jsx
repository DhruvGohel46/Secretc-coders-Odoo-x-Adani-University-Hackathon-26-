import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTools, 
  faClock, 
  faCheckCircle,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { getAllRequests } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from './StatsCard';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 0,
    inProgress: 0,
    completed: 0
  });
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getAllRequests();
      const requests = response.data.filter(r => r.createdByUserId === user?.id);

      setStats({
        totalRequests: requests.length,
        inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
        completed: requests.filter(r => r.status === 'REPAIRED').length
      });

      setMyRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'My Requests',
      value: stats.totalRequests,
      icon: faFileAlt,
      color: '#2563eb',
      description: 'Requests I created',
      onClick: () => navigate('/requests')
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: faClock,
      color: '#3b82f6',
      description: 'Being processed',
      onClick: () => navigate('/requests?status=IN_PROGRESS')
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: faCheckCircle,
      color: '#60a5fa',
      description: 'Resolved requests',
      onClick: () => navigate('/requests?status=REPAIRED')
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
          <h1>My Dashboard</h1>
          <p>Track your maintenance requests</p>
        </div>
      </div>

      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>My Recent Requests</h3>
          <div className="recent-requests">
            {myRequests.length === 0 ? (
              <p className="empty-state">No requests yet. Create one to get started!</p>
            ) : (
              myRequests.map((request) => (
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

export default UserDashboard;

