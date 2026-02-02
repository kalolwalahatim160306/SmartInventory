import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, User, Calendar, DollarSign, Package } from 'lucide-react';
import './BillModal.css';

function BillModal({ bill, products, isCreating, onSave, onClose }) {
  const [formData, setFormData] = useState({
    customerName: '',
    items: [],
    totalAmount: 0,
    date: new Date().toISOString().split('T')[0] // Set current date by default
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState('');
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (bill && !isCreating) {
      setFormData({
        ...bill,
        items: bill.items.map(item => ({ ...item }))
      });
    } else {
      setFormData({
        customerName: '',
        items: [],
        totalAmount: 0,
        date: new Date().toISOString().split('T')[0] // Always set current date for new bills
      });
    }
  }, [bill, isCreating]);

  useEffect(() => {
    // Recalculate total whenever items change
    const total = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.finalPrice);
    }, 0);
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.items]);

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) {
      alert('Please select a product and enter a valid quantity');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      alert('Product not found');
      return;
    }

    if (product.stock < quantity) {
      alert(`Insufficient stock. Available: ${product.stock}`);
      return;
    }

    const finalPrice = useCustomPrice && customPrice ? parseFloat(customPrice) : product.sellingPrice;
    
    const newItem = {
      productId: product.id,
      productName: product.name,
      quantity: parseInt(quantity),
      defaultPrice: product.sellingPrice,
      finalPrice: finalPrice
    };

    // Check if item already exists
    const existingItemIndex = formData.items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex].quantity += parseInt(quantity);
      setFormData(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Add new item
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }

    // Reset form
    setSelectedProduct('');
    setQuantity(1);
    setCustomPrice('');
    setUseCustomPrice(false);
    setProductSearch('');
    setShowProductDropdown(false);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleUpdateItemPrice = (index, newPrice) => {
    const updatedItems = [...formData.items];
    updatedItems[index].finalPrice = parseFloat(newPrice) || 0;
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleUpdateItemQuantity = (index, newQuantity) => {
    const item = formData.items[index];
    const product = products.find(p => p.id === item.productId);
    
    if (product && !isCreating && bill) {
      // For bill updates, check available stock (current + original quantity)
      const originalItem = bill.items.find(i => i.productId === item.productId);
      const availableStock = originalItem ? product.stock + originalItem.quantity : product.stock;
      
      if (parseInt(newQuantity) > availableStock) {
        alert(`Insufficient stock. Available: ${availableStock}`);
        return;
      }
    } else if (product && isCreating) {
      // For new bills, check current stock
      if (parseInt(newQuantity) > product.stock) {
        alert(`Insufficient stock. Available: ${product.stock}`);
        return;
      }
    }
    
    const updatedItems = [...formData.items];
    updatedItems[index].quantity = parseInt(newQuantity) || 0;
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleSave = () => {
    if (!formData.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (!formData.date) {
      alert('Please select a bill date');
      return;
    }

    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    // Validate stock availability for bill updates
    if (!isCreating && bill) {
      for (const item of formData.items) {
        const product = products.find(p => p.id === item.productId);
        const originalItem = bill.items.find(i => i.productId === item.productId);
        
        if (product && originalItem) {
          // Calculate available stock (current stock + original quantity)
          const availableStock = product.stock + originalItem.quantity;
          
          if (item.quantity > availableStock) {
            alert(`Insufficient stock for ${item.productName}. Available: ${availableStock}, Required: ${item.quantity}`);
            return;
          }
        } else if (product && !originalItem) {
          // New item added to existing bill
          if (item.quantity > product.stock) {
            alert(`Insufficient stock for ${item.productName}. Available: ${product.stock}, Required: ${item.quantity}`);
            return;
          }
        }
      }
    }

    onSave(formData);
  };

  const availableProducts = products.filter(product => product.stock > 0);
  
  // Filter products based on search
  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.id.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content bill-modal">
        <div className="modal-header">
          <h2>{isCreating ? 'Create New Bill' : `Edit Bill ${bill?.id}`}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Customer Information */}
          <div className="form-section">
            <h3>Bill Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <User className="label-icon" />
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="form-input"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <Calendar className="label-icon" />
                  Bill Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Add Items */}
          <div className="form-section">
            <h3>Add Items</h3>
            <div className="add-item-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product</label>
                  <div className="searchable-select" ref={dropdownRef}>
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductDropdown(true);
                        setSelectedProduct('');
                      }}
                      onFocus={() => setShowProductDropdown(true)}
                      className="form-input"
                      placeholder="Search products by name, ID, or category..."
                    />
                    {showProductDropdown && (
                      <div className="dropdown-menu">
                        {filteredProducts.length === 0 ? (
                          <div className="dropdown-item no-results">
                            No products found
                          </div>
                        ) : (
                          filteredProducts.slice(0, 10).map(product => (
                            <div
                              key={product.id}
                              className="dropdown-item"
                              onClick={() => {
                                setSelectedProduct(product.id);
                                setProductSearch(`${product.name} (${product.id})`);
                                setShowProductDropdown(false);
                              }}
                            >
                              <div className="product-option">
                                <div className="product-main">
                                  <span className="product-name">{product.name}</span>
                                  <span className="product-id">({product.id})</span>
                                </div>
                                <div className="product-details">
                                  <span className="product-category">{product.category}</span>
                                  <span className="product-stock">Stock: {product.stock}</span>
                                  <span className="product-price">₹{product.sellingPrice}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        {filteredProducts.length > 10 && (
                          <div className="dropdown-item more-results">
                            {filteredProducts.length - 10} more products... (refine search)
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="form-input"
                    min="1"
                  />
                </div>
              </div>

              <div className="custom-price-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={useCustomPrice}
                    onChange={(e) => setUseCustomPrice(e.target.checked)}
                  />
                  Use Custom Price
                </label>
                
                {useCustomPrice && (
                  <div className="form-group">
                    <label className="form-label">Custom Price</label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="form-input"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              <button onClick={handleAddItem} className="btn btn-primary add-item-btn">
                <Plus size={16} />
                Add Item
              </button>
            </div>
          </div>

          {/* Bill Items */}
          <div className="form-section">
            <h3>Bill Items</h3>
            {formData.items.length === 0 ? (
              <div className="no-items">
                <Package className="no-items-icon" />
                <p>No items added yet</p>
              </div>
            ) : (
              <div className="items-table-container">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Default Price</th>
                      <th>Final Price</th>
                      <th>Subtotal</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItemQuantity(index, e.target.value)}
                            className="quantity-input"
                            min="1"
                          />
                        </td>
                        <td>₹{item.defaultPrice.toFixed(2)}</td>
                        <td>
                          <input
                            type="number"
                            value={item.finalPrice}
                            onChange={(e) => handleUpdateItemPrice(index, e.target.value)}
                            className="price-input"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="subtotal">
                          ₹{(item.quantity * item.finalPrice).toFixed(2)}
                        </td>
                        <td>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="btn-icon btn-delete"
                            title="Remove Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="bill-total">
            <div className="total-row">
              <span className="total-label">Total Amount:</span>
              <span className="total-amount">₹{formData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            {isCreating ? 'Create Bill' : 'Update Bill'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillModal;