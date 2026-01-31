import React from 'react';
import { Upload, X } from 'lucide-react';
import './ClothingCard.css';

function ClothingCard({ item, onDelete, selectable, selected, onSelect }) {
  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(item);
    }
  };

  return (
    <div 
      className={`clothing-card ${selectable ? 'selectable' : ''} ${selected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="card-image">
        <img src={item.imagePath} alt={item.subcategory} />
        {selected && <div className="selected-overlay">✓</div>}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{item.subcategory || 'Clothing Item'}</h3>
        
        <div className="card-tags">
          <span className="tag tag-primary">{item.category}</span>
          {item.colors?.slice(0, 2).map((color, i) => (
            <span key={i} className="tag">{color}</span>
          ))}
        </div>

        <div className="card-meta">
          <span className="style-tag">{item.style}</span>
        </div>
      </div>

      {onDelete && !selectable && (
        <button 
          className="delete-btn" 
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default ClothingCard;
