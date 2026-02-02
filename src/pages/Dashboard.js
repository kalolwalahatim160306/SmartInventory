import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Calendar,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import CategoryChart from '../components/CategoryChart';
import RecentActivity from '../components/RecentActivity';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const {
    getTotalProducts,
    getTotalStock,
    getLowStockProducts,
    getOutOfStockProducts,
    getMonthlyRevenue,
    getMonthlyProductsAdded,
    getMonthlyProductsSold,
    products,
    bills
  } = useInventory();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const stats = [
    {
      title: 'Total Products in Stock',
      value: getTotalStock(),
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Products Added This Month',
      value: getMonthlyProductsAdded(currentMonth, currentYear),
      icon: Plus,
      color: 'green'
    },
    {
      title: 'Products Sold This Month',
      value: getMonthlyProductsSold(currentMonth, currentYear),
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Total Revenue This Month',
      value: `₹${getMonthlyRevenue(currentMonth, currentYear).toLocaleString()}`,
      icon: DollarSign,
      color: 'cyan'
    }
  ];

  const lowStockCount = getLowStockProducts().length;
  const outOfStockCount = getOutOfStockProducts().length;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <h2 className="store-name-header">{user?.storeName}</h2>
          <div className="dashboard-date">
            <Calendar className="date-icon" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="profile-section">
            <div className="welcome-text">
              <span className="welcome-label">Welcome back,</span>
              <span className="user-name">{user?.name}</span>
            </div>
            <div className="profile-menu-container">
              <button 
                className="profile-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  <User size={20} />
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-info">
                      <div className="profile-name">{user?.name}</div>
                      <div className="profile-email">{user?.email}</div>
                    </div>
                  </div>
                  <div className="profile-dropdown-menu">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings size={16} />
                      <span>Profile Settings</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="alerts-section">
          {lowStockCount > 0 && (
            <div className="alert alert-warning">
              <AlertTriangle className="alert-icon" />
              <span>{lowStockCount} products are running low on stock</span>
            </div>
          )}
          {outOfStockCount > 0 && (
            <div className="alert alert-danger">
              <AlertTriangle className="alert-icon" />
              <span>{outOfStockCount} products are out of stock</span>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <SalesChart />
        </div>
        <div className="chart-container">
          <CategoryChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <RecentActivity />
      </div>
    </div>
  );
}

export default Dashboard;