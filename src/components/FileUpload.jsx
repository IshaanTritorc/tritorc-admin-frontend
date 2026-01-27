import { useState } from 'react';
import { uploadFile } from '../services/api';
import './FileUpload.css';

export const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await uploadFile(file);
      
      if (response.success) {
        setSuccess('File uploaded successfully!');
        setUploadedFile(response.data);
        setFile(null);
        setPreview(null);
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Image to S3</h2>

      <div className="upload-section">
        <div className="upload-area">
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="file-input"
          />
          <label htmlFor="fileInput" className="upload-label">
            <div className="upload-icon">📷</div>
            <p>Click to select an image or drag and drop</p>
            <span className="file-size-info">Max size: 5MB (JPG, PNG, GIF, WebP)</span>
          </label>
        </div>

        {preview && (
          <div className="preview-container">
            <h3>Preview</h3>
            <img src={preview} alt="Preview" className="preview-image" />
            <p className="filename">{file.name}</p>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : 'Upload to S3'}
        </button>
      )}

      {uploadedFile && (
        <div className="uploaded-file-info">
          <h3>Upload Complete!</h3>
          <div className="file-info-item">
            <label>Image URL:</label>
            <div className="copy-container">
              <input
                type="text"
                value={uploadedFile.url}
                readOnly
                className="copy-input"
              />
              <button
                onClick={() => copyToClipboard(uploadedFile.url)}
                className="copy-button"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="file-info-item">
            <label>File Size:</label>
            <span>{(uploadedFile.size / 1024).toFixed(2)} KB</span>
          </div>
          <div className="file-info-item">
            <label>File Type:</label>
            <span>{uploadedFile.mimetype}</span>
          </div>
        </div>
      )}
    </div>
  );
};
