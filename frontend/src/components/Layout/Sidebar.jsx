import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine,
  faColumns,
  faBoxes,
  faUsers,
  faCalendarAlt,
  faBuilding,
  faUserShield,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { isPrivileged } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: faChartLine, label: 'Dashboard' },
    { path: '/kanban', icon: faColumns, label: 'Kanban Board' },
    { path: '/requests', icon: faClipboardList, label: 'Requests' },
    { path: '/equipment', icon: faBoxes, label: 'Equipment' },
    { path: '/teams', icon: faUsers, label: 'Teams' },
    { path: '/calendar', icon: faCalendarAlt, label: 'Calendar' },
    { path: '/departments', icon: faBuilding, label: 'Departments', requirePrivileged: true },
    { path: '/users', icon: faUserShield, label: 'Users', requirePrivileged: true },
  ].filter(item => !item.requirePrivileged || isPrivileged());

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                <span>{item.label}</span>
                {isActive && <div className="active-indicator" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
