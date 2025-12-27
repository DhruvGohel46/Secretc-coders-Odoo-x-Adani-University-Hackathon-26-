import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTools, 
  faClock, 
  faCheckCircle, 
  faExclamationTriangle,
  faWrench
} from '@fortawesome/free-solid-svg-icons';
import { getRequestsByTechnician, getOverdueRequests } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from './StatsCard';
import './Dashboard.css';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [myRequests, overdueRes] = await Promise.all([
        getRequestsByTechnician(user.id),
        getOverdueRequests()
      ]);

      const requests = myRequests.data;
      const myOverdue = overdueRes.data.filter(r => r.technicianId === user.id);

      setStats({
        totalRequests: requests.length,
        inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
        completed: requests.filter(r => r.status === 'REPAIRED').length,
        overdue: myOverdue.length
      });

      setRecentRequests(requests.slice(0, 5));
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
      icon: faTools,
      color: '#2563eb',
      description: 'Assigned to me',
      onClick: () => navigate(`/requests?technicianId=${user?.id}`)
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: faClock,
      color: '#3b82f6',
      description: 'Currently working on',
      onClick: () => navigate(`/requests?technicianId=${user?.id}&status=IN_PROGRESS`)
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: faCheckCircle,
      color: '#60a5fa',
      description: 'Finished this month',
      onClick: () => navigate(`/requests?technicianId=${user?.id}&status=REPAIRED`)
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: faExclamationTriangle,
      color: '#1d4ed8',
      description: 'Requires attention',
      onClick: () => navigate(`/requests?technicianId=${user?.id}&overdue=1`)
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
          <h1>Technician Dashboard</h1>
          <p>Your assigned maintenance requests and tasks</p>
        </div>
      </div>

      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Recent Requests</h3>
          <div className="recent-requests">
            {recentRequests.length === 0 ? (
              <p className="empty-state">No requests assigned</p>
            ) : (
              recentRequests.map((request) => (
                <div key={request.id} className="request-item" onClick={() => navigate('/requests')}>
                  <div className="request-icon">
                    <FontAwesomeIcon icon={faWrench} />
                  </div>
                  <div className="request-info">
                    <h4>{request.subject}</h4>
                    <p>{request.equipment?.name || 'N/A'}</p>
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

export default TechnicianDashboard;

