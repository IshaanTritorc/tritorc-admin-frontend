import { useState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getAllCategories,
} from "../services/api";
import { FileUpload } from "./FileUpload";
import "./ProductForm.css";

export const ProductForm = ({ onSuccess, onCancel, editingProduct = null }) => {
  const [formData, setFormData] = useState({
    slug: "",
    isActive: true,
    countryLang: "default",
    product: {
      id: "",
      name: "",
      category: "",
      type: "",
      tagline: "",
      description: "",
      heroImage: "",
      quickSpecs: [],
      documents: [],
      stats: [],
    },
    features: {
      mainFeatures: [],
      detailedFeatures: [],
    },
    media: {
      video: {
        type: "video",
        title: "",
        thumbnail: "",
        videoUrl: "",
      },
      images: [],
    },
    accessories: [],
    relatedProducts: [],
    caseStudies: [],
    technicalSpecifications: {
      models: [],
      generalTechnicalDrawing: "",
      technicalData: {},
      dimensionalData: {},
    },
    faqs: [],
    industries: [],
    contact: {
      sales: { title: "Sales Inquiries", phone: "", email: "" },
      support: { title: "Technical Support", availability: "", email: "" },
      officeHours: {
        title: "Office Hours",
        weekdays: "",
        weekends: "",
        email: "",
      },
      industryOptions: [],
    },
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    productInfo: false,
    quickSpecs: false,
    documents: false,
    stats: false,
    mainFeatures: false,
    detailedFeatures: false,
    media: false,
    accessories: false,
    relatedProducts: false,
    caseStudies: false,
    technicalSpecs: false,
    faqs: false,
    industries: false,
    contact: false,
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
    if (editingProduct) {
      setFormData(editingProduct);
    }
  }, [editingProduct]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await getAllCategories();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBasicInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        [name]: value,
      },
    }));
  };

  // Generic array handlers with dynamic keys
  const addArrayItem = (path, defaultItem) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newFormData = JSON.parse(JSON.stringify(prev));
      let current = newFormData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      if (!Array.isArray(current[lastKey])) {
        current[lastKey] = [];
      }
      current[lastKey].push(defaultItem);

      return newFormData;
    });
  };

  const updateArrayItem = (path, index, field, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newFormData = JSON.parse(JSON.stringify(prev));
      let current = newFormData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      if (current[lastKey][index]) {
        current[lastKey][index][field] = value;
      }

      return newFormData;
    });
  };

  const removeArrayItem = (path, index) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newFormData = JSON.parse(JSON.stringify(prev));
      let current = newFormData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      current[lastKey] = current[lastKey].filter((_, i) => i !== index);

      return newFormData;
    });
  };

  // Quick Specs handlers
  const addQuickSpec = () => {
    addArrayItem("product.quickSpecs", { value: "", unit: "", label: "" });
  };

  // Documents handlers
  const addDocument = () => {
    addArrayItem("product.documents", { title: "", url: "" });
  };

  // Stats handlers
  const addStat = () => {
    addArrayItem("product.stats", { title: "", description: "" });
  };

  // Main Features handlers
  const addMainFeature = () => {
    addArrayItem("features.mainFeatures", {
      title: "",
      description: "",
      image: "",
    });
  };

  // Detailed Features handlers
  const addDetailedFeature = () => {
    addArrayItem("features.detailedFeatures", { title: "", description: "" });
  };

  // Media Images handlers
  const addMediaImage = () => {
    addArrayItem("media.images", { title: "", description: "", image: "" });
  };

  // Accessories handlers
  const addAccessory = () => {
    addArrayItem("accessories", {
      id: Date.now(),
      name: "",
      slug: "",
      category: "",
      description: "",
      image: "",
      price: "",
      originalPrice: "",
      badge: "",
      features: [],
    });
  };

  const addAccessoryFeature = (index) => {
    setFormData((prev) => {
      const newFormData = JSON.parse(JSON.stringify(prev));
      newFormData.accessories[index].features.push("");
      return newFormData;
    });
  };

  const updateAccessoryFeature = (index, featureIndex, value) => {
    setFormData((prev) => {
      const newFormData = JSON.parse(JSON.stringify(prev));
      newFormData.accessories[index].features[featureIndex] = value;
      return newFormData;
    });
  };

  const removeAccessoryFeature = (index, featureIndex) => {
    setFormData((prev) => {
      const newFormData = JSON.parse(JSON.stringify(prev));
      newFormData.accessories[index].features = newFormData.accessories[
        index
      ].features.filter((_, i) => i !== featureIndex);
      return newFormData;
    });
  };

  // Related Products handlers
  const addRelatedProduct = () => {
    addArrayItem("relatedProducts", {
      name: "",
      tagline: "",
      range: "",
      image: "",
      link: "",
    });
  };

  // Case Studies handlers
  const addCaseStudy = () => {
    addArrayItem("caseStudies", {
      title: "",
      industry: "",
      result: "",
      description: "",
      image: "",
      link: "",
    });
  };

  // Technical Specs handlers
  const addModel = () => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        models: [...prev.technicalSpecifications.models, ""],
      },
    }));
  };

  const updateModel = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        models: prev.technicalSpecifications.models.map((m, i) =>
          i === index ? value : m,
        ),
      },
    }));
  };

  const removeModel = (index) => {
    setFormData((prev) => {
      const modelToRemove = prev.technicalSpecifications.models[index];
      const newFormData = {
        ...prev,
        technicalSpecifications: {
          ...prev.technicalSpecifications,
          models: prev.technicalSpecifications.models.filter(
            (_, i) => i !== index,
          ),
        },
      };
      
      // Also remove technical and dimensional data for this model
      if (modelToRemove) {
        const newTechData = { ...newFormData.technicalSpecifications.technicalData };
        const newDimData = { ...newFormData.technicalSpecifications.dimensionalData };
        delete newTechData[modelToRemove];
        delete newDimData[modelToRemove];
        newFormData.technicalSpecifications.technicalData = newTechData;
        newFormData.technicalSpecifications.dimensionalData = newDimData;
      }
      
      return newFormData;
    });
  };

  // Technical Data handlers
  const addTechnicalDataField = (modelName) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        technicalData: {
          ...prev.technicalSpecifications.technicalData,
          [modelName]: {
            ...prev.technicalSpecifications.technicalData[modelName],
            [Date.now()]: { name: '', metric: '', imperial: '' }
          }
        }
      }
    }));
  };

  const updateTechnicalDataField = (modelName, fieldKey, fieldName, metricValue, imperialValue) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        technicalData: {
          ...prev.technicalSpecifications.technicalData,
          [modelName]: {
            ...prev.technicalSpecifications.technicalData[modelName],
            [fieldKey]: { name: fieldName, metric: metricValue, imperial: imperialValue }
          }
        }
      }
    }));
  };

  const removeTechnicalDataField = (modelName, fieldKey) => {
    setFormData((prev) => {
      const newTechData = { ...prev.technicalSpecifications.technicalData[modelName] };
      delete newTechData[fieldKey];
      return {
        ...prev,
        technicalSpecifications: {
          ...prev.technicalSpecifications,
          technicalData: {
            ...prev.technicalSpecifications.technicalData,
            [modelName]: newTechData
          }
        }
      };
    });
  };

  // Dimensional Data handlers
  const addDimensionalDataField = (modelName) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        dimensionalData: {
          ...prev.technicalSpecifications.dimensionalData,
          [modelName]: {
            ...prev.technicalSpecifications.dimensionalData[modelName],
            [Date.now()]: { name: '', metric: '', imperial: '' }
          }
        }
      }
    }));
  };

  const updateDimensionalDataField = (modelName, fieldKey, fieldName, metricValue, imperialValue) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        dimensionalData: {
          ...prev.technicalSpecifications.dimensionalData,
          [modelName]: {
            ...prev.technicalSpecifications.dimensionalData[modelName],
            [fieldKey]: { name: fieldName, metric: metricValue, imperial: imperialValue }
          }
        }
      }
    }));
  };

  const removeDimensionalDataField = (modelName, fieldKey) => {
    setFormData((prev) => {
      const newDimData = { ...prev.technicalSpecifications.dimensionalData[modelName] };
      delete newDimData[fieldKey];
      return {
        ...prev,
        technicalSpecifications: {
          ...prev.technicalSpecifications,
          dimensionalData: {
            ...prev.technicalSpecifications.dimensionalData,
            [modelName]: newDimData
          }
        }
      };
    });
  };

  // FAQs handlers
  const addFaq = () => {
    addArrayItem("faqs", { question: "", answer: "" });
  };

  // Industries handlers
  const addIndustry = () => {
    addArrayItem("industries", {
      name: "",
      slug: "",
      category: "",
      shortDesc: "",
      image: "",
      description: "",
      features: [],
      stats: [],
    });
  };

  const addIndustryFeature = (index) => {
    setFormData((prev) => {
      const newFormData = JSON.parse(JSON.stringify(prev));
      newFormData.industries[index].features.push("");
      return newFormData;
    });
  };

  const updateIndustryFeature = (index, featureIndex, value) => {
    setFormData((prev) => {
      const newFormData = JSON.parse(JSON.stringify(prev));
      newFormData.industries[index].features[featureIndex] = value;
      return newFormData;
    });
  };

  const removeIndustryFeature = (index, featureIndex) => {
    setFormData((prev) => {
      const newFormData = JSON.parse(JSON.stringify(prev));
      newFormData.industries[index].features = newFormData.industries[
        index
      ].features.filter((_, i) => i !== featureIndex);
      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        setSuccess("Product updated successfully!");
      } else {
        await createProduct(formData);
        setSuccess("Product created successfully!");
      }

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{editingProduct ? "Edit Product" : "Create New Product"}</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="product-form-large">
        {/* SLUG & BASIC SETTINGS */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("basic")}
          >
            <span className="section-icon">
              {expandedSections.basic ? "▼" : "▶"}
            </span>
            <h3>Slug & Basic Settings</h3>
          </button>

          {expandedSections.basic && (
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="slug">Product Slug *</label>
                  <input
                    id="slug"
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleBasicInputChange}
                    required
                    placeholder="e.g., square-drive-hydraulic-torque-wrench-tsl-series"
                    disabled={editingProduct}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  {categoriesLoading ? (
                    <div style={{ padding: "8px", color: "#666" }}>
                      Loading categories...
                    </div>
                  ) : (
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleBasicInputChange}
                      required
                    >
                      <option value="">-- Select a Category --</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.title} ({cat.countryLang})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="countryLang">Country/Language *</label>
                  <select
                    id="countryLang"
                    name="countryLang"
                    value={formData.countryLang}
                    onChange={handleBasicInputChange}
                    required
                    disabled={editingProduct}
                  >
                    <option value="default">Main</option>
                    <option value="en-ae">English (UAE)</option>
                    <option value="en-us">English (US)</option>
                    <option value="en-my">English (Malaysia)</option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label htmlFor="isActive">
                    <input
                      id="isActive"
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleBasicInputChange}
                    />
                    Active Product
                  </label>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* PRODUCT INFORMATION */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("productInfo")}
          >
            <span className="section-icon">
              {expandedSections.productInfo ? "▼" : "▶"}
            </span>
            <h3>Product Information</h3>
          </button>

          {expandedSections.productInfo && (
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="product-id">Product ID *</label>
                  <input
                    id="product-id"
                    type="text"
                    name="id"
                    value={formData.product.id}
                    onChange={handleProductInputChange}
                    required
                    placeholder="e.g., tsl-series"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product-name">Product Name *</label>
                  <input
                    id="product-name"
                    type="text"
                    name="name"
                    value={formData.product.name}
                    onChange={handleProductInputChange}
                    required
                    placeholder="e.g., TSL Series"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product-category">Category *</label>
                  <input
                    id="product-category"
                    type="text"
                    name="category"
                    value={formData.product.category}
                    onChange={handleProductInputChange}
                    required
                    placeholder="e.g., Hydraulic Torque Wrenches"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product-type">Product Type *</label>
                  <input
                    id="product-type"
                    type="text"
                    name="type"
                    value={formData.product.type}
                    onChange={handleProductInputChange}
                    required
                    placeholder="e.g., Square Drive Type"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="product-tagline">Tagline *</label>
                  <input
                    id="product-tagline"
                    type="text"
                    name="tagline"
                    value={formData.product.tagline}
                    onChange={handleProductInputChange}
                    required
                    placeholder="e.g., Purpose-built to meet high-torque demands"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="product-description">Description *</label>
                  <textarea
                    id="product-description"
                    name="description"
                    value={formData.product.description}
                    onChange={handleProductInputChange}
                    required
                    placeholder="Product description"
                    rows="4"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="hero-image">Hero Image URL</label>
                  <FileUpload
                    compact={true}
                    label="Upload Hero Image"
                    onUploadComplete={(fileData) => {
                      setFormData((prev) => ({
                        ...prev,
                        product: { ...prev.product, heroImage: fileData.url },
                      }));
                    }}
                  />
                  <div
                    style={{
                      marginTop: "8px",
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    Current:{" "}
                    {formData.product.heroImage && (
                      <span>{formData.product.heroImage}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* QUICK SPECS */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("quickSpecs")}
          >
            <span className="section-icon">
              {expandedSections.quickSpecs ? "▼" : "▶"}
            </span>
            <h3>Quick Specs ({formData.product.quickSpecs.length})</h3>
          </button>

          {expandedSections.quickSpecs && (
            <div className="section-content">
              {formData.product.quickSpecs.map((spec, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Spec {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("product.quickSpecs", index)
                      }
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Value</label>
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) =>
                          updateArrayItem(
                            "product.quickSpecs",
                            index,
                            "value",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., 205-1,359"
                      />
                    </div>
                    <div className="form-group">
                      <label>Unit</label>
                      <input
                        type="text"
                        value={spec.unit}
                        onChange={(e) =>
                          updateArrayItem(
                            "product.quickSpecs",
                            index,
                            "unit",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., ft-lbs"
                      />
                    </div>
                    <div className="form-group">
                      <label>Label</label>
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) =>
                          updateArrayItem(
                            "product.quickSpecs",
                            index,
                            "label",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Torque Range"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuickSpec}
                className="add-item-button"
              >
                + Add Quick Spec
              </button>
            </div>
          )}
        </section>

        {/* DOCUMENTS */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("documents")}
          >
            <span className="section-icon">
              {expandedSections.documents ? "▼" : "▶"}
            </span>
            <h3>Documents ({formData.product.documents.length})</h3>
          </button>

          {expandedSections.documents && (
            <div className="section-content">
              {formData.product.documents.map((doc, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Document {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("product.documents", index)
                      }
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={doc.title}
                        onChange={(e) =>
                          updateArrayItem(
                            "product.documents",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Product Specification"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Document URL</label>
                      <FileUpload
                        compact={true}
                        label="Upload Document (PDF)"
                        onUploadComplete={(fileData) => {
                          updateArrayItem(
                            "product.documents",
                            index,
                            "url",
                            fileData.url,
                          );
                        }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        Current: {doc.url && <span>{doc.url}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addDocument}
                className="add-item-button"
              >
                + Add Document
              </button>
            </div>
          )}
        </section>

        {/* STATS */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("stats")}
          >
            <span className="section-icon">
              {expandedSections.stats ? "▼" : "▶"}
            </span>
            <h3>Stats ({formData.product.stats.length})</h3>
          </button>

          {expandedSections.stats && (
            <div className="section-content">
              {formData.product.stats.map((stat, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Stat {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("product.stats", index)}
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={stat.title}
                        onChange={(e) =>
                          updateArrayItem(
                            "product.stats",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Industry Leading"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={stat.description}
                        onChange={(e) =>
                          updateArrayItem(
                            "product.stats",
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Multiple reaction modes"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addStat}
                className="add-item-button"
              >
                + Add Stat
              </button>
            </div>
          )}
        </section>

        {/* MAIN FEATURES */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("mainFeatures")}
          >
            <span className="section-icon">
              {expandedSections.mainFeatures ? "▼" : "▶"}
            </span>
            <h3>Main Features ({formData.features.mainFeatures.length})</h3>
          </button>

          {expandedSections.mainFeatures && (
            <div className="section-content">
              {formData.features.mainFeatures.map((feature, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Feature {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("features.mainFeatures", index)
                      }
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) =>
                          updateArrayItem(
                            "features.mainFeatures",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Feature title"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={feature.description}
                        onChange={(e) =>
                          updateArrayItem(
                            "features.mainFeatures",
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Feature description"
                        rows="2"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Feature Image</label>
                      <FileUpload
                        compact={true}
                        label="Upload Feature Image"
                        onUploadComplete={(fileData) => {
                          updateArrayItem(
                            "features.mainFeatures",
                            index,
                            "image",
                            fileData.url,
                          );
                        }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        Current: {feature.image && <span>{feature.image}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMainFeature}
                className="add-item-button"
              >
                + Add Main Feature
              </button>
            </div>
          )}
        </section>

        {/* DETAILED FEATURES */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("detailedFeatures")}
          >
            <span className="section-icon">
              {expandedSections.detailedFeatures ? "▼" : "▶"}
            </span>
            <h3>
              Detailed Features ({formData.features.detailedFeatures.length})
            </h3>
          </button>

          {expandedSections.detailedFeatures && (
            <div className="section-content">
              {formData.features.detailedFeatures.map((feature, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Detail {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("features.detailedFeatures", index)
                      }
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) =>
                          updateArrayItem(
                            "features.detailedFeatures",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Feature title"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={feature.description}
                        onChange={(e) =>
                          updateArrayItem(
                            "features.detailedFeatures",
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Detailed description"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addDetailedFeature}
                className="add-item-button"
              >
                + Add Detailed Feature
              </button>
            </div>
          )}
        </section>

        {/* MEDIA */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("media")}
          >
            <span className="section-icon">
              {expandedSections.media ? "▼" : "▶"}
            </span>
            <h3>Media (Video & Images)</h3>
          </button>

          {expandedSections.media && (
            <div className="section-content">
              {/* Video Section */}
              <div className="nested-item">
                <h4>Video</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Video Title</label>
                    <input
                      type="text"
                      value={formData.media.video.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          media: {
                            ...prev.media,
                            video: {
                              ...prev.media.video,
                              title: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="e.g., TSL in Action"
                    />
                  </div>
                  <div className="form-group">
                    <label>Video Type</label>
                    <select
                      value={formData.media.video.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          media: {
                            ...prev.media,
                            video: {
                              ...prev.media.video,
                              type: e.target.value,
                            },
                          },
                        }))
                      }
                    >
                      <option value="video">Video</option>
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Thumbnail URL</label>
                    <FileUpload
                      compact={true}
                      label="Upload Thumbnail"
                      onUploadComplete={(fileData) => {
                        setFormData((prev) => ({
                          ...prev,
                          media: {
                            ...prev.media,
                            video: {
                              ...prev.media.video,
                              thumbnail: fileData.url,
                            },
                          },
                        }));
                      }}
                    />
                    <div
                      style={{
                        marginTop: "8px",
                        color: "#666",
                        fontSize: "12px",
                      }}
                    >
                      Current:{" "}
                      {formData.media.video.thumbnail && (
                        <span>{formData.media.video.thumbnail}</span>
                      )}
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>Video URL</label>
                    <input
                      type="text"
                      value={formData.media.video.videoUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          media: {
                            ...prev.media,
                            video: {
                              ...prev.media.video,
                              videoUrl: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div style={{ marginTop: "24px" }}>
                <h4>Media Images ({formData.media.images.length})</h4>
                {formData.media.images.map((image, index) => (
                  <div key={index} className="nested-item">
                    <div className="nested-item-header">
                      <h5>Image {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("media.images", index)}
                        className="remove-button"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={image.title}
                          onChange={(e) =>
                            updateArrayItem(
                              "media.images",
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="Image title"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Description</label>
                        <textarea
                          value={image.description}
                          onChange={(e) =>
                            updateArrayItem(
                              "media.images",
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Image description"
                          rows="2"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Image</label>
                        <FileUpload
                          compact={true}
                          label="Upload Image"
                          onUploadComplete={(fileData) => {
                            updateArrayItem(
                              "media.images",
                              index,
                              "image",
                              fileData.url,
                            );
                          }}
                        />
                        <div
                          style={{
                            marginTop: "8px",
                            color: "#666",
                            fontSize: "12px",
                          }}
                        >
                          Current: {image.image && <span>{image.image}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMediaImage}
                  className="add-item-button"
                >
                  + Add Media Image
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ACCESSORIES */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("accessories")}
          >
            <span className="section-icon">
              {expandedSections.accessories ? "▼" : "▶"}
            </span>
            <h3>Accessories ({formData.accessories.length})</h3>
          </button>

          {expandedSections.accessories && (
            <div className="section-content">
              {formData.accessories.map((accessory, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>
                      Accessory {index + 1}: {accessory.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("accessories", index)}
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={accessory.name}
                        onChange={(e) =>
                          updateArrayItem(
                            "accessories",
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Calibration Certificate"
                      />
                    </div>
                    <div className="form-group">
                      <label>Slug</label>
                      <input
                        type="text"
                        value={accessory.slug}
                        onChange={(e) =>
                          updateArrayItem(
                            "accessories",
                            index,
                            "slug",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., calibration-certificate"
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input
                        type="text"
                        value={accessory.category}
                        onChange={(e) =>
                          updateArrayItem(
                            "accessories",
                            index,
                            "category",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Documentation"
                      />
                    </div>
                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="text"
                        value={accessory.price}
                        onChange={(e) =>
                          updateArrayItem(
                            "accessories",
                            index,
                            "price",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., $250"
                      />
                    </div>
                    <div className="form-group">
                      <label>Original Price</label>
                      <input
                        type="text"
                        value={accessory.originalPrice}
                        onChange={(e) =>
                          updateArrayItem(
                            "accessories",
                            index,
                            "originalPrice",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., $300"
                      />
                    </div>
                    <div className="form-group">
                      <label>Badge</label>
                      <input
                        type="text"
                        value={accessory.badge}
                        onChange={(e) =>
                          updateArrayItem(
                            "accessories",
                            index,
                            "badge",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Required"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={accessory.description}
                        onChange={(e) =>
                          updateArrayItem(
                            "accessories",
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Accessory description"
                        rows="2"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Image</label>
                      <FileUpload
                        compact={true}
                        label="Upload Image"
                        onUploadComplete={(fileData) => {
                          updateArrayItem(
                            "accessories",
                            index,
                            "image",
                            fileData.url,
                          );
                        }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        Current:{" "}
                        {accessory.image && <span>{accessory.image}</span>}
                      </div>
                    </div>

                    {/* Features for Accessory */}
                    <div
                      className="form-group full-width"
                      style={{ marginTop: "12px" }}
                    >
                      <label>Features</label>
                      {accessory.features?.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="feature-item"
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "8px",
                          }}
                        >
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) =>
                              updateAccessoryFeature(
                                index,
                                featureIndex,
                                e.target.value,
                              )
                            }
                            placeholder="Feature description"
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeAccessoryFeature(index, featureIndex)
                            }
                            className="remove-button"
                            style={{ width: "40px" }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addAccessoryFeature(index)}
                        className="add-spec-button"
                      >
                        + Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addAccessory}
                className="add-item-button"
              >
                + Add Accessory
              </button>
            </div>
          )}
        </section>

        {/* RELATED PRODUCTS */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("relatedProducts")}
          >
            <span className="section-icon">
              {expandedSections.relatedProducts ? "▼" : "▶"}
            </span>
            <h3>Related Products ({formData.relatedProducts.length})</h3>
          </button>

          {expandedSections.relatedProducts && (
            <div className="section-content">
              {formData.relatedProducts.map((product, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>
                      Product {index + 1}: {product.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("relatedProducts", index)}
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) =>
                          updateArrayItem(
                            "relatedProducts",
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., MXT"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tagline</label>
                      <input
                        type="text"
                        value={product.tagline}
                        onChange={(e) =>
                          updateArrayItem(
                            "relatedProducts",
                            index,
                            "tagline",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Hydraulic Torque Wrench"
                      />
                    </div>
                    <div className="form-group">
                      <label>Range</label>
                      <input
                        type="text"
                        value={product.range}
                        onChange={(e) =>
                          updateArrayItem(
                            "relatedProducts",
                            index,
                            "range",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., 118 - 37,100 ft-lbs"
                      />
                    </div>
                    <div className="form-group">
                      <label>Link</label>
                      <input
                        type="text"
                        value={product.link}
                        onChange={(e) =>
                          updateArrayItem(
                            "relatedProducts",
                            index,
                            "link",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., /mxt"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Image</label>
                      <FileUpload
                        compact={true}
                        label="Upload Product Image"
                        onUploadComplete={(fileData) => {
                          updateArrayItem(
                            "relatedProducts",
                            index,
                            "image",
                            fileData.url,
                          );
                        }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        Current: {product.image && <span>{product.image}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addRelatedProduct}
                className="add-item-button"
              >
                + Add Related Product
              </button>
            </div>
          )}
        </section>

        {/* CASE STUDIES */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("caseStudies")}
          >
            <span className="section-icon">
              {expandedSections.caseStudies ? "▼" : "▶"}
            </span>
            <h3>Case Studies ({formData.caseStudies.length})</h3>
          </button>

          {expandedSections.caseStudies && (
            <div className="section-content">
              {formData.caseStudies.map((caseStudy, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>
                      Case Study {index + 1}: {caseStudy.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("caseStudies", index)}
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={caseStudy.title}
                        onChange={(e) =>
                          updateArrayItem(
                            "caseStudies",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Case study title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Industry</label>
                      <input
                        type="text"
                        value={caseStudy.industry}
                        onChange={(e) =>
                          updateArrayItem(
                            "caseStudies",
                            index,
                            "industry",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Oil & Gas"
                      />
                    </div>
                    <div className="form-group">
                      <label>Result</label>
                      <input
                        type="text"
                        value={caseStudy.result}
                        onChange={(e) =>
                          updateArrayItem(
                            "caseStudies",
                            index,
                            "result",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., 40% reduction in maintenance time"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={caseStudy.description}
                        onChange={(e) =>
                          updateArrayItem(
                            "caseStudies",
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Case study description"
                        rows="2"
                      />
                    </div>
                    <div className="form-group">
                      <label>Link</label>
                      <input
                        type="text"
                        value={caseStudy.link}
                        onChange={(e) =>
                          updateArrayItem(
                            "caseStudies",
                            index,
                            "link",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., /case-studies/offshore-platform"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Image</label>
                      <FileUpload
                        compact={true}
                        label="Upload Case Study Image"
                        onUploadComplete={(fileData) => {
                          updateArrayItem(
                            "caseStudies",
                            index,
                            "image",
                            fileData.url,
                          );
                        }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        Current:{" "}
                        {caseStudy.image && <span>{caseStudy.image}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCaseStudy}
                className="add-item-button"
              >
                + Add Case Study
              </button>
            </div>
          )}
        </section>

        {/* TECHNICAL SPECIFICATIONS */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("technicalSpecs")}
          >
            <span className="section-icon">
              {expandedSections.technicalSpecs ? "▼" : "▶"}
            </span>
            <h3>Technical Specifications</h3>
          </button>

          {expandedSections.technicalSpecs && (
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>General Technical Drawing URL</label>
                  <FileUpload
                    compact={true}
                    label="Upload Drawing"
                    onUploadComplete={(fileData) => {
                      setFormData((prev) => ({
                        ...prev,
                        technicalSpecifications: {
                          ...prev.technicalSpecifications,
                          generalTechnicalDrawing: fileData.url,
                        },
                      }));
                    }}
                  />
                  <div
                    style={{
                      marginTop: "8px",
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    Current:{" "}
                    {formData.technicalSpecifications
                      .generalTechnicalDrawing && (
                      <span>
                        {
                          formData.technicalSpecifications
                            .generalTechnicalDrawing
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Models List */}
              <div style={{ marginTop: "24px" }}>
                <h4>
                  Models ({formData.technicalSpecifications.models.length})
                </h4>
                {formData.technicalSpecifications.models.map((model, index) => (
                  <div key={index}>
                    <div
                      style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                    >
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => updateModel(index, e.target.value)}
                        placeholder="e.g., TSL-07"
                        style={{
                          flex: 1,
                          padding: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeModel(index)}
                        className="remove-button"
                        style={{ width: "40px" }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Technical Data for this model */}
                    <div style={{ marginLeft: "20px", marginBottom: "16px", paddingLeft: "12px", borderLeft: "2px solid #ddd" }}>
                      <h5 style={{ marginTop: "12px", marginBottom: "8px", color: "#333" }}>
                        Technical Data
                      </h5>
                      {formData.technicalSpecifications.technicalData &&
                        formData.technicalSpecifications.technicalData[model] &&
                        Object.entries(
                          formData.technicalSpecifications.technicalData[model]
                        ).map(([fieldKey, fieldData]) => (
                          <div
                            key={fieldKey}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr auto",
                              gap: "8px",
                              marginBottom: "8px",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="text"
                              value={fieldData.name || ""}
                              onChange={(e) =>
                                updateTechnicalDataField(
                                  model,
                                  fieldKey,
                                  e.target.value,
                                  fieldData.metric,
                                  fieldData.imperial
                                )
                              }
                              placeholder="Field name (e.g., Tool Height)"
                              style={{
                                padding: "6px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            />
                            <input
                              type="text"
                              value={fieldData.metric || ""}
                              onChange={(e) =>
                                updateTechnicalDataField(
                                  model,
                                  fieldKey,
                                  fieldData.name,
                                  e.target.value,
                                  fieldData.imperial
                                )
                              }
                              placeholder="Metric (e.g., 80 mm)"
                              style={{
                                padding: "6px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            />
                            <input
                              type="text"
                              value={fieldData.imperial || ""}
                              onChange={(e) =>
                                updateTechnicalDataField(
                                  model,
                                  fieldKey,
                                  fieldData.name,
                                  fieldData.metric,
                                  e.target.value
                                )
                              }
                              placeholder="Imperial (e.g., 3.15 in)"
                              style={{
                                padding: "6px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeTechnicalDataField(model, fieldKey)
                              }
                              className="remove-button"
                              style={{ width: "32px", height: "32px" }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      <button
                        type="button"
                        onClick={() => addTechnicalDataField(model)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#f0f0f0",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        + Add Technical Data Field
                      </button>
                    </div>

                    {/* Dimensional Data for this model */}
                    <div style={{ marginLeft: "20px", marginBottom: "16px", paddingLeft: "12px", borderLeft: "2px solid #ddd" }}>
                      <h5 style={{ marginTop: "12px", marginBottom: "8px", color: "#333" }}>
                        Dimensional Data
                      </h5>
                      {formData.technicalSpecifications.dimensionalData &&
                        formData.technicalSpecifications.dimensionalData[model] &&
                        Object.entries(
                          formData.technicalSpecifications.dimensionalData[model]
                        ).map(([fieldKey, fieldData]) => (
                          <div
                            key={fieldKey}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr auto",
                              gap: "8px",
                              marginBottom: "8px",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="text"
                              value={fieldData.name || ""}
                              onChange={(e) =>
                                updateDimensionalDataField(
                                  model,
                                  fieldKey,
                                  e.target.value,
                                  fieldData.metric,
                                  fieldData.imperial
                                )
                              }
                              placeholder="Field name (e.g., Body Length)"
                              style={{
                                padding: "6px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            />
                            <input
                              type="text"
                              value={fieldData.metric || ""}
                              onChange={(e) =>
                                updateDimensionalDataField(
                                  model,
                                  fieldKey,
                                  fieldData.name,
                                  e.target.value,
                                  fieldData.imperial
                                )
                              }
                              placeholder="Metric (e.g., 117 mm)"
                              style={{
                                padding: "6px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            />
                            <input
                              type="text"
                              value={fieldData.imperial || ""}
                              onChange={(e) =>
                                updateDimensionalDataField(
                                  model,
                                  fieldKey,
                                  fieldData.name,
                                  fieldData.metric,
                                  e.target.value
                                )
                              }
                              placeholder="Imperial (e.g., 4.61 in)"
                              style={{
                                padding: "6px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeDimensionalDataField(model, fieldKey)
                              }
                              className="remove-button"
                              style={{ width: "32px", height: "32px" }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      <button
                        type="button"
                        onClick={() => addDimensionalDataField(model)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#f0f0f0",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        + Add Dimensional Data Field
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addModel}
                  className="add-spec-button"
                >
                  + Add Model
                </button>
              </div>
            </div>
          )}
        </section>

        {/* FAQs */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("faqs")}
          >
            <span className="section-icon">
              {expandedSections.faqs ? "▼" : "▶"}
            </span>
            <h3>FAQs ({formData.faqs.length})</h3>
          </button>

          {expandedSections.faqs && (
            <div className="section-content">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>FAQ {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("faqs", index)}
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Question</label>
                      <textarea
                        value={faq.question}
                        onChange={(e) =>
                          updateArrayItem(
                            "faqs",
                            index,
                            "question",
                            e.target.value,
                          )
                        }
                        placeholder="FAQ question"
                        rows="2"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Answer</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) =>
                          updateArrayItem(
                            "faqs",
                            index,
                            "answer",
                            e.target.value,
                          )
                        }
                        placeholder="FAQ answer"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addFaq}
                className="add-item-button"
              >
                + Add FAQ
              </button>
            </div>
          )}
        </section>

        {/* INDUSTRIES */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("industries")}
          >
            <span className="section-icon">
              {expandedSections.industries ? "▼" : "▶"}
            </span>
            <h3>Industries ({formData.industries.length})</h3>
          </button>

          {expandedSections.industries && (
            <div className="section-content">
              {formData.industries.map((industry, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>
                      Industry {index + 1}: {industry.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("industries", index)}
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={industry.name}
                        onChange={(e) =>
                          updateArrayItem(
                            "industries",
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Oil & Gas"
                      />
                    </div>
                    <div className="form-group">
                      <label>Slug</label>
                      <input
                        type="text"
                        value={industry.slug}
                        onChange={(e) =>
                          updateArrayItem(
                            "industries",
                            index,
                            "slug",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., oil-and-gas"
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input
                        type="text"
                        value={industry.category}
                        onChange={(e) =>
                          updateArrayItem(
                            "industries",
                            index,
                            "category",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Energy Sector"
                      />
                    </div>
                    <div className="form-group">
                      <label>Short Description</label>
                      <input
                        type="text"
                        value={industry.shortDesc}
                        onChange={(e) =>
                          updateArrayItem(
                            "industries",
                            index,
                            "shortDesc",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Offshore & refinery solutions"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Full Description</label>
                      <textarea
                        value={industry.description}
                        onChange={(e) =>
                          updateArrayItem(
                            "industries",
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Full industry description"
                        rows="3"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Image</label>
                      <FileUpload
                        compact={true}
                        label="Upload Industry Image"
                        onUploadComplete={(fileData) => {
                          updateArrayItem(
                            "industries",
                            index,
                            "image",
                            fileData.url,
                          );
                        }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        Current:{" "}
                        {industry.image && <span>{industry.image}</span>}
                      </div>
                    </div>

                    {/* Features for Industry */}
                    <div className="form-group full-width">
                      <label>Features</label>
                      {industry.features?.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="feature-item"
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "8px",
                          }}
                        >
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) =>
                              updateIndustryFeature(
                                index,
                                featureIndex,
                                e.target.value,
                              )
                            }
                            placeholder="Feature description"
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeIndustryFeature(index, featureIndex)
                            }
                            className="remove-button"
                            style={{ width: "40px" }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addIndustryFeature(index)}
                        className="add-spec-button"
                      >
                        + Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addIndustry}
                className="add-item-button"
              >
                + Add Industry
              </button>
            </div>
          )}
        </section>

        {/* CONTACT INFORMATION */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("contact")}
          >
            <span className="section-icon">
              {expandedSections.contact ? "▼" : "▶"}
            </span>
            <h3>Contact Information</h3>
          </button>

          {expandedSections.contact && (
            <div className="section-content">
              {/* Sales */}
              <div className="nested-item">
                <h4>Sales Inquiries</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={formData.contact.sales.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            sales: {
                              ...prev.contact.sales,
                              phone: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="+1 (800) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.contact.sales.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            sales: {
                              ...prev.contact.sales,
                              email: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="sales@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="nested-item" style={{ marginTop: "16px" }}>
                <h4>Technical Support</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Availability</label>
                    <input
                      type="text"
                      value={formData.contact.support.availability}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            support: {
                              ...prev.contact.support,
                              availability: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="24/7 Support Available"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.contact.support.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            support: {
                              ...prev.contact.support,
                              email: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="support@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="nested-item" style={{ marginTop: "16px" }}>
                <h4>Office Hours</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Weekdays</label>
                    <input
                      type="text"
                      value={formData.contact.officeHours.weekdays}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            officeHours: {
                              ...prev.contact.officeHours,
                              weekdays: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="Monday - Friday: 8:00 AM - 6:00 PM EST"
                    />
                  </div>
                  <div className="form-group">
                    <label>Weekends</label>
                    <input
                      type="text"
                      value={formData.contact.officeHours.weekends}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            officeHours: {
                              ...prev.contact.officeHours,
                              weekends: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="Saturday - Sunday: Emergency Support Only"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Form Actions */}
        <div className="form-actions-bottom">
          <button type="submit" disabled={loading} className="submit-button">
            {loading
              ? "Saving..."
              : editingProduct
                ? "Update Product"
                : "Create Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
