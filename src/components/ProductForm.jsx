import { useState, useEffect } from 'react';
import { createProduct, updateProduct, getAllProducts, getAllCategories } from '../services/api';
import './ProductForm.css';

export const ProductForm = ({ onSuccess, onCancel, editingProduct = null }) => {
  const [formData, setFormData] = useState({
    url: '',
    category: '',
    countryLang: 'en-US',
    heading1: '',
    heading2: '',
    heading3: '',
    description: '',
    isActive: true,
    images: [],
    catalogues: [],
    features: [],
    highlights: [],
    accessories: [],
    faqs: [],
    technicalSpecifications: {
      drawingUrl: '',
      variants: []
    }
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    images: false,
    catalogues: false,
    features: false,
    highlights: false,
    accessories: false,
    faqs: false,
    technicalSpecs: false
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      console.error('Failed to fetch categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBasicInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTechSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        [name]: value
      }
    }));
  };

  // Image handlers
  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', altText: '' }]
    }));
  };

  const updateImage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? { ...img, [field]: value } : img)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Catalogue handlers
  const addCatalogue = () => {
    setFormData(prev => ({
      ...prev,
      catalogues: [...prev.catalogues, { title: '', url: '' }]
    }));
  };

  const updateCatalogue = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      catalogues: prev.catalogues.map((cat, i) => i === index ? { ...cat, [field]: value } : cat)
    }));
  };

  const removeCatalogue = (index) => {
    setFormData(prev => ({
      ...prev,
      catalogues: prev.catalogues.filter((_, i) => i !== index)
    }));
  };

  // Feature handlers
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { title: '', value: '' }]
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feat, i) => i === index ? { ...feat, [field]: value } : feat)
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Highlight handlers
  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, { title: '', description: '', main: false, img: '' }]
    }));
  };

  const updateHighlight = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((hl, i) => 
        i === index ? { ...hl, [field]: value } : hl
      )
    }));
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Accessory handlers
  const addAccessory = () => {
    setFormData(prev => ({
      ...prev,
      accessories: [...prev.accessories, { title: '', subtitle: '', img: '' }]
    }));
  };

  const updateAccessory = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      accessories: prev.accessories.map((acc, i) => i === index ? { ...acc, [field]: value } : acc)
    }));
  };

  const removeAccessory = (index) => {
    setFormData(prev => ({
      ...prev,
      accessories: prev.accessories.filter((_, i) => i !== index)
    }));
  };

  // FAQ handlers
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq)
    }));
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Variant handlers
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        variants: [...prev.technicalSpecifications.variants, { modelName: '', keySpecs: [], dimensions: [] }]
      }
    }));
  };

  const updateVariant = (variantIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        variants: prev.technicalSpecifications.variants.map((variant, i) =>
          i === variantIndex ? { ...variant, [field]: value } : variant
        )
      }
    }));
  };

  const addSpecToVariant = (variantIndex, specType) => {
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        variants: prev.technicalSpecifications.variants.map((variant, i) =>
          i === variantIndex
            ? {
              ...variant,
              [specType]: [...(variant[specType] || []), { label: '', code: '', value: '', valueMetric: '', type: 'text' }]
            }
            : variant
        )
      }
    }));
  };

  const updateVariantSpec = (variantIndex, specType, specIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        variants: prev.technicalSpecifications.variants.map((variant, vi) =>
          vi === variantIndex
            ? {
              ...variant,
              [specType]: variant[specType].map((spec, si) =>
                si === specIndex ? { ...spec, [field]: value } : spec
              )
            }
            : variant
        )
      }
    }));
  };

  const removeVariantSpec = (variantIndex, specType, specIndex) => {
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        variants: prev.technicalSpecifications.variants.map((variant, vi) =>
          vi === variantIndex
            ? {
              ...variant,
              [specType]: variant[specType].filter((_, si) => si !== specIndex)
            }
            : variant
        )
      }
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: {
        ...prev.technicalSpecifications,
        variants: prev.technicalSpecifications.variants.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(formData);
        setSuccess('Product created successfully!');
      }

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="product-form-large">

        {/* Basic Information Section */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('basic')}
          >
            <span className="section-icon">{expandedSections.basic ? '▼' : '▶'}</span>
            <h3>Basic Information</h3>
          </button>

          {expandedSections.basic && (
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="url">Product URL (Slug) *</label>
                  <input
                    id="url"
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleBasicInputChange}
                    required
                    placeholder="e.g., luxury-faucet"
                    disabled={editingProduct}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  {categoriesLoading ? (
                    <div style={{ padding: '8px', color: '#666' }}>Loading categories...</div>
                  ) : (
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleBasicInputChange}
                      required
                    >
                      <option value="">-- Select a Category --</option>
                      {categories.map(cat => (
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
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-CA">English (Canada)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="fr-CA">French (Canada)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="heading1">Heading 1 *</label>
                  <input
                    id="heading1"
                    type="text"
                    name="heading1"
                    value={formData.heading1}
                    onChange={handleBasicInputChange}
                    required
                    placeholder="Primary heading"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="heading2">Heading 2 *</label>
                  <input
                    id="heading2"
                    type="text"
                    name="heading2"
                    value={formData.heading2}
                    onChange={handleBasicInputChange}
                    required
                    placeholder="Secondary heading"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="heading3">Heading 3</label>
                  <input
                    id="heading3"
                    type="text"
                    name="heading3"
                    value={formData.heading3}
                    onChange={handleBasicInputChange}
                    placeholder="Tertiary heading"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleBasicInputChange}
                    required
                    placeholder="Product description"
                    rows="4"
                  />
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

        {/* Images Section */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('images')}
          >
            <span className="section-icon">{expandedSections.images ? '▼' : '▶'}</span>
            <h3>Images ({formData.images.length})</h3>
          </button>

          {expandedSections.images && (
            <div className="section-content">
              {formData.images.map((image, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Image {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-button"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={image.url}
                        onChange={(e) => updateImage(index, 'url', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Alt Text</label>
                      <input
                        type="text"
                        value={image.altText}
                        onChange={(e) => updateImage(index, 'altText', e.target.value)}
                        placeholder="Description of image"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addImage} className="add-item-button">
                + Add Image
              </button>
            </div>
          )}
        </section>

        {/* Catalogues Section */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('catalogues')}
          >
            <span className="section-icon">{expandedSections.catalogues ? '▼' : '▶'}</span>
            <h3>Catalogues ({formData.catalogues.length})</h3>
          </button>

          {expandedSections.catalogues && (
            <div className="section-content">
              {formData.catalogues.map((catalogue, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Catalogue {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeCatalogue(index)}
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
                        value={catalogue.title}
                        onChange={(e) => updateCatalogue(index, 'title', e.target.value)}
                        placeholder="Catalogue title"
                      />
                    </div>
                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="text"
                        value={catalogue.url}
                        onChange={(e) => updateCatalogue(index, 'url', e.target.value)}
                        placeholder="https://example.com/catalogue.pdf"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addCatalogue} className="add-item-button">
                + Add Catalogue
              </button>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('features')}
          >
            <span className="section-icon">{expandedSections.features ? '▼' : '▶'}</span>
            <h3>Features ({formData.features.length})</h3>
          </button>

          {expandedSections.features && (
            <div className="section-content">
              {formData.features.map((feature, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Feature {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
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
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        placeholder="Feature title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Value</label>
                      <input
                        type="text"
                        value={feature.value}
                        onChange={(e) => updateFeature(index, 'value', e.target.value)}
                        placeholder="Feature value"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addFeature} className="add-item-button">
                + Add Feature
              </button>
            </div>
          )}
        </section>

        {/* Highlights Section */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('highlights')}
          >
            <span className="section-icon">{expandedSections.highlights ? '▼' : '▶'}</span>
            <h3>Highlights ({formData.highlights.length})</h3>
          </button>

          {expandedSections.highlights && (
            <div className="section-content">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Highlight {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
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
                        value={highlight.title}
                        onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                        placeholder="Highlight title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={highlight.img}
                        onChange={(e) => updateHighlight(index, 'img', e.target.value)}
                        placeholder="https://example.com/highlight.jpg"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={highlight.description}
                        onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                        placeholder="Highlight description"
                        rows="3"
                      />
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={highlight.main}
                          onChange={(e) => updateHighlight(index, 'main', e.target.checked)}
                        />
                        Main Highlight
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addHighlight} className="add-item-button">
                + Add Highlight
              </button>
            </div>
          )}
        </section>

        {/* Accessories Section */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('accessories')}
          >
            <span className="section-icon">{expandedSections.accessories ? '▼' : '▶'}</span>
            <h3>Accessories ({formData.accessories.length})</h3>
          </button>

          {expandedSections.accessories && (
            <div className="section-content">
              {formData.accessories.map((accessory, index) => (
                <div key={index} className="nested-item">
                  <div className="nested-item-header">
                    <h4>Accessory {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeAccessory(index)}
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
                        value={accessory.title}
                        onChange={(e) => updateAccessory(index, 'title', e.target.value)}
                        placeholder="Accessory title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Subtitle</label>
                      <input
                        type="text"
                        value={accessory.subtitle}
                        onChange={(e) => updateAccessory(index, 'subtitle', e.target.value)}
                        placeholder="Accessory subtitle"
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={accessory.img}
                        onChange={(e) => updateAccessory(index, 'img', e.target.value)}
                        placeholder="https://example.com/accessory.jpg"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addAccessory} className="add-item-button">
                + Add Accessory
              </button>
            </div>
          )}
        </section>

        {/* FAQs Section */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('faqs')}
          >
            <span className="section-icon">{expandedSections.faqs ? '▼' : '▶'}</span>
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
                      onClick={() => removeFaq(index)}
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
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        placeholder="FAQ question"
                        rows="2"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Answer</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        placeholder="FAQ answer"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addFaq} className="add-item-button">
                + Add FAQ
              </button>
            </div>
          )}
        </section>

        {/* Technical Specifications Section */}
        <section className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('technicalSpecs')}
          >
            <span className="section-icon">{expandedSections.technicalSpecs ? '▼' : '▶'}</span>
            <h3>Technical Specifications</h3>
          </button>

          {expandedSections.technicalSpecs && (
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Drawing URL</label>
                  <input
                    type="text"
                    name="drawingUrl"
                    value={formData.technicalSpecifications.drawingUrl}
                    onChange={handleTechSpecChange}
                    placeholder="https://example.com/drawing.pdf"
                  />
                </div>
              </div>

              <div className="variants-section">
                <h4>Variants ({formData.technicalSpecifications.variants.length})</h4>
                {formData.technicalSpecifications.variants.map((variant, variantIndex) => (
                  <div key={variantIndex} className="nested-item variant-item">
                    <div className="nested-item-header">
                      <h5>Variant {variantIndex + 1}: {variant.modelName || 'Unnamed'}</h5>
                      <button
                        type="button"
                        onClick={() => removeVariant(variantIndex)}
                        className="remove-button"
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label>Model Name</label>
                        <input
                          type="text"
                          value={variant.modelName}
                          onChange={(e) => updateVariant(variantIndex, 'modelName', e.target.value)}
                          placeholder="e.g., Model A-100"
                        />
                      </div>
                    </div>

                    {/* Key Specs */}
                    <div className="specs-subsection">
                      <h6>Key Specifications</h6>
                      {variant.keySpecs?.map((spec, specIndex) => (
                        <div key={specIndex} className="spec-item">
                          <div className="spec-item-header">
                            <span>Spec {specIndex + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeVariantSpec(variantIndex, 'keySpecs', specIndex)}
                              className="remove-button small"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Label</label>
                              <input
                                type="text"
                                value={spec.label}
                                onChange={(e) => updateVariantSpec(variantIndex, 'keySpecs', specIndex, 'label', e.target.value)}
                                placeholder="e.g., Weight"
                              />
                            </div>
                            <div className="form-group">
                              <label>Code</label>
                              <input
                                type="text"
                                value={spec.code || ''}
                                onChange={(e) => updateVariantSpec(variantIndex, 'keySpecs', specIndex, 'code', e.target.value)}
                                placeholder="e.g., L1"
                              />
                            </div>
                            <div className="form-group">
                              <label>Value</label>
                              <input
                                type="text"
                                value={spec.value}
                                onChange={(e) => updateVariantSpec(variantIndex, 'keySpecs', specIndex, 'value', e.target.value)}
                                placeholder="e.g., 77lbs"
                              />
                            </div>
                            <div className="form-group">
                              <label>Metric Value</label>
                              <input
                                type="text"
                                value={spec.valueMetric || ''}
                                onChange={(e) => updateVariantSpec(variantIndex, 'keySpecs', specIndex, 'valueMetric', e.target.value)}
                                placeholder="e.g., 35kg"
                              />
                            </div>
                            <div className="form-group">
                              <label>Type</label>
                              <select
                                value={spec.type}
                                onChange={(e) => updateVariantSpec(variantIndex, 'keySpecs', specIndex, 'type', e.target.value)}
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="range">Range</option>
                                <option value="boolean">Boolean</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSpecToVariant(variantIndex, 'keySpecs')}
                        className="add-spec-button"
                      >
                        + Add Key Spec
                      </button>
                    </div>

                    {/* Dimensions */}
                    <div className="specs-subsection">
                      <h6>Dimensions</h6>
                      {variant.dimensions?.map((dim, specIndex) => (
                        <div key={specIndex} className="spec-item">
                          <div className="spec-item-header">
                            <span>Dimension {specIndex + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeVariantSpec(variantIndex, 'dimensions', specIndex)}
                              className="remove-button small"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Label</label>
                              <input
                                type="text"
                                value={dim.label}
                                onChange={(e) => updateVariantSpec(variantIndex, 'dimensions', specIndex, 'label', e.target.value)}
                                placeholder="e.g., Height"
                              />
                            </div>
                            <div className="form-group">
                              <label>Code</label>
                              <input
                                type="text"
                                value={dim.code || ''}
                                onChange={(e) => updateVariantSpec(variantIndex, 'dimensions', specIndex, 'code', e.target.value)}
                                placeholder="e.g., H1"
                              />
                            </div>
                            <div className="form-group">
                              <label>Value</label>
                              <input
                                type="text"
                                value={dim.value}
                                onChange={(e) => updateVariantSpec(variantIndex, 'dimensions', specIndex, 'value', e.target.value)}
                                placeholder="e.g., 100in"
                              />
                            </div>
                            <div className="form-group">
                              <label>Metric Value</label>
                              <input
                                type="text"
                                value={dim.valueMetric || ''}
                                onChange={(e) => updateVariantSpec(variantIndex, 'dimensions', specIndex, 'valueMetric', e.target.value)}
                                placeholder="e.g., 254cm"
                              />
                            </div>
                            <div className="form-group">
                              <label>Type</label>
                              <select
                                value={dim.type}
                                onChange={(e) => updateVariantSpec(variantIndex, 'dimensions', specIndex, 'type', e.target.value)}
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="range">Range</option>
                                <option value="boolean">Boolean</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSpecToVariant(variantIndex, 'dimensions')}
                        className="add-spec-button"
                      >
                        + Add Dimension
                      </button>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addVariant} className="add-item-button">
                  + Add Variant
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Form Actions */}
        <div className="form-actions-bottom">
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
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
