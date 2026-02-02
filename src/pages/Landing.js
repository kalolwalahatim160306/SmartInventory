import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import './Landing.css';

function Landing() {
  return (
    <div 
      className="landing-container"
      style={{
        backgroundImage: `
          linear-gradient(rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6)),
          url('/warehouse-bg.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="landing-content">
        <div className="landing-header">
          <div className="logo">
            <TrendingUp className="logo-icon" />
            <h1>SmartInventory</h1>
          </div>
          <p className="tagline">Real-Time Inventory Control</p>
        </div>
        
        <div className="landing-buttons">
          <Link to="/login" className="btn btn-primary get-started-btn">
            Get Started
          </Link>
          <Link to="/learn-more" className="btn btn-secondary learn-more-btn">
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;