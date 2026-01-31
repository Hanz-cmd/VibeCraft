const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { analyzeClothing } = require('../services/aiService');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// In-memory storage (replace with DB in production)
let wardrobe = [];

// GET all items
router.get('/', (req, res) => {
  res.json(wardrobe);
});

// GET item by ID
router.get('/:id', (req, res) => {
  const item = wardrobe.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST upload new item
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    
    console.log('Received form data:', req.body);
    
    // Analyze clothing with AI
    const analysis = await analyzeClothing(req.file.path);

    const manualCategory = req.body.category && req.body.category !== 'auto' ? req.body.category : null;
    const manualSubcategory = req.body.subcategory && req.body.subcategory.trim() ? req.body.subcategory.trim() : null;

    console.log('Manual category:', manualCategory, 'AI category:', analysis.category);
    console.log('Manual subcategory:', manualSubcategory, 'AI subcategory:', analysis.subcategory);

    const newItem = {
      id: `item-${Date.now()}`,
      imagePath,
      filename: req.file.filename,
      uploadedAt: new Date().toISOString(),
      ...analysis,
      category: manualCategory || analysis.category,
      subcategory: manualSubcategory || analysis.subcategory
    };
    
    console.log('Final item:', newItem);

    wardrobe.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// DELETE item
router.delete('/:id', (req, res) => {
  const index = wardrobe.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  
  wardrobe.splice(index, 1);
  res.json({ message: 'Item deleted' });
});

// PUT update item
router.put('/:id', (req, res) => {
  const index = wardrobe.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  
  wardrobe[index] = { ...wardrobe[index], ...req.body };
  res.json(wardrobe[index]);
});

module.exports = router;
