import { useState, useEffect } from "react";
import {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  disableCategory,
} from "../services/api";
import "./CategoryManager.css";

export const CategoryManager = ({ initialEditId = null, openForm = false }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    url: "",
    countryLang: "default",
    title: "",
  });

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Open form if requested via props (e.g., /categories/create)
  useEffect(() => {
    if (openForm) {
      setShowForm(true);
    }
  }, [openForm]);

  // If an initial edit id is provided, set the editingCategory once categories are loaded
  useEffect(() => {
    if (initialEditId && categories.length > 0) {
      const cat = categories.find((c) => c._id === initialEditId);
      if (cat) {
        setEditingCategory(cat);
        setFormData({
          url: cat.url,
          countryLang: cat.countryLang,
          title: cat.title,
        });
        setShowForm(true);
      }
    }
  }, [initialEditId, categories]);

  const fetchCategories = async () => {
    setListLoading(true);
    setError("");

    try {
      const response = await getAllCategoriesAdmin();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch categories.");
    } finally {
      setListLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      url: "",
      countryLang: "default",
      title: "",
    });
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      url: category.url,
      countryLang: category.countryLang,
      title: category.title,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (editingCategory) {
        // Update category
        await updateCategory(editingCategory._id, {
          title: formData.title,
        });
        setSuccess("Category updated successfully!");
      } else {
        // Create new category
        await createCategory(formData);
        setSuccess("Category created successfully!");
      }

      // Refresh category list
      await fetchCategories();

      // Reset form
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (category) => {
    if (category.isActive) {
      if (!window.confirm("Are you sure you want to disable this category?")) {
        return;
      }
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await disableCategory(category._id);
      setSuccess("Category disabled successfully!");

      // Refresh category list
      await fetchCategories();
    } catch (err) {
      setError(err.message || "Failed to update category status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-manager-container">
      <div className="manager-header">
        <h2>Category Management</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="add-button">
            + Add New Category
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-header">
            <h3>{editingCategory ? "Edit Category" : "Create New Category"}</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="url">Category URL (Slug) *</label>
              <input
                id="url"
                type="text"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                required
                placeholder="e.g., faucets"
                disabled={editingCategory || loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="countryLang">Country/Language *</label>
              <select
                id="countryLang"
                name="countryLang"
                value={formData.countryLang}
                onChange={handleInputChange}
                required
                disabled={editingCategory || loading}
              >
                <option value="default">Main</option>
                <option value="en-ae">English (UAE)</option>
                <option value="en-us">English (US)</option>
                <option value="en-my">English (Malaysia)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title">Category Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Bathroom Faucets"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-button">
              {loading
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Create Category"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="categories-section">
        <h3>All Categories ({categories.length})</h3>

        {listLoading ? (
          <div className="loading">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <p>
              No categories found. Create your first category to get started.
            </p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category._id}
                className={`category-card ${!category.isActive ? "disabled" : ""}`}
              >
                <div className="card-header">
                  <div className="card-title-section">
                    <h4 className="category-title">{category.title}</h4>
                    <p className="category-url">{category.url}</p>
                  </div>
                  <span
                    className={`status-badge ${category.isActive ? "active" : "inactive"}`}
                  >
                    {category.isActive ? "Active" : "Disabled"}
                  </span>
                </div>

                <div className="card-body">
                  <div className="category-info-row">
                    <span className="info-label">Region:</span>
                    <span className="info-value">{category.countryLang}</span>
                  </div>
                  <div className="category-info-row">
                    <span className="info-label">Created:</span>
                    <span className="info-value">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(category)}
                    className="action-button edit-btn"
                    title="Edit category"
                    disabled={loading}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(category)}
                    disabled={loading}
                    className={`action-button ${category.isActive ? "disable-btn" : "enable-btn"}`}
                    title={
                      category.isActive
                        ? "Disable category"
                        : "Enable category"
                    }
                  >
                    {category.isActive ? "🚫 Disable" : "✓ Enable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!showForm && categories.length > 0 && (
        <div className="info-box">
          <p>
            💡 Click "Edit" to modify category details or "Disable" to remove
            from selection.
          </p>
        </div>
      )}
    </div>
  );
};
