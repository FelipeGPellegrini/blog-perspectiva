import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Header.css';
import logo from '../../assets/Logo-aberta-w.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="logo-container">
          <Link to="/" className="logo-link" aria-label="Perspectiva - Home">
            <div className="logo fade-in">
              <img src={logo} alt="Perspectiva" style={{ width: 120, height: 'auto', filter: 'drop-shadow(0 2px 8px rgba(0,173,166,0.10))' }} />
            </div>
          </Link>
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Sobre
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Contato
              </Link>
            </li>
            {/* Adicione mais links de navegação se necessário */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;