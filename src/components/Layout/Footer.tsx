import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const version = import.meta.env.VERSION || "1.0.0";

  return (
    <footer className="layout-footer">
      <div className="footer-content">
        <span className="footer-text">By</span>
        <a 
          href="https://williamsena13.github.io/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
        >
          <strong>Bassena Dev</strong>
        </a>
        <span className="footer-text">&copy; {currentYear}.</span>
        <small className="footer-version">V. {version}</small>
      </div>
    </footer>
  );
};

export default Footer;