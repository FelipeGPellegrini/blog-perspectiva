// src/pages/PostDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag as TagIcon } from 'lucide-react';
import PostGallery from '../components/blog/PostGallery';
import MinigameModal from '../components/MinigameModal';
import BannerAd from '../components/BannerAd';
import { Post } from '../types/Post'; // Removido StrapiPost daqui, pois definimos localmente
import './PostDetailPage.css';

// ✅ Tipos locais para este componente, garantindo consistência
interface StrapiImageAttributes { url: string; }
interface StrapiImage { data: { attributes: StrapiImageAttributes; } | null; }
interface StrapiPostData {
  id: number;
  attributes: {
    title: string;
    subtitle: string;
    content: any; // O conteúdo pode ser string ou objeto rich text
    date: string;
    tags: string; // As tags vêm como uma string
    image: StrapiImage;
    gallery: { data: StrapiImage[] | null };
    bannerImage: StrapiImage;
    bannerLink: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
}
interface StrapiApiResponse { data: StrapiPostData[] | null; }

interface StrapiRichTextNode { type: 'text'; text: string; bold?: boolean; italic?: boolean; code?: boolean; }
interface StrapiRichTextBlock { type: 'paragraph' | 'heading'; children: StrapiRichTextNode[]; level?: 1 | 2 | 3 | 4 | 5 | 6; }

const strapiUrl = import.meta.env.VITE_API_URL;

const getImageUrl = (strapiImage: StrapiImage | null): string => {
  const fallbackImage = 'https://via.placeholder.com/1200x600.png?text=Imagem+Nao+Encontrada';
  const imageUrl = strapiImage?.data?.attributes?.url;

  if (imageUrl) {
    if (imageUrl.startsWith('http')) { return imageUrl; }
    return `${strapiUrl}${imageUrl}`;
  }
  return fallbackImage;
};

const convertContentToHtml = (content: any): string => {
    // Sua função está correta, sem alterações.
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
    
    const urlComFiltro = `${strapiUrl}/api/posts?filters[id][$eq]=${id}&populate=*`;
    
    fetch(urlComFiltro)
      .then(res => {
        if (!res.ok) { throw new Error(`Erro ${res.status}: ${res.statusText}`); }
        return res.json();
      })
      .then((apiResponse: StrapiApiResponse) => {
        if (!apiResponse.data || apiResponse.data.length === 0) {
          navigate('/'); 
        } else {
          const strapiPost = apiResponse.data[0];
          const { attributes } = strapiPost;
          
          // ❌ ERRO CORRIGIDO AQUI: As tags eram `['PMESP, SP']`
          // ✅ AGORA SÃO: `['PMESP', 'SP']`
          const tagsArray = typeof attributes.tags === 'string'
            ? attributes.tags.split(',').map(t => t.trim()).filter(t => t)
            : [];
            
          const formattedPost: Post = {
            id: strapiPost.id,
            title: attributes.title,
            subtitle: attributes.subtitle,
            content: convertContentToHtml(attributes.content),
            date: attributes.date,
            tags: tagsArray, // ✅ Salva o array de tags corrigido
            image: getImageUrl(attributes.image),
            gallery: attributes.gallery.data?.map(img => getImageUrl({data: img})) || [],
            createdAt: attributes.createdAt,
            updatedAt: attributes.updatedAt,
            publishedAt: attributes.publishedAt,
            // Adicionei os campos de banner aqui também, caso existam na sua definição de Post
            bannerImage: getImageUrl(attributes.bannerImage),
            bannerLink: attributes.bannerLink || '',
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
            {/* ❌ LÓGICA DE EXIBIÇÃO DE TAGS CORRIGIDA */}
            {post.tags.length > 0 && (
              <div className="post-tags">
                <TagIcon size={16} />
                <div>
                  {/* ✅ Agora percorremos o array de tags e criamos um link para cada uma */}
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/tag/${tag}`} className="post-tag">{tag}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="post-featured-image"><img src={post.image} alt={post.title} /></div>
        
        {/* O restante do seu JSX está correto */}
        
      </article>
    </div>
  );
};

export default PostDetailPage;