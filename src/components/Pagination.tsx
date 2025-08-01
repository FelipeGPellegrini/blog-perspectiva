// src/components/Pagination.tsx

import React from 'react';
// Importa nossos estilos locais
import styles from './Pagination.module.css';

// Ícones de seta em SVG para um visual mais limpo
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);


// Definindo as propriedades que o componente espera receber
interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, pageCount, onPageChange }) => {
  // Se houver apenas 1 página (ou nenhuma), não mostra o controle
  if (pageCount <= 1) {
    return null;
  }

  const handlePrev = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <nav className={styles.pagination} aria-label="Navegação de posts">
      <button 
        className={styles.button}
        onClick={handlePrev} 
        disabled={currentPage === 1}
        aria-label="Ir para a página anterior"
      >
        <ArrowLeftIcon />
      </button>

      <span className={styles.pageInfo} aria-current="page">
        Página {currentPage} de {pageCount}
      </span>

      <button
        className={styles.button}
        onClick={handleNext}
        disabled={currentPage >= pageCount}
        aria-label="Ir para a próxima página"
      >
        <ArrowRightIcon />
      </button>
    </nav>
  );
};

export default Pagination;