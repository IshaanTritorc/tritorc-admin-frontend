const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return await response.json();
};

// Auth API calls
export const loginUser = (email, password) => {
  return apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = (name, email, password) => {
  return apiCall('/users', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

export const getMe = () => {
  return apiCall('/users/me', {
    method: 'GET',
  });
};

// Product API calls
export const getAllProducts = () => {
  return apiCall('/products', {
    method: 'GET',
  });
};

export const createProduct = (productData) => {
  return apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = (productId, productData) => {
  return apiCall(`/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const getProduct = (url) => {
  return apiCall(`/products/${url}`, {
    method: 'GET',
  });
};

export const disableProduct = (productId) => {
  return apiCall(`/products/${productId}/disable`, {
    method: 'PATCH',
  });
};

// Category API calls
export const getAllCategories = () => {
  return apiCall('/categories', {
    method: 'GET',
  });
};

export const getAllCategoriesAdmin = () => {
  return apiCall('/categories/admin/all', {
    method: 'GET',
  });
};

export const createCategory = (categoryData) => {
  return apiCall('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

export const updateCategory = (categoryId, categoryData) => {
  return apiCall(`/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
};

export const disableCategory = (categoryId) => {
  return apiCall(`/categories/${categoryId}`, {
    method: 'DELETE',
  });
};

// File Upload API call
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const token = localStorage.getItem('token');
  const headers = {};
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  }).then(response => {
    if (!response.ok) {
      throw new Error('File upload failed');
    }
    return response.json();
  });
};
