import { NavBar } from './NavBar';
import { config } from '@config/app.config';
import { Logo } from '@/assets';
import './Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Logo width={48} height={48} className="header-logo" />
          <span className="header-title">{config.app.name}</span>
          <span className="version-badge">v{config.app.version} - PREVIEW</span>
        </div>
        <NavBar />
      </div>
    </header>
  );
};
