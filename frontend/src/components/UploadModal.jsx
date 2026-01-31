import React, { useState, useRef } from 'react';
import { Upload, Image } from 'lucide-react';
import './UploadModal.css';

function UploadModal({ isOpen, onClose, onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('auto');
  const [subcategory, setSubcategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      await onUpload(file, { category, subcategory });
      setFile(null);
      setPreview(null);
      setCategory('auto');
      setSubcategory('');
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setCategory('auto');
    setSubcategory('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add to Wardrobe</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {!preview ? (
            <div 
              className={`drop-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={48} />
              <p>Drag & drop your clothing photo</p>
              <span>or click to browse</span>
              <input 
                ref={inputRef}
                type="file" 
                accept="image/*"
                onChange={handleChange}
                hidden
              />
            </div>
          ) : (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          )}

          <div className="manual-tags">
            <div className="field">
              <label>Category (optional)</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="auto">Auto-detect</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="shoes">Shoes</option>
                <option value="outerwear">Outerwear</option>
                <option value="accessory">Accessory</option>
                <option value="dress">Dress</option>
              </select>
            </div>
            <div className="field">
              <label>Subcategory (optional)</label>
              <input
                type="text"
                placeholder="e.g., jeans, hoodie, sneakers"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          {file && (
            <button 
              className="btn btn-secondary" 
              onClick={() => { setPreview(null); setFile(null); }}
            >
              Change Image
            </button>
          )}
          <button 
            className="btn btn-primary" 
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Analyzing...' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
