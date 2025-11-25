import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import './Layout.css';

export function Layout() {
  return (
    <div className="layout">
      <Navigation />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>
            &copy; 2025 Platonic Dice |{' '}
            <a
              href="https://github.com/sjs2k20/platonic-dice"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
