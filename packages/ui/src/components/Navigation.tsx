import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-logo">🎲</span>
          <span className="nav-title">Platonic Dice</span>
          <span className="version-badge">v0.0.1 - PREVIEW</span>
        </div>

        <button
          className="nav-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'nav-links--open' : ''}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/die"
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              onClick={closeMenu}
            >
              Die Demo
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/core"
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              onClick={closeMenu}
            >
              Core Explorer
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              onClick={closeMenu}
            >
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
