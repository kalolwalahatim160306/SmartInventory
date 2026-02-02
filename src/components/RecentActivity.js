import React from 'react';
import { Package, ShoppingCart, Plus, Clock } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import './RecentActivity.css';

function RecentActivity() {
  const { products, bills } = useInventory();

  // Combine and sort recent activities
  const recentProducts = products
    .slice(-5)
    .map(product => ({
      type: 'product_added',
      date: product.dateAdded,
      description: `Added ${product.name} to inventory`,
      icon: Plus,
      color: 'green'
    }));

  const recentSales = bills
    .slice(-5)
    .map(bill => ({
      type: 'sale',
      date: bill.date,
      description: `Sale to ${bill.customerName} - ₹${bill.totalAmount}`,
      icon: ShoppingCart,
      color: 'blue'
    }));

  const allActivities = [...recentProducts, ...recentSales]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <Clock className="activity-clock" />
      </div>
      
      <div className="activity-list">
        {allActivities.length === 0 ? (
          <div className="no-activity">
            <Package className="no-activity-icon" />
            <p>No recent activity</p>
          </div>
        ) : (
          allActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="activity-item">
                <div className={`activity-icon activity-icon-${activity.color}`}>
                  <Icon size={16} />
                </div>
                <div className="activity-content">
                  <p className="activity-description">{activity.description}</p>
                  <span className="activity-date">{formatDate(activity.date)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentActivity;