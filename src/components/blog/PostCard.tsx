// src/components/blog/PostCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon } from 'lucide-react'; // Renomeado para evitar conflito
import { Post } from '../../types/Post';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <article className={`post-card ${featured ? 'post-card-featured' : ''}`}>
      <Link to={`/post/${post.id}`} className="post-card-link">
        <div className="post-card-image-container">
          <img src={post.image} alt={post.title} className="post-card-image" />
          
          {/* ❌ ERRO CORRIGIDO: A verificação `typeof post.tags === 'string'` era sempre falsa. */}
          {/* ✅ CORREÇÃO: Verificamos se o array 'tags' existe e tem itens. */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-card-tag">
              {/* Mostra a primeira tag do array */}
              {post.tags[0]}
            </div>
          )}

        </div>
        <div className="post-card-content">
          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-subtitle">{post.subtitle}</p>
          <div className="post-card-meta">
            <span className="post-card-date">
              <CalendarIcon size={14} />
              {formattedDate}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;