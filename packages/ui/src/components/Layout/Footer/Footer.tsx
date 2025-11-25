import { config } from '@config/app.config';
import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {currentYear} {config.app.name} |{' '}
          <a
            href={config.repository.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};
