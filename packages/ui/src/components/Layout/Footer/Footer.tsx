import './Footer.css';

export const Footer = () => {
  return (
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
  );
};
