import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './PostGallery.css';

interface PostGalleryProps {
  images: string[];
}

const PostGallery: React.FC<PostGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (images.length === 0) return null;
  
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="post-gallery">
      <h3 className="gallery-title">Galeria de Imagens</h3>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="gallery-item"
            onClick={() => openModal(index)}
          >
            <img src={image} alt={`Imagem ${index + 1}`} />
          </div>
        ))}
      </div>
      
      {isModalOpen && (
        <div className="gallery-modal" onClick={closeModal}>
          <button className="modal-close" onClick={closeModal} aria-label="Fechar">
            <X size={24} />
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={images[currentIndex]} alt={`Imagem ${currentIndex + 1}`} />
            <button 
              className="modal-nav modal-prev" 
              onClick={handlePrev}
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="modal-nav modal-next" 
              onClick={handleNext}
              aria-label="Próxima imagem"
            >
              <ChevronRight size={24} />
            </button>
            <div className="modal-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGallery;