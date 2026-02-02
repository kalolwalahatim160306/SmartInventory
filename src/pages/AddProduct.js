import React, { useState } from 'react';
import { Plus, Package, DollarSign, Hash, Tag, User, Calendar } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import './AddProduct.css';

function AddProduct() {
  const { addProduct, categories, addCategory } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    costPrice: '',
    sellingPrice: '',
    stock: '',
    supplier: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = 'Valid cost price is required';
    }
    
    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Valid selling price is required';
    }
    
    if (parseFloat(formData.sellingPrice) <= parseFloat(formData.costPrice)) {
      newErrors.sellingPrice = 'Selling price must be higher than cost price';
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        stock: parseInt(formData.stock),
        supplier: formData.supplier.trim()
      };
      
      addProduct(productData);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        costPrice: '',
        sellingPrice: '',
        stock: '',
        supplier: ''
      });
      
      alert('Product added successfully!');
    } catch (error) {
      alert('Error adding product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      costPrice: '',
      sellingPrice: '',
      stock: '',
      supplier: ''
    });
    setErrors({});
  };

  return (
    <div className="add-product">
      <div className="add-product-header">
        <h1>Add New Product</h1>
        <p>Add products to your inventory with detailed information</p>
      </div>

      <div className="add-product-container">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label className="form-label">
                <Package className="label-icon" />
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Tag className="label-icon" />
                Category *
              </label>
              <div className="category-input-group">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                  className="btn btn-secondary add-category-btn"
                >
                  <Plus size={16} />
                </button>
              </div>
              {errors.category && <span className="error-message">{errors.category}</span>}
              
              {showNewCategory && (
                <div className="new-category-input">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash className="label-icon" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Enter product description"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing & Stock</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <DollarSign className="label-icon" />
                  Cost Price *
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  className={`form-input ${errors.costPrice ? 'error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.costPrice && <span className="error-message">{errors.costPrice}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <DollarSign className="label-icon" />
                  Selling Price *
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  className={`form-input ${errors.sellingPrice ? 'error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.sellingPrice && <span className="error-message">{errors.sellingPrice}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Package className="label-icon" />
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={`form-input ${errors.stock ? 'error' : ''}`}
                  placeholder="0"
                  min="0"
                />
                {errors.stock && <span className="error-message">{errors.stock}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User className="label-icon" />
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter supplier name"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Product...' : 'Save Product'}
            </button>
          </div>
        </form>

        <div className="form-preview">
          <h3>Product Preview</h3>
          <div className="preview-card">
            <div className="preview-header">
              <h4>{formData.name || 'Product Name'}</h4>
              <span className="preview-category">{formData.category || 'Category'}</span>
            </div>
            <p className="preview-description">
              {formData.description || 'Product description will appear here...'}
            </p>
            <div className="preview-details">
              <div className="preview-item">
                <span className="preview-label">Cost Price:</span>
                <span className="preview-value">₹{formData.costPrice || '0.00'}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Selling Price:</span>
                <span className="preview-value">₹{formData.sellingPrice || '0.00'}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Stock:</span>
                <span className="preview-value">{formData.stock || '0'} units</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Supplier:</span>
                <span className="preview-value">{formData.supplier || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;