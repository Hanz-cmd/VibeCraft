const express = require('express');
const router = express.Router();
const { generateOutfits } = require('../services/aiService');

// In-memory saved outfits
let savedOutfits = [];

// POST generate outfit suggestions
router.post('/generate', async (req, res) => {
  try {
    const { wardrobeItems, occasion, weather } = req.body;

    if (!wardrobeItems || wardrobeItems.length === 0) {
      return res.status(400).json({ error: 'No wardrobe items provided' });
    }

    const outfits = await generateOutfits(wardrobeItems, occasion, weather);
    res.json({ outfits });
  } catch (error) {
    console.error('Outfit generation error:', error);
    res.status(500).json({ error: 'Failed to generate outfits' });
  }
});

// GET saved outfits
router.get('/saved', (req, res) => {
  res.json(savedOutfits);
});

// POST save an outfit
router.post('/save', (req, res) => {
  const { name, items, occasion } = req.body;
  
  const newOutfit = {
    id: `outfit-${Date.now()}`,
    name: name || `Outfit ${savedOutfits.length + 1}`,
    items,
    occasion,
    savedAt: new Date().toISOString()
  };

  savedOutfits.push(newOutfit);
  res.status(201).json(newOutfit);
});

// DELETE saved outfit
router.delete('/saved/:id', (req, res) => {
  const index = savedOutfits.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Outfit not found' });
  
  savedOutfits.splice(index, 1);
  res.json({ message: 'Outfit deleted' });
});

module.exports = router;
