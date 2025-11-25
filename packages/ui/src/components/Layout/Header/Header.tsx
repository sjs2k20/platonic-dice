import { NavBar } from './NavBar';
import './Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <span className="header-logo">🎲</span>
          <span className="header-title">Platonic Dice</span>
          <span className="version-badge">v0.0.1 - PREVIEW</span>
        </div>
        <NavBar />
      </div>
    </header>
  );
};
