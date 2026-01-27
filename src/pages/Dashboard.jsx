import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProductManager } from '../components/ProductManager';
import { CategoryManager } from '../components/CategoryManager';
import { FileUpload } from '../components/FileUpload';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h2>Dashboard</h2>
          <div className="nav-right">
            <span className="welcome-text">Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Products
        </button>
        <button
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          🏷️ Categories
        </button>
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload
        </button>
      </div>

      <main className="dashboard-content">
        {activeTab === 'dashboard' && (
          <>
            <div className="content-box">
              <h1>Welcome to your Dashboard</h1>
              
              <div className="user-info">
                <h2>User Information</h2>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
            </div>

            <div className="tiles-grid">
              <div className="tile" onClick={() => setActiveTab('products')}>
                <div className="tile-icon">📦</div>
                <h3>Product Management</h3>
                <p>Add, edit, and manage your products</p>
              </div>
              <div className="tile" onClick={() => setActiveTab('categories')}>
                <div className="tile-icon">🏷️</div>
                <h3>Category Management</h3>
                <p>Organize products into categories</p>
              </div>
              <div className="tile" onClick={() => setActiveTab('upload')}>
                <div className="tile-icon">📤</div>
                <h3>File Upload</h3>
                <p>Upload images to S3 storage</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && <ProductManager />}

        {activeTab === 'categories' && <CategoryManager />}

        {activeTab === 'upload' && <FileUpload />}
      </main>
    </div>
  );
};
