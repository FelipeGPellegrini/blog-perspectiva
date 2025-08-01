import React, { useState, useEffect } from 'react';
import './PopupBanner.css'; // Vamos criar este arquivo a seguir

// As propriedades que nosso componente vai aceitar
interface PopupBannerProps {
  imageUrl: string;
  linkUrl: string;
  altText: string;
}

const PopupBanner: React.FC<PopupBannerProps> = ({ imageUrl, linkUrl, altText }) => {
  // Estado para controlar se o banner está visível
  const [isVisible, setIsVisible] = useState(false);
  // Estado para controlar se o usuário já fechou o banner
  const [isClosed, setIsClosed] = useState(false);

  // Efeito que dispara o aparecimento do banner
  useEffect(() => {
    // Define um timer para mostrar o banner após 5 segundos
    const timer = setTimeout(() => {
      // Só mostra se o usuário ainda não o fechou
      if (!isClosed) {
        setIsVisible(true);
      }
    }, 5000); // 5000 milissegundos = 5 segundos

    // Limpa o timer se o componente for desmontado (boa prática)
    return () => clearTimeout(timer);
  }, [isClosed]); // Depende de 'isClosed' para não reaparecer

  // Função para fechar o banner
  const handleClose = () => {
    setIsVisible(false);
    setIsClosed(true); // Marca que foi fechado para não reaparecer
  };

  // Se não for para ser visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`popup-banner ${isVisible ? 'visible' : ''}`}>
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="popup-banner-link">
        <img src={imageUrl} alt={altText} className="popup-banner-image" />
      </a>
      <button onClick={handleClose} className="popup-banner-close" aria-label="Fechar anúncio">
        &times;
      </button>
    </div>
  );
};

export default PopupBanner;