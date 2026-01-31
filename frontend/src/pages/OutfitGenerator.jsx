import React, { useState, useEffect } from 'react';
import { Wand2, Cloud, MapPin, RefreshCw } from 'lucide-react';
import axios from 'axios';
import ClothingCard from '../components/ClothingCard';
import './OutfitGenerator.css';

const API_URL = '/api';

const occasions = ['casual', 'work', 'date', 'party', 'gym', 'outdoor'];

function OutfitGenerator() {
  const [wardrobe, setWardrobe] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [occasion, setOccasion] = useState('casual');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const response = await axios.get(`${API_URL}/wardrobe`);
      setWardrobe(response.data);
    } catch (error) {
      console.error('Failed to fetch wardrobe:', error);
    }
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoadingWeather(true);
    try {
      const response = await axios.get(`${API_URL}/weather/${city}`);
      setWeather(response.data);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleSelect = (item) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const generateOutfits = async () => {
    if (selectedItems.length < 2) {
      alert('Please select at least 2 items');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/outfits/generate`, {
        wardrobeItems: selectedItems,
        occasion,
        weather
      });
      setOutfits(response.data.outfits);
    } catch (error) {
      console.error('Failed to generate outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async (outfit) => {
    try {
      await axios.post(`${API_URL}/outfits/save`, {
        name: outfit.name,
        items: outfit.itemIds,
        occasion
      });
      alert('Outfit saved!');
    } catch (error) {
      console.error('Failed to save outfit:', error);
    }
  };

  const getItemById = (id) => wardrobe.find(item => item.id === id);

  return (
    <div className="generator-page">
      <div className="page-header">
        <h1>Outfit Generator</h1>
        <p>Select items and let AI create perfect combinations</p>
      </div>

      <div className="generator-layout">
        <div className="selection-panel">
          <div className="panel-header">
            <h3>Select Items ({selectedItems.length} selected)</h3>
            {selectedItems.length > 0 && (
              <button className="btn btn-secondary" onClick={() => setSelectedItems([])}>
                Clear
              </button>
            )}
          </div>

          {wardrobe.length === 0 ? (
            <div className="empty-state">
              <p>No items in wardrobe. Add some first!</p>
            </div>
          ) : (
            <div className="items-grid grid grid-3">
              {wardrobe.map(item => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  selectable
                  selected={selectedItems.some(i => i.id === item.id)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>

        <div className="controls-panel">
          <div className="card control-card">
            <h3>Occasion</h3>
            <div className="occasion-buttons">
              {occasions.map(occ => (
                <button
                  key={occ}
                  className={`occasion-btn ${occasion === occ ? 'active' : ''}`}
                  onClick={() => setOccasion(occ)}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <div className="card control-card">
            <h3><Cloud size={18} /> Weather</h3>
            <div className="weather-input">
              <input
                type="text"
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
              />
              <button className="btn btn-secondary" onClick={fetchWeather} disabled={loadingWeather}>
                <MapPin size={16} />
              </button>
            </div>
            {weather && (
              <div className="weather-info">
                <span className="temp">{weather.temp}°C</span>
                <span className="condition">{weather.condition}</span>
                <p className="recommendation">{weather.recommendation}</p>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary generate-btn"
            onClick={generateOutfits}
            disabled={loading || selectedItems.length < 2}
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="spinning" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate Outfits
              </>
            )}
          </button>
        </div>
      </div>

      {outfits.length > 0 && (
        <div className="results-section">
          <h2>Generated Outfits</h2>
          <div className="outfits-grid">
            {outfits.map((outfit, index) => (
              <div key={index} className="outfit-card card">
                <h3>{outfit.name}</h3>
                <p className="outfit-description">{outfit.description}</p>
                <div className="outfit-items">
                  {outfit.itemIds?.map(id => {
                    const item = getItemById(id);
                    return item ? (
                      <div key={id} className="mini-item">
                        <img src={item.imagePath} alt={item.subcategory} />
                      </div>
                    ) : null;
                  })}
                </div>
                <p className="outfit-tip">💡 {outfit.tip}</p>
                <button className="btn btn-secondary" onClick={() => saveOutfit(outfit)}>
                  Save Outfit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OutfitGenerator;
