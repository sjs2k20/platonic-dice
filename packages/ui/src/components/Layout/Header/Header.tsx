import { NavBar } from './NavBar';
import { config } from '@config/app.config';
import './Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <span className="header-logo">🎲</span>
          <span className="header-title">{config.app.name}</span>
          <span className="version-badge">v{config.app.version} - PREVIEW</span>
        </div>
        <NavBar />
      </div>
    </header>
  );
};
