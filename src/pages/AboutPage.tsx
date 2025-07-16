import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="container about-page">
      <header className="page-header">
        <h1 className="page-title">Sobre o Blog</h1>
        <p className="page-subtitle">O Perspectiva é um portal dedicado a informar, orientar e inspirar quem busca uma carreira militar. Aqui você encontra notícias, dicas, recomendações de materiais e tudo o que precisa para se preparar para concursos das forças de segurança.</p>
      </header>
      
      <div className="about-content">
        <section className="about-section">
          <h2>Quem Somos</h2>
          <p>O Perspectiva nasceu com a missão de preparar futuros militares, fornecendo informação de qualidade, orientação estratégica e apoio para quem deseja conquistar uma vaga nas principais instituições de segurança pública do Brasil.</p>
        </section>
        <section className="about-section">
          <h2>Missão</h2>
          <p>Informar, motivar e apoiar candidatos de concursos militares, oferecendo conteúdo relevante, atualizações e recomendações para uma preparação completa.</p>
        </section>
        <section className="about-section">
          <h2>Visão</h2>
          <p>Ser referência nacional em informação e orientação para quem sonha em ingressar nas carreiras militares e de segurança pública.</p>
        </section>
        <section className="about-section">
          <h2>Diferenciais</h2>
          <div className="differentials">
            <div className="differential-item">
              <h3>Conteúdo Atualizado</h3>
              <p>Notícias, editais, dicas e novidades sobre concursos militares e de segurança.</p>
            </div>
            <div className="differential-item">
              <h3>Recomendações de Materiais</h3>
              <p>Indicação de livros, apostilas, videoaulas e recursos para potencializar seus estudos.</p>
            </div>
            <div className="differential-item">
              <h3>Equipe Especializada</h3>
              <p>Colaboradores com experiência em concursos e carreiras militares, prontos para orientar e motivar você.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;