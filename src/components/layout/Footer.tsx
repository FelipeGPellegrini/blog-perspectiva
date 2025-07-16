import React, { useEffect, useState } from 'react';
import { Instagram, Youtube } from 'lucide-react';
import './Footer.css';

const INSTAGRAM_SP = 'https://www.instagram.com/perspectiva.pmesp/';
const INSTAGRAM_PRINCIPAL = 'https://www.instagram.com/perspectiva.cbmerj/';
const YOUTUBE = 'https://www.youtube.com/@perspectiva.bombeiromilitar';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [instagramUrl, setInstagramUrl] = useState(INSTAGRAM_PRINCIPAL);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Região aproximada de São Paulo (latitude -23.5 a -23.7, longitude -46.3 a -46.8)
          if (latitude < -23.4 && latitude > -24 && longitude < -46.3 && longitude > -47) {
            setInstagramUrl(INSTAGRAM_SP);
          } else {
            setInstagramUrl(INSTAGRAM_PRINCIPAL);
          }
        },
        () => setInstagramUrl(INSTAGRAM_PRINCIPAL),
        { timeout: 2000 }
      );
    }
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-social">
          <h3 className="footer-heading">Siga-nos</h3>
          <div className="social-icons">
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Instagram"
            >
              <Instagram size={28} />
            </a>
            <a 
              href={YOUTUBE} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="YouTube"
            >
              <Youtube size={28} />
            </a>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {currentYear} Perspectiva. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;