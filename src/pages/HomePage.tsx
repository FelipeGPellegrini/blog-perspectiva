// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostList from '../components/blog/PostList';
import { Post, Tag } from '../types/Post';
import './HomePage.css';
import '../components/blog/TagFilter.css';
import BannerAd from '../components/BannerAd';
import Pagination from '../components/Pagination';

// ✅ Tipos ajustados para a estrutura REAL da sua API (sem 'attributes')
interface StrapiImage {
  data: {
    attributes: {
      url: string;
    };
  } | null;
}
interface StrapiPost {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  image: StrapiImage | null; // A imagem pode não existir
  tags: string | null;      // As tags podem não existir
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
interface StrapiApiResponse {
  data: (StrapiPost | null)[]; // A API pode retornar itens nulos no array
}

const strapiUrl = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 8;

// Função de imagem ajustada para ser mais segura
const getImageUrl = (strapiImage: StrapiImage | null): string => {
  const fallbackImage = 'https://via.placeholder.com/800x450.png?text=Imagem+Nao+Encontrada';
  const imageUrl = strapiImage?.data?.attributes?.url;

  if (imageUrl) {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${strapiUrl}${imageUrl}`;
  }
  return fallbackImage;
};

const HomePage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();

  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    // A query `populate=image` é importante para garantir que os dados da imagem venham
    const allDataUrl = `${strapiUrl}/api/posts?populate=image&sort=date:desc&pagination[pageSize]=200`;

    fetch(allDataUrl)
      .then(res => res.json())
      .then((apiResponse: StrapiApiResponse) => {
        const postsData = apiResponse.data || [];

        // ✅ LÓGICA DE MAPEAMENTO CORRIGIDA
        const formattedPosts: Post[] = postsData
          // 1. Filtra qualquer post que seja nulo ou indefinido na resposta da API
          .filter((post): post is StrapiPost => post !== null && post !== undefined)
          // 2. Mapeia os posts válidos
          .map((post: StrapiPost) => {
            
            // ❌ REMOVIDO: const { attributes } = post;
            // ✅ CORREÇÃO: Acessamos `post.tags` e `post.title` diretamente.
            
            const tagsArray = typeof post.tags === 'string'
              ? post.tags.split(',').map(t => t.trim()).filter(t => t)
              : [];

            return {
              id: post.id,
              title: post.title,
              subtitle: post.subtitle,
              date: post.date,
              image: getImageUrl(post.image),
              tags: tagsArray,
              // Campos padrão
              content: '', 
              gallery: [],
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
              publishedAt: post.publishedAt,
            };
          });
        setAllPosts(formattedPosts);

        // A lógica de extração de tags a partir daqui já estava correta
        const allTagNames = new Set<string>();
        formattedPosts.forEach(p => {
          p.tags.forEach(tagName => allTagNames.add(tagName));
        });
        
        const formattedTags: Tag[] = Array.from(allTagNames).map((name, index) => ({ id: index, name }));
        setAvailableTags(formattedTags);
      })
      .catch(error => {
        // O erro que você viu será capturado aqui
        console.error("☠️ Falha ao processar dados iniciais. Verifique a estrutura do JSON.", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // O restante do componente (lógica de paginação e JSX) não precisa de mudanças
  // e funcionará corretamente com os dados corrigidos.

  useEffect(() => {
    const filteredPosts = tag
      ? allPosts.filter(p => p.tags.includes(tag))
      : allPosts;

    setPageCount(Math.ceil(filteredPosts.length / PAGE_SIZE));
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);
    setDisplayedPosts(paginatedPosts);
  }, [tag, currentPage, allPosts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tag]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pageCount) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container home-page">
      <BannerAd
        imageDesktop="/banner-desktop-home.jpg"
        imageMobile="/banner-mobile-home.jpg"
        link="https://pmesp.cursoperspectiva.com/soldado-pmesp"
        alt="Banner do Curso Perspectiva"
      />
      <div className="tag-filter-container">
        <h3 className="tag-filter-title">Filtrar por Assunto</h3>
        <nav className="tag-cloud">
          <Link to="/" className={`tag-item ${!tag ? 'active' : ''}`}>Todos</Link>
          {availableTags.map(t => (
            <Link to={`/tag/${t.name}`} key={t.id} className={`tag-item ${tag === t.name ? 'active' : ''}`}>{t.name}</Link>
          ))}
        </nav>
      </div>
      {loading ? (
        <div className='text-center p-10 font-semibold'>Carregando...</div>
      ) : (
        <>
          {displayedPosts.length > 0 ? (
            <PostList posts={displayedPosts} />
          ) : (
            <div className='text-center p-10 font-semibold'>Nenhum post encontrado para esta seleção.</div>
          )}
          <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default HomePage;