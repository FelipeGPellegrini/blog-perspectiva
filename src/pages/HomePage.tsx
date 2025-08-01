import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostList from '../components/blog/PostList';
import { Post, Tag } from '../types/Post';
import './HomePage.css';
import '../components/blog/TagFilter.css';
import BannerAd from '../components/BannerAd';
import Pagination from '../components/Pagination';

const strapiUrl = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 8;

// A função getImageUrl continua a mesma, está correta.
const getImageUrl = (strapiImageObject: any): string => {
  const fallbackImage = 'https://via.placeholder.com/800x450.png?text=Imagem+Nao+Encontrada';
  if (strapiImageObject?.url) {
    const imageUrl = strapiImageObject.url;
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
    // A URL de fetch pode ser mais simples se 'tags' é só um campo de texto
    const allDataUrl = `${strapiUrl}/api/posts?populate=image&sort=date:desc&pagination[pageSize]=200`;

    fetch(allDataUrl)
      .then(res => res.json())
      .then((apiResponse: any) => {
        const postsData = apiResponse.data || [];

        // ✅ 1. MAPEAMENTO CORRETO PARA TAGS EM STRING
        const formattedPosts: Post[] = postsData.map((post: any) => {
          const attributes = post.attributes || post;
          // Converte a string de tags em um array de strings
          const tagsArray = typeof attributes.tags === 'string'
            ? attributes.tags.split(',').map(t => t.trim()).filter(t => t) // Remove tags vazias
            : [];

          return {
            id: post.id,
            title: attributes.title,
            subtitle: attributes.subtitle,
            date: attributes.date,
            image: getImageUrl(attributes.image?.data?.attributes),
            tags: tagsArray, // Salva o array de tags
            content: '', gallery: [],
            createdAt: attributes.createdAt,
            updatedAt: attributes.updatedAt,
            publishedAt: attributes.publishedAt,
          };
        });
        setAllPosts(formattedPosts);

        // ✅ 2. EXTRAÇÃO DE TAGS ÚNICAS A PARTIR DO ARRAY
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
    // ✅ 3. FILTRO FUNCIONANDO CORRETAMENTE COM O ARRAY DE TAGS
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
    // O JSX restante está correto e não precisa de alterações.
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