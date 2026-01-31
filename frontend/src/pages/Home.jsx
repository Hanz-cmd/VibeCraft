import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Wand2, Cloud, Sparkles } from 'lucide-react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Your AI-Powered <span className="highlight">Virtual Wardrobe</span></h1>
          <p>Upload your clothes, mix & match digitally, and let AI style your perfect outfits for any occasion.</p>
          <div className="hero-actions">
            <Link to="/wardrobe" className="btn btn-primary">
              <Shirt size={20} />
              Start Your Wardrobe
            </Link>
            <Link to="/generate" className="btn btn-secondary">
              <Wand2 size={20} />
              Generate Outfits
            </Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-card">👕</div>
          <div className="floating-card">👖</div>
          <div className="floating-card">👟</div>
          <div className="floating-card">🧥</div>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid grid grid-3">
          <div className="feature-card card">
            <div className="feature-icon">📸</div>
            <h3>Upload Photos</h3>
            <p>Snap photos of your clothes. AI auto-categorizes by type, color, and style.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">
              <Wand2 size={32} />
            </div>
            <h3>AI Styling</h3>
            <p>Get outfit suggestions based on occasion, weather, and your style preferences.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">
              <Cloud size={32} />
            </div>
            <h3>Weather-Smart</h3>
            <p>Outfits automatically adjust to today's weather in your location.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <Sparkles size={32} />
        <h2>Ready to transform how you dress?</h2>
        <p>Start building your digital wardrobe today.</p>
        <Link to="/wardrobe" className="btn btn-primary">Get Started Free</Link>
      </section>
    </div>
  );
}

export default Home;
