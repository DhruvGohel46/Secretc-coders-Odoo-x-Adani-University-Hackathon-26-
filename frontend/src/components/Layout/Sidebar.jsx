import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine,
  faColumns,
  faBoxes,
  faUsers,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: faChartLine, label: 'Dashboard' },
    { path: '/kanban', icon: faColumns, label: 'Kanban Board' },
    { path: '/equipment', icon: faBoxes, label: 'Equipment' },
    { path: '/teams', icon: faUsers, label: 'Teams' },
    { path: '/calendar', icon: faCalendarAlt, label: 'Calendar' },
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

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.aside 
      className="sidebar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <motion.div
            key={item.path}
            variants={itemVariants}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                  </motion.div>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="active-indicator"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
