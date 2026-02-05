import { useState, useEffect } from 'react';
import { uploadFile } from '../services/api';
import './FileUpload.css';

export const FileUpload = ({ onUploadComplete, compact = false, label = 'Upload File' }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Auto-upload when file is selected
  useEffect(() => {
    if (file && !uploading) {
      handleUpload();
    }
  }, [file]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setError('');

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    // Validate file type (images and PDF)
    const isImage = selectedFile.type.startsWith('image/');
    const isPdf = selectedFile.type === 'application/pdf';

    if (!isImage && !isPdf) {
      setError('Please select an image (JPG, PNG, GIF, WebP) or PDF file');
      return;
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);

    // Create preview for images only
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For PDFs, show a placeholder
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await uploadFile(file);
      
      if (response.success) {
        setUploadedFile(response.data);
        setFile(null);
        setPreview(null);
        
        // Call callback if provided
        if (onUploadComplete) {
          onUploadComplete(response.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setFile(null);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) {
      return '🖼️';
    } else if (mimetype === 'application/pdf') {
      return '📄';
    }
    return '📎';
  };

  // Compact mode - minimal version for form fields
  if (compact) {
    return (
      <div className="file-upload-compact">
        {!uploadedFile ? (
          <>
            <input
              type="file"
              id="fileInputCompact"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              disabled={uploading}
              className="file-input-compact"
            />
            <label htmlFor="fileInputCompact" className="upload-label-compact">
              <span className="upload-icon-compact">
                {uploading ? '⏳' : '📤'}
              </span>
              <span className="label-text-compact">{label}</span>
            </label>
            {preview && (
              <div className="preview-compact">
                <img src={preview} alt="Preview" className="preview-image-compact" />
              </div>
            )}
            {error && <div className="error-message-compact">{error}</div>}
          </>
        ) : (
          <div className="uploaded-file-compact">
            {uploadedFile.mimetype.startsWith('image/') ? (
              <div className="image-preview-compact">
                <img src={uploadedFile.url} alt="Uploaded" className="uploaded-image-compact" />
              </div>
            ) : (
              <div className="file-icon-compact">{getFileIcon(uploadedFile.mimetype)}</div>
            )}
            <div className="file-details-compact">
              <p className="file-name-compact">{uploadedFile.originalname || 'File uploaded'}</p>
              <p className="file-size-compact">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="remove-btn-compact"
              title="Remove and upload different file"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  // Full mode - detailed version
  return (
    <div className="file-upload-container">
      <h2>{label}</h2>

      <div className="upload-section">
        <div className="upload-area">
          <input
            type="file"
            id="fileInput"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            disabled={uploading}
            className="file-input"
          />
          <label htmlFor="fileInput" className="upload-label">
            <div className="upload-icon">{uploading ? '⏳' : '📤'}</div>
            <p>{uploading ? 'Uploading...' : 'Click to select a file or drag and drop'}</p>
            <span className="file-size-info">Max size: 10MB (JPG, PNG, GIF, WebP, PDF)</span>
          </label>
        </div>

        {preview && (
          <div className="preview-container">
            <h3>Image Preview</h3>
            <img src={preview} alt="Preview" className="preview-image" />
            <p className="filename">{file.name}</p>
          </div>
        )}

        {file && !preview && (
          <div className="preview-container">
            <h3>File Selected</h3>
            <div className="file-preview-box">
              <div className="pdf-icon">{getFileIcon(file.type)}</div>
              <p className="filename">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {uploadedFile && (
        <div className="uploaded-file-info">
          <h3>✓ Upload Complete!</h3>
          <div className="file-info-item">
            <label>File Name:</label>
            <span>{uploadedFile.originalname || 'Uploaded file'}</span>
          </div>
          <div className="file-info-item">
            <label>File URL:</label>
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
          <button
            onClick={() => {
              setUploadedFile(null);
              document.getElementById('fileInput').value = '';
            }}
            className="upload-another-btn"
          >
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
};
