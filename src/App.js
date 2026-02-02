import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import LearnMore from './pages/LearnMore';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import SearchProduct from './pages/SearchProduct';
import Bills from './pages/Bills';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { InventoryProvider } from './context/InventoryContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Public Route Component (redirect to dashboard if authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function AppContent() {
  return (
    <div className="App">
      <Routes>
        {/* Landing Page - Public Route */}
        <Route path="/" element={<Landing />} />
        <Route path="/learn-more" element={<LearnMore />} />

        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <InventoryProvider>
              <Layout>
                <Dashboard />
              </Layout>
            </InventoryProvider>
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute>
            <InventoryProvider>
              <Layout>
                <Inventory />
              </Layout>
            </InventoryProvider>
          </ProtectedRoute>
        } />
        <Route path="/add-product" element={
          <ProtectedRoute>
            <InventoryProvider>
              <Layout>
                <AddProduct />
              </Layout>
            </InventoryProvider>
          </ProtectedRoute>
        } />
        <Route path="/search-product" element={
          <ProtectedRoute>
            <InventoryProvider>
              <Layout>
                <SearchProduct />
              </Layout>
            </InventoryProvider>
          </ProtectedRoute>
        } />
        <Route path="/bills" element={
          <ProtectedRoute>
            <InventoryProvider>
              <Layout>
                <Bills />
              </Layout>
            </InventoryProvider>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;