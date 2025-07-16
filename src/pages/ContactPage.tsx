import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram } from 'lucide-react';
import './ContactPage.css';

const INSTAGRAM_SP = 'https://www.instagram.com/perspectiva.pmesp/';
const INSTAGRAM_RJ = 'https://www.instagram.com/perspectiva.cbmerj/';
const USER_SP = '@perspectiva.pmesp';
const USER_RJ = '@perspectiva.cbmerj';

const ContactPage: React.FC = () => {
  const [instagramUrl, setInstagramUrl] = useState(INSTAGRAM_RJ);
  const [instagramUser, setInstagramUser] = useState(USER_RJ);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Região aproximada de São Paulo (latitude -23.4 a -24, longitude -46.3 a -47)
          if (latitude < -23.4 && latitude > -24 && longitude < -46.3 && longitude > -47) {
            setInstagramUrl(INSTAGRAM_SP);
            setInstagramUser(USER_SP);
          } else {
            setInstagramUrl(INSTAGRAM_RJ);
            setInstagramUser(USER_RJ);
          }
        },
        () => {
          setInstagramUrl(INSTAGRAM_RJ);
          setInstagramUser(USER_RJ);
        },
        { timeout: 2000 }
      );
    }
  }, []);

  return (
    <div className="container contact-page">
      <header className="page-header">
        <h1 className="page-title">Contato</h1>
        <p className="page-subtitle">Entre em contato com a nossa equipe</p>
      </header>
      
      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon">
              <i className="fa-brands fa-instagram" style={{ fontSize: 24 }}></i>
            </div>
            <div className="contact-details">
              <h3>Instagram</h3>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <p>{instagramUser}</p>
                <span className="contact-button">Acessar Instagram</span>
              </a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">
              <i className="fa-brands fa-whatsapp" style={{ fontSize: 24 }}></i>
            </div>
            <div className="contact-details">
              <h3>WhatsApp</h3>
              <p>(21) 97035-2343</p>
              <a href="https://api.whatsapp.com/send/?phone=5521970352343" target="_blank" rel="noopener noreferrer" className="contact-button">Enviar mensagem</a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">
              <i className="fa-solid fa-envelope" style={{ fontSize: 24 }}></i>
            </div>
            <div className="contact-details">
              <h3>E-mail</h3>
              <p>contato@cursoperspectiva.com.br</p>
              <a href="mailto:contato@cursoperspectiva.com.br" className="contact-button">Enviar e-mail</a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">
              <i className="fa-solid fa-location-dot" style={{ fontSize: 24 }}></i>
            </div>
            <div className="contact-details">
              <h3>Endereço</h3>
              <p>Avenida Presidente Wilson, N°165</p>
              <p>Rio de Janeiro, RJ.</p>
              <a href="https://maps.app.goo.gl/qVDVqu5rBnHPvmC28" target="_blank" rel="noopener noreferrer" className="contact-button">Ver no mapa</a>
            </div>
          </div>
        </div>
        <div className="contact-hours">
          <h3>Horário de Atendimento</h3>
          {/* Substitua o horário abaixo pelo horário do Ponto do Concurseiro */}
          <p>Segunda a Sexta: 08:00 às 17:00</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;