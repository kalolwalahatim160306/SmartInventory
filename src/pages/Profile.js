import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Store, 
  MapPin, 
  Edit, 
  Save, 
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    storeName: user?.storeName || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = updateProfile({ ...user, ...formData });
      
      if (result.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      storeName: user?.storeName || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-title">
          <h1>Profile Settings</h1>
          <p>Manage your account and business information</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                <Edit size={16} />
                Edit Profile
              </button>
              <button onClick={handleLogout} className="btn btn-secondary logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleCancel} className="btn btn-secondary">
                <X size={16} />
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="btn btn-primary"
                disabled={isLoading}
              >
                <Save size={16} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-content">
        {/* All Information in One Card */}
        <div className="profile-section">
          <h3>Profile Information</h3>
          <div className="profile-card">
            {/* Personal Information */}
            <div className="info-section">
              <h4 className="section-subtitle">Personal Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <User className="label-icon" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <span className="error-message">{errors.name}</span>}
                    </>
                  ) : (
                    <div className="profile-value">{user?.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone className="label-icon" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </>
                  ) : (
                    <div className="profile-value">{user?.phone}</div>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <Mail className="label-icon" />
                  Email Address
                </label>
                <div className="profile-value email-readonly">
                  {user?.email}
                  <span className="readonly-note">(Cannot be changed)</span>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="info-section">
              <h4 className="section-subtitle">Business Details</h4>
              <div className="form-group full-width">
                <label className="form-label">
                  <Store className="label-icon" />
                  Store Name
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.storeName ? 'error' : ''}`}
                      placeholder="Enter your store name"
                    />
                    {errors.storeName && <span className="error-message">{errors.storeName}</span>}
                  </>
                ) : (
                  <div className="profile-value">{user?.storeName}</div>
                )}
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <MapPin className="label-icon" />
                  Address
                </label>
                {isEditing ? (
                  <>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`form-textarea ${errors.address ? 'error' : ''}`}
                      placeholder="Enter your complete address"
                      rows="3"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </>
                ) : (
                  <div className="profile-value">{user?.address}</div>
                )}
              </div>

              <div className="form-row three-cols">
                <div className="form-group">
                  <label className="form-label">City</label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`form-input ${errors.city ? 'error' : ''}`}
                        placeholder="Enter city"
                      />
                      {errors.city && <span className="error-message">{errors.city}</span>}
                    </>
                  ) : (
                    <div className="profile-value">{user?.city}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`form-input ${errors.state ? 'error' : ''}`}
                        placeholder="Enter state"
                      />
                      {errors.state && <span className="error-message">{errors.state}</span>}
                    </>
                  ) : (
                    <div className="profile-value">{user?.state}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`form-input ${errors.pincode ? 'error' : ''}`}
                        placeholder="Enter pincode"
                      />
                      {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                    </>
                  ) : (
                    <div className="profile-value">{user?.pincode}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="info-section">
              <h4 className="section-subtitle">Account Details</h4>
              <div className="account-info">
                <div className="info-item">
                  <span className="info-label">Account Created:</span>
                  <span className="info-value">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">User ID:</span>
                  <span className="info-value">{user?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;