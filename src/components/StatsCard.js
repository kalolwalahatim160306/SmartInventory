import React from 'react';
import './StatsCard.css';

function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-header">
        <div className="stats-card-icon">
          <Icon />
        </div>
      </div>
      
      <div className="stats-card-content">
        <h3 className="stats-card-value">{value}</h3>
        <p className="stats-card-title">{title}</p>
      </div>
    </div>
  );
}

export default StatsCard;