import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { routes } from '@config/routes';
import './NavBar.css';

interface NavItem {
  to: string;
  label: string;
}

interface NavBarProps {
  items?: NavItem[];
}

export const NavBar = ({ items }: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const defaultItems: NavItem[] = routes.map((route) => ({
    to: route.path,
    label: route.label,
  }));

  const navItems = items || defaultItems;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
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
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
