import React from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faBell, 
  faUserCircle, 
  faMoon, 
  faSun,
  faTools
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = ({ toggleSidebar, toggleTheme, darkMode }) => {
  const [notifications, setNotifications] = React.useState(3);

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
          {notifications > 0 && (
            <motion.span 
              className="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {notifications}
            </motion.span>
          )}
        </motion.div>

        <motion.div 
          className="user-profile"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faUserCircle} />
          <span>John Doe</span>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
