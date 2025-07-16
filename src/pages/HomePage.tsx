// src/pages/HomePage.tsx - VERSÃO CORRIGIDA

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostList from '../components/blog/PostList';
import TagFilter from '../components/blog/TagFilter';
import { Post, StrapiPost } from '../types/Post';
import './HomePage.css';
import BannerAd from '../components/BannerAd';
import PostCard from '../components/blog/PostCard';

const API_URL = 'http://172.16.40.195:1337/api/posts?populate=*&sort=date:desc';

const getImageUrl = (strapiImageObject: StrapiPost['image']): string => {
  const fallbackImage = 'https://via.placeholder.com/800x450.png?text=Imagem+Nao+Encontrada';
  // A estrutura da sua imagem é um pouco diferente, acessamos 'url' diretamente
  if (strapiImageObject?.url) {
    const strapiUrl = 'http://172.16.40.195:1337';
    return `${strapiUrl}${strapiImageObject.url}`;
  }
  return fallbackImage;
};

const HomePage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then((apiResponse: { data: StrapiPost[] }) => {
        // ---- AJUSTE PRINCIPAL AQUI ----
        // Mapeamos a resposta do Strapi, acessando os campos DIRETAMENTE do objeto `strapiPost`
        const formattedPosts: Post[] = apiResponse.data.map(strapiPost => {
          let tagsArr: string[] = [];
          if (Array.isArray(strapiPost.tags)) {
            tagsArr = strapiPost.tags;
          } else if (typeof strapiPost.tags === 'string') {
            tagsArr = strapiPost.tags.split(',').map(t => t.trim()).filter(Boolean);
          }
          return {
            id: strapiPost.id,
            title: strapiPost.title,
            subtitle: strapiPost.subtitle,
            content: Array.isArray(strapiPost.content) ? JSON.stringify(strapiPost.content) : strapiPost.content,
            date: strapiPost.date,
            tags: tagsArr,
            image: getImageUrl(strapiPost.image),
            gallery: strapiPost.gallery?.map(img => `http://172.16.40.195:1337${img.url}`) || [],
            createdAt: strapiPost.createdAt,
            updatedAt: strapiPost.updatedAt,
            publishedAt: strapiPost.publishedAt,
          };
        });
        
        setPosts(formattedPosts);

        const tags = formattedPosts.reduce((acc: string[], post) => {
          if (post.tags) {
             return [...acc, ...post.tags];
          }
          return acc;
        }, []);
        setAllTags([...new Set(tags)]);

      })
      .catch(error => {
        console.error("☠️ Falha grave ao buscar posts no Strapi. O backend está rodando?", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container home-page">
      <header className="page-header">
        <h1 className="page-title">
          {tag ? `Posts sobre "${tag}"` : 'Blog Perspectiva'}
        </h1>
        <p className="page-subtitle">
          {tag 
            ? `Confira nossos artigos sobre ${tag}` 
            : 'Conteúdo inovador, dicas e perspectivas para quem busca crescer e se atualizar.'}
        </p>
      </header>
      
      {loading ? (
        <div className='text-center p-10'>Carregando posts...</div>
      ) : (
        <>
          <TagFilter tags={allTags} />
          {/* Banner principal após o header */}
          {/* Troque as imagens e o link abaixo pelo seu banner de curso */}
          <BannerAd
            imageDesktop="/banner-desktop-home.jpg"
            imageMobile="/banner-mobile-home.jpg"
            fallbackDesktop="/banner-desktop-home.jpg"
            fallbackMobile="/banner-mobile-home.jpg"
            link="https://seucurso.com"
            alt="Banner do Curso Perspectiva"
          />
          {/* Listagem de posts com grid e estilo correto */}
          <PostList posts={posts} filteredTag={tag} />
        </>
      )}
    </div>
  );
};

export default HomePage;