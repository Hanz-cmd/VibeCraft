import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import OutfitGenerator from './pages/OutfitGenerator';
import SavedOutfits from './pages/SavedOutfits';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/generate" element={<OutfitGenerator />} />
            <Route path="/saved" element={<SavedOutfits />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
