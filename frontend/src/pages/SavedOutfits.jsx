import React, { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import axios from 'axios';
import './SavedOutfits.css';

const API_URL = '/api';

function SavedOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [wardrobe, setWardrobe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [outfitsRes, wardrobeRes] = await Promise.all([
        axios.get(`${API_URL}/outfits/saved`),
        axios.get(`${API_URL}/wardrobe`)
      ]);
      setOutfits(outfitsRes.data);
      setWardrobe(wardrobeRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOutfit = async (id) => {
    try {
      await axios.delete(`${API_URL}/outfits/saved/${id}`);
      setOutfits(outfits.filter(o => o.id !== id));
    } catch (error) {
      console.error('Failed to delete outfit:', error);
    }
  };

  const getItemById = (id) => wardrobe.find(item => item.id === id);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="saved-page">
      <div className="page-header">
        <h1>Saved Outfits</h1>
        <p>{outfits.length} outfits in your lookbook</p>
      </div>

      {outfits.length === 0 ? (
        <div className="empty-state">
          <Heart size={48} />
          <h3>No saved outfits yet</h3>
          <p>Generate some outfits and save your favorites!</p>
        </div>
      ) : (
        <div className="outfits-list">
          {outfits.map(outfit => (
            <div key={outfit.id} className="saved-outfit-card card">
              <div className="outfit-header">
                <div>
                  <h3>{outfit.name}</h3>
                  <span className="occasion-badge">{outfit.occasion}</span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => deleteOutfit(outfit.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="outfit-items-row">
                {outfit.items?.map(id => {
                  const item = getItemById(id);
                  return item ? (
                    <div key={id} className="saved-item">
                      <img src={item.imagePath} alt={item.subcategory} />
                      <span>{item.subcategory}</span>
                    </div>
                  ) : (
                    <div key={id} className="saved-item missing">
                      <span>Item removed</span>
                    </div>
                  );
                })}
              </div>

              <div className="outfit-meta">
                <span>Saved {new Date(outfit.savedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedOutfits;
