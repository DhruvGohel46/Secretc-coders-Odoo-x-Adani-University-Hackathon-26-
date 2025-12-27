import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faBell, 
  faUserCircle, 
  faMoon, 
  faSun,
  faTools,
  faSignOutAlt,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar, toggleTheme, darkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <div className="navbar-left">
        <motion.button
          className="menu-btn"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faBars} />
        </motion.button>

        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FontAwesomeIcon icon={faTools} className="logo-icon" />
          <h1>GearGuard</h1>
        </motion.div>
      </div>

      <div className="navbar-right">
        <motion.button
          className="theme-toggle"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </motion.button>

        <motion.div 
          className="notification-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faBell} />
        </motion.div>

        <div className="user-profile-container">
          <motion.div 
            className="user-profile"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <FontAwesomeIcon icon={faUserCircle} />
            <span>{user?.name || 'User'}</span>
            <span className="user-role">{user?.role}</span>
          </motion.div>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className="user-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="user-menu-header">
                  <div className="user-menu-name">{user?.name}</div>
                  <div className="user-menu-email">{user?.email}</div>
                  <div className="user-menu-role">{user?.role}</div>
                </div>
                <div className="user-menu-divider"></div>
                <button className="user-menu-item" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
