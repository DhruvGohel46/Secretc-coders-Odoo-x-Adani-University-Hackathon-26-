import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color, description, onClick }) => {
  return (
    <div
      className="stats-card"
      style={{ '--card-color': color }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="stats-card-content">
        <div className="stats-info">
          <h3>{title}</h3>
          <p className="stats-value">{value}</p>
          {description && <span className="stats-description">{description}</span>}
        </div>
        <div className="stats-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
      <div className="stats-card-gradient"></div>
    </div>
  );
};

export default StatsCard;
