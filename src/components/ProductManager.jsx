import { useState, useEffect } from 'react';
import { createProduct, updateProduct, disableProduct, getAllProducts, enableProduct } from '../services/api';
import { ProductForm } from './ProductForm';
import './ProductManager.css';

export const ProductManager = ({ initialEditId = null, openForm = false }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // If openForm is requested (e.g., /products/create), show the form for creating
  useEffect(() => {
    if (openForm) {
      setEditingProduct(null);
      setShowForm(true);
    }
  }, [openForm]);

  // If an initial edit id is provided, open the form with that product once loaded
  useEffect(() => {
    if (initialEditId && products.length > 0) {
      const prod = products.find((p) => p._id === initialEditId);
      if (prod) {
        setEditingProduct(prod);
        setShowForm(true);
      }
    }
  }, [initialEditId, products]);

  const fetchProducts = async () => {
    setListLoading(true);
    setError('');

    try {
      const response = await getAllProducts();
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products.');
    } finally {
      setListLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleToggleStatus = async (product) => {
    if (product.isActive) {
      if (!window.confirm('Are you sure you want to disable this product?')) {
        return;
      }
    }

    if (!product.isActive) {
      if (!window.confirm('Are you sure you want to enable this product?')) {
        return;
      }
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (product.isActive) {
        // Disable product
        await disableProduct(product._id);
        setSuccess('Product disabled successfully!');
      } else {
        // Enable product - you'll need to implement an enable endpoint on the backend
        await enableProduct(product._id);
        setSuccess('Product enabled successfully!');
      }
      setLoading(false);
      
      // Refresh product list
      await fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to update product status.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingProduct(null);
    setSuccess('Product saved successfully!');
    await fetchProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="product-manager-container">
      <div className="manager-header">
        <h2>Product Management</h2>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="add-button"
          >
            + Add New Product
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <ProductForm
          editingProduct={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {!showForm && (
        <div className="products-section">
          <h3>All Products</h3>
          
          {listLoading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found. Create your first product to get started.</p>
            </div>
          ) : (
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Category</th>
                    <th>Heading</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className={!product.isActive ? 'disabled' : ''}>
                      <td className="url-cell">{product.slug}</td>
                      <td>{product.product?.category}</td>
                      <td className="heading-cell">{product.product?.name}</td>
                      <td>
                        <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                          {product.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEdit(product)}
                          className="action-button edit-btn"
                          title="Edit product"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(product)}
                          disabled={loading}
                          className={`action-button ${product.isActive ? 'disable-btn' : 'enable-btn'}`}
                          title={product.isActive ? 'Disable product' : 'Enable product'}
                        >
                          {product.isActive ? '🚫 Disable' : '✓ Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!showForm && products.length > 0 && (
        <div className="info-box">
          <p>💡 Click "Edit" to modify all product details or "Disable" to hide from the public.</p>
        </div>
      )}
    </div>
  );
};
