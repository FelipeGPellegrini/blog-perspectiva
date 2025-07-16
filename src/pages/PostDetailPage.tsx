// src/pages/PostDetailPage.tsx - VERSÃO COM FILTRO (A SOLUÇÃO)

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag as TagIcon } from 'lucide-react';
import PostGallery from '../components/blog/PostGallery';
import MinigameModal from '../components/MinigameModal';
import BannerAd from '../components/BannerAd';
import { Post, StrapiPost } from '../types/Post';
import './PostDetailPage.css';

// Não precisamos mais do Token de API
// const API_TOKEN = '...'; 

interface StrapiRichTextNode { type: 'text'; text: string; bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean; code?: boolean; }
interface StrapiRichTextBlock { type: 'paragraph' | 'heading' | 'list' | 'quote'; children: StrapiRichTextNode[]; level?: 1 | 2 | 3 | 4 | 5 | 6; }

const API_BASE_URL = 'http://172.16.40.195:1337/api/posts';

const getImageUrl = (strapiImageObject: any): string => {
  const fallbackImage = 'https://via.placeholder.com/1200x600.png?text=Imagem+Nao+Encontrada';
  if (strapiImageObject?.url) { return `http://172.16.40.195:1337${strapiImageObject.url}`; }
  return fallbackImage;
};

const convertContentToHtml = (content: any): string => {
    if (typeof content === 'string') return content;
    if (!Array.isArray(content)) return '';
    return content.map((block: StrapiRichTextBlock) => {
        const innerText = block.children.map((child: StrapiRichTextNode) => {
            let text = child.text.replace(/\n/g, '<br>');
            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            if (child.code) return child.text; 
            return text;
        }).join('');
        switch (block.type) {
            case 'heading': return `<h${block.level || 2}>${innerText}</h${block.level || 2}>`;
            case 'paragraph': return `<p>${innerText}</p>`;
            default: return `<p>${innerText}</p>`;
        }
    }).join('');
};

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [minigameOpen, setMinigameOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    // --- MUDANÇA PRINCIPAL AQUI ---
    // Construímos a URL para usar o endpoint de LISTA com um FILTRO de id.
    const urlComFiltro = `${API_BASE_URL}?filters[id][$eq]=${id}&populate=*`;
    
    fetch(urlComFiltro)
    // --------------------------------
      .then(res => {
        if (!res.ok) { throw new Error(`Erro ${res.status}: ${res.statusText}`); }
        return res.json();
      })
      .then((apiResponse: { data: StrapiPost[] | null }) => { // A resposta agora é um ARRAY
        // Verificamos se o array retornado tem pelo menos um item
        if (!apiResponse.data || apiResponse.data.length === 0) {
          navigate('/'); 
        } else {
          // Pegamos o PRIMEIRO (e único) item do array
          const strapiPost = apiResponse.data[0];
          const formattedPost: Post = {
            id: strapiPost.id,
            title: strapiPost.title,
            subtitle: strapiPost.subtitle,
            content: convertContentToHtml(strapiPost.content),
            date: strapiPost.date,
            tags: Array.isArray(strapiPost.tags) ? strapiPost.tags : [strapiPost.tags],
            image: getImageUrl(strapiPost.image),
            gallery: strapiPost.gallery?.map(img => `http://172.16.40.195:1337${img.url}`) || [],
            createdAt: strapiPost.createdAt,
            updatedAt: strapiPost.updatedAt,
            publishedAt: strapiPost.publishedAt,
            bannerImage: getImageUrl(strapiPost.bannerImage),
            bannerLink: strapiPost.bannerLink || '',
          };
          setPost(formattedPost);
        }
      })
      .catch(error => { console.error("☠️ Falha no fetch com Filtro:", error); })
      .finally(() => setLoading(false));
  }, [id, navigate]);
  
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (loading) { return <div className="container">Carregando post...</div>; }
  if (!post) { return <div className="container">Post não encontrado</div>; }

  const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="post-detail-container">
      <Link to="/" className="back-link"><ArrowLeft size={18} /><span>Voltar para todos os posts</span></Link>
      <article className="post-article">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <p className="post-subtitle">{post.subtitle}</p>
          <div className="post-meta">
            <span className="post-date"><Calendar size={16} />{formattedDate}</span>
            <div className="post-tags"><TagIcon size={16} /><div>{post.tags.map((tag, idx) => {
              const tagPrincipal = post.tags[0].split(',')[0].trim();
              return (
                <Link key={tag} to={`/tag/${tagPrincipal}`} className="post-tag">{tag}</Link>
              );
            })}</div></div>
          </div>
        </header>
        <div className="post-featured-image"><img src={post.image} alt={post.title} /></div>
        {/* Banner após o título do post */}
        {post.bannerImage && post.bannerLink && (
          <BannerAd
            imageDesktop={post.bannerImage}
            imageMobile={post.bannerImage}
            fallbackDesktop="/banner-desktop-post1.jpg"
            fallbackMobile="/banner-mobile-post1.jpg"
            link={post.bannerLink}
            alt="Banner do Curso Perspectiva"
          />
        )}
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.gallery && post.gallery.length > 0 && (<PostGallery images={post.gallery} />)}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2.5rem 0 1.5rem 0' }}>
          <button className="minigame-trigger-btn" onClick={() => setMinigameOpen(true)}>
            Iniciar Desafio Rápido!
          </button>
        </div>
        <MinigameModal isOpen={minigameOpen} onClose={() => setMinigameOpen(false)} />
        {/* Banner ao final do post */}
        {post.bannerImage && post.bannerLink && (
          <BannerAd
            imageDesktop={post.bannerImage}
            imageMobile={post.bannerImage}
            fallbackDesktop="/banner-desktop-post1.jpg"
            fallbackMobile="/banner-mobile-post1.jpg"
            link={post.bannerLink}
            alt="Banner do Curso Perspectiva"
          />
        )}
      </article>
    </div>
  );
};

export default PostDetailPage;