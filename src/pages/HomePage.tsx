// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostList from '../components/blog/PostList';
import { Post, Tag } from '../types/Post';
import './HomePage.css';
import '../components/blog/TagFilter.css';
import BannerAd from '../components/BannerAd';
import Pagination from '../components/Pagination';
import BlogHeader from '../components/BlogHeader';
import PopupBanner from '../components/PopupBanner';

const strapiUrl = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 8;

// ✅ A NOVA FUNÇÃO DE IMAGEM UNIVERSAL
// Esta função é robusta e funciona com as duas estruturas de dados da sua API.
const getImageUrl = (strapiImageObject: any): string => {
  const fallbackImage = 'https://placehold.co/800x450/EEE/31343C?text=Imagem+Indisponivel';

  if (!strapiImageObject) {
    return fallbackImage;
  }

  // 1. Tenta a estrutura complexa (comum em listas do Strapi v4): { data: { attributes: { url: '...' } } }
  const nestedUrl = strapiImageObject?.data?.attributes?.url;
  if (nestedUrl) {
    // Se a URL for completa, retorna. Senão, adiciona o strapiUrl.
    return nestedUrl.startsWith('http') ? nestedUrl : `${strapiUrl}${nestedUrl}`;
  }

  // 2. Tenta a estrutura simples (que funciona na sua PostDetailPage): { url: '...' }
  const directUrl = strapiImageObject?.url;
  if (directUrl) {
    // Se a URL for completa, retorna. Senão, adiciona o strapiUrl.
    return directUrl.startsWith('http') ? directUrl : `${strapiUrl}${directUrl}`;
  }
  
  // 3. Se nenhuma das duas estruturas funcionar, retorna a imagem de fallback.
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
    // Usando `populate=*` para garantir que o objeto `image` seja incluído na resposta.
    const allDataUrl = `${strapiUrl}/api/posts?populate=*&sort=date:desc&pagination[pageSize]=200`;

    fetch(allDataUrl)
      .then(res => res.json())
      .then((apiResponse: any) => {
        // A resposta da sua API não tem a camada 'attributes', o que está correto.
        const postsData = apiResponse.data || [];

        const formattedPosts: Post[] = postsData
          .filter((post: any) => post !== null && post !== undefined)
          .map((post: any) => {
            const tagsArray = typeof post.tags === 'string'
              ? post.tags.split(',').map(t => t.trim()).filter(t => t)
              : [];

            return {
              id: post.id,
              title: post.title,
              subtitle: post.subtitle,
              date: post.date,
              image: getImageUrl(post.image), // Chamando a nova função universal
              tags: tagsArray,
              content: '', gallery: [],
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
              publishedAt: post.publishedAt,
            };
          });
        setAllPosts(formattedPosts);

        const allTagNames = new Set<string>();
        formattedPosts.forEach(p => {
          p.tags.forEach(tagName => allTagNames.add(tagName));
        });
        
        const formattedTags: Tag[] = Array.from(allTagNames).map((name, index) => ({ id: index, name }));
        setAvailableTags(formattedTags);
      })
      .catch(error => console.error("☠️ Falha ao buscar dados iniciais.", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filteredPosts = tag
      ? allPosts.filter(post => post.tags.includes(tag))
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
    // Seu JSX permanece o mesmo.
    <div className="container home-page">
      <BlogHeader />
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
      <PopupBanner 
        imageUrl="https://res.cloudinary.com/dvdwmeih3/image/upload/v1754059105/Sem_T%C3%ADtulo-1_le5aph.png" 
        linkUrl="https://cursoperspectiva.com/" 
        altText="Ad" 
      />
    </div>
  );
};

export default HomePage;