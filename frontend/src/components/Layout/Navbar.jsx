import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faBell, 
  faUserCircle, 
  faMoon, 
  faSun,
  faTools,
  faSignOutAlt
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
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="menu-btn"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="logo">
          <FontAwesomeIcon icon={faTools} className="logo-icon" />
          <h1>GearGuard</h1>
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>

        <div className="notification-btn">
          <FontAwesomeIcon icon={faBell} />
        </div>

        <div className="user-profile-container">
          <div 
            className="user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <FontAwesomeIcon icon={faUserCircle} />
            <span>{user?.name || 'User'}</span>
            <span className="user-role">{user?.role}</span>
          </div>

          {showUserMenu && (
            <div className="user-menu">
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
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
