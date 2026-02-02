import React, { useState } from 'react';
import { Search, Package, DollarSign, AlertCircle, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import './SearchProduct.css';

function SearchProduct() {
  const { products, categories } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim() && !selectedCategory) {
      alert('Please enter a search term or select a category');
      return;
    }

    let results = products;

    // Filter by search term
    if (searchTerm.trim()) {
      results = results.filter(product => {
        switch (searchType) {
          case 'name':
            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
          case 'id':
            return product.id.toLowerCase().includes(searchTerm.toLowerCase());
          case 'category':
            return product.category.toLowerCase().includes(searchTerm.toLowerCase());
          default:
            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter(product => product.category === selectedCategory);
    }

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle className="status-icon in-stock" />;
      case 'Low Stock':
        return <AlertCircle className="status-icon low-stock" />;
      case 'Out of Stock':
        return <XCircle className="status-icon out-of-stock" />;
      default:
        return <Package className="status-icon" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase().replace(' ', '-');
    return <span className={`status-badge status-${statusClass}`}>{status}</span>;
  };

  return (
    <div className="search-product">
      <div className="search-header">
        <h1>Search Products</h1>
        <p>Quick stock and price check for your inventory</p>
      </div>

      {/* Search Form */}
      <div className="search-form-container">
        <div className="search-form">
          <div className="search-input-group">
            <div className="search-type-selector">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="search-type-select"
              >
                <option value="name">Product Name</option>
                <option value="id">Product ID</option>
                <option value="category">Category</option>
              </select>
            </div>
            
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Search by ${searchType}...`}
                className="search-input"
              />
            </div>
          </div>

          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="search-actions">
            <button onClick={handleSearch} className="btn btn-primary search-btn">
              <Search size={16} />
              Search
            </button>
            <button onClick={clearSearch} className="btn btn-secondary clear-btn">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="search-results">
        {hasSearched && (
          <div className="results-header">
            <h3>Search Results</h3>
            <span className="results-count">
              {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
            </span>
          </div>
        )}

        {hasSearched && searchResults.length === 0 && (
          <div className="no-results">
            <Package className="no-results-icon" />
            <h4>No products found</h4>
            <p>Try adjusting your search criteria or check the spelling</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="results-grid">
            {searchResults.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-card-header">
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    <span className="product-id">{product.id}</span>
                  </div>
                  {getStatusIcon(product.status)}
                </div>

                <div className="product-category">
                  <span className="category-badge">{product.category}</span>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-details">
                  <div className="detail-item">
                    <Package className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Stock Available</span>
                      <span className={`detail-value ${product.status === 'Low Stock' ? 'low-stock' : product.status === 'Out of Stock' ? 'out-of-stock' : ''}`}>
                        {product.stock} units
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <DollarSign className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Selling Price</span>
                      <span className="detail-value price">₹{product.sellingPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="product-status">
                  {getStatusBadge(product.status)}
                </div>

                <div className="product-actions">
                  <button 
                    className="btn btn-primary create-bill-btn"
                    disabled={product.status === 'Out of Stock'}
                  >
                    <ShoppingCart size={16} />
                    Create Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchProduct;