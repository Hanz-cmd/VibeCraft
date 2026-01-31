import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shirt, Wand2, Heart, Home } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/wardrobe', icon: Shirt, label: 'Wardrobe' },
    { path: '/generate', icon: Wand2, label: 'Generate' },
    { path: '/saved', icon: Heart, label: 'Saved' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">VibeCraft</span>
        </Link>

        <ul className="navbar-menu">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link 
                to={path} 
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
