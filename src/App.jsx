import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CategoryManager } from './components/CategoryManager';
import { ProductManager } from './components/ProductManager';
import { FileUpload } from './components/FileUpload';
import './App.css';

// Wrapper routes to read params and pass into managers
const CategoryEditRoute = () => {
  const { id } = useParams();
  return (
    <ProtectedRoute>
      <CategoryManager initialEditId={id} />
    </ProtectedRoute>
  );
};

const ProductEditRoute = () => {
  const { id } = useParams();
  return (
    <ProtectedRoute>
      <ProductManager initialEditId={id} />
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Categories */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/create"
            element={
              <ProtectedRoute>
                <CategoryManager openForm={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:id/edit"
            element={<CategoryEditRoute />}
          />

          {/* Products */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/create"
            element={
              <ProtectedRoute>
                <ProductManager openForm={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={<ProductEditRoute />}
          />

          {/* Upload */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <FileUpload label="Upload File" />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
