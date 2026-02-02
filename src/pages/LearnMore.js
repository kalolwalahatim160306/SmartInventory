import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Package, 
  BarChart3, 
  Users, 
  Shield, 
  Smartphone,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import './LearnMore.css';

function LearnMore() {
  const features = [
    {
      icon: <Package className="feature-icon" />,
      title: "Inventory Management",
      description: "Track products, manage stock levels, and get real-time updates on your inventory status."
    },
    {
      icon: <BarChart3 className="feature-icon" />,
      title: "Analytics & Reports",
      description: "Comprehensive dashboard with sales charts, category analysis, and performance metrics."
    },
    {
      icon: <Users className="feature-icon" />,
      title: "User Management",
      description: "Secure user authentication with profile management and personalized store settings."
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Secure & Reliable",
      description: "Your data is protected with modern security practices and reliable storage."
    },
    {
      icon: <Smartphone className="feature-icon" />,
      title: "Mobile Responsive",
      description: "Access your inventory from any device - desktop, tablet, or mobile phone."
    }
  ];

  const benefits = [
    "Real-time inventory tracking",
    "Automated stock alerts",
    "Professional bill generation",
    "Comprehensive search functionality",
    "Dark theme for comfortable viewing",
    "Indian Rupee (₹) currency support"
  ];

  return (
    <div className="learn-more-container">
      <div className="learn-more-content">
        {/* Header */}
        <div className="learn-more-header">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <div className="header-content">
            <div className="logo">
              <TrendingUp className="logo-icon" />
              <h1>SmartInventory</h1>
            </div>
            <p className="subtitle">Complete Inventory Management Solution</p>
          </div>
        </div>

        {/* Features Section */}
        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                {feature.icon}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2>What You Get</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <CheckCircle className="check-icon" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of businesses managing their inventory efficiently with SmartInventory.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary cta-btn">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-secondary cta-btn">
              Sign In
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LearnMore;