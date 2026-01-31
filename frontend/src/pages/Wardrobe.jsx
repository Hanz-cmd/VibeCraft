import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import axios from 'axios';
import ClothingCard from '../components/ClothingCard';
import UploadModal from '../components/UploadModal';
import './Wardrobe.css';

const API_URL = '/api';

function Wardrobe() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/wardrobe`);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, meta = {}) => {
    const formData = new FormData();
    formData.append('image', file);
    if (meta.category && meta.category !== 'auto') formData.append('category', meta.category);
    if (meta.subcategory) formData.append('subcategory', meta.subcategory);

    const response = await axios.post(`${API_URL}/wardrobe/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setItems([...items, response.data]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/wardrobe/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  const categories = ['all', ...new Set(items.map(i => i.category).filter(Boolean))];

  return (
    <div className="wardrobe-page">
      <div className="page-header">
        <div>
          <h1>My Wardrobe</h1>
          <p>{items.length} items in your collection</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {items.length > 0 && (
        <div className="filters">
          <Filter size={18} />
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👕</div>
          <h3>Your wardrobe is empty</h3>
          <p>Start by adding some clothing items</p>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
            <Plus size={20} />
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="wardrobe-grid grid grid-4">
          {filteredItems.map(item => (
            <ClothingCard 
              key={item.id} 
              item={item} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <UploadModal 
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

export default Wardrobe;
