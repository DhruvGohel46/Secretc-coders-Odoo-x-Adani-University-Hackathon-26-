import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTools, 
  faClock, 
  faCheckCircle, 
  faExclamationTriangle,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { getDashboardStats, getRequestsByTeam, getOverdueRequests } from '../../services/api';
import { toast } from 'react-toastify';
import StatsCard from './StatsCard';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, teamRes, overdueRes] = await Promise.all([
        getDashboardStats(),
        getRequestsByTeam(),
        getOverdueRequests()
      ]);

      setStats({
        ...statsRes.data,
        overdue: overdueRes.data.length
      });
      setTeamData(teamRes.data);
      
      toast.success('Dashboard loaded successfully');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: faTools,
      color: '#3b82f6',
      trend: '+12%'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: faClock,
      color: '#f59e0b',
      trend: '+5%'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: faCheckCircle,
      color: '#10b981',
      trend: '+23%'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: faExclamationTriangle,
      color: '#ef4444',
      trend: '-8%'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FontAwesomeIcon icon={faTools} size="3x" />
        </motion.div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1>Dashboard Overview</h1>
        <p>Monitor your maintenance operations in real-time</p>
      </motion.div>

      <motion.div 
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} index={index} />
        ))}
      </motion.div>

      <motion.div 
        className="charts-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="chart-card">
          <div className="chart-header">
            <h3><FontAwesomeIcon icon={faChartBar} /> Requests by Team</h3>
          </div>
          <div className="team-stats">
            {teamData.map((team, index) => (
              <motion.div
                key={team.id}
                className="team-stat-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="team-info">
                  <span className="team-name">{team.name}</span>
                  <span className="team-count">{team.requestCount} requests</span>
                </div>
                <motion.div 
                  className="team-progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${(team.requestCount / stats.totalRequests) * 100}%` }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
