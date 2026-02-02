import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import './Inventory.css';

function Inventory() {
  const { products, categories, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase().replace(' ', '-');
    return <span className={`status-badge status-${statusClass}`}>{status}</span>;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="inventory">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <div className="inventory-stats">
          <div className="stat-item">
            <span className="stat-value">{products.length}</span>
            <span className="stat-label">Total Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{products.filter(p => p.status === 'Low Stock').length}</span>
            <span className="stat-label">Low Stock</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{products.filter(p => p.status === 'Out of Stock').length}</span>
            <span className="stat-label">Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="inventory-filters">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by product name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <Filter className="filter-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                Product ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                Product Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('stock')} className="sortable">
                Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('costPrice')} className="sortable">
                Cost Price {sortBy === 'costPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('sellingPrice')} className="sortable">
                Selling Price {sortBy === 'sellingPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  <AlertCircle className="no-data-icon" />
                  <span>No products found</span>
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className={product.status === 'Out of Stock' ? 'out-of-stock-row' : ''}>
                  <td className="product-id">{product.id}</td>
                  <td className="product-name">
                    <div>
                      <div className="name">{product.name}</div>
                      <div className="description">{product.description}</div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td className={`stock ${product.status === 'Low Stock' ? 'low-stock' : product.status === 'Out of Stock' ? 'out-of-stock' : ''}`}>
                    {product.stock}
                  </td>
                  <td>₹{product.costPrice.toFixed(2)}</td>
                  <td>₹{product.sellingPrice.toFixed(2)}</td>
                  <td>{getStatusBadge(product.status)}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-icon btn-edit" title="Edit Product">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        title="Delete Product"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;