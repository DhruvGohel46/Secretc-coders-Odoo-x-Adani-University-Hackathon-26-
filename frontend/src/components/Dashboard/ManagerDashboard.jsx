import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTools, 
  faClock, 
  faCheckCircle, 
  faExclamationTriangle,
  faUsers,
  faChartLine,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { getDashboardStats, getAllTeams, getOverdueRequests, getRequestsByTeam } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from './StatsCard';
import './Dashboard.css';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    totalTeams: 0
  });
  const [teamStats, setTeamStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, teamsRes, overdueRes] = await Promise.all([
        getDashboardStats(),
        getAllTeams(),
        getOverdueRequests()
      ]);

      setStats({
        ...statsRes.data,
        overdue: overdueRes.data.length,
        totalTeams: teamsRes.data.length
      });

      // Get requests per team
      const teamRequests = await Promise.all(
        teamsRes.data.map(async (team) => {
          try {
            const requests = await getRequestsByTeam(team.id);
            return { ...team, requestCount: requests.data.length };
          } catch {
            return { ...team, requestCount: 0 };
          }
        })
      );
      setTeamStats(teamRequests);
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
      title: 'Teams',
      value: stats.totalTeams,
      icon: faUsers,
      color: '#1e40af',
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
          <h1>Manager Dashboard</h1>
          <p>Monitor team performance and maintenance operations</p>
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
          <h3>Team Performance</h3>
          <div className="team-performance">
            {teamStats.map((team) => (
              <div key={team.id} className="team-performance-item">
                <div className="team-info">
                  <span className="team-name">{team.name}</span>
                  <span className="team-count">{team.requestCount} requests</span>
                </div>
                <div className="team-progress-bar">
                  <div 
                    className="team-progress-fill"
                    style={{ width: `${stats.totalRequests > 0 ? (team.requestCount / stats.totalRequests) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

