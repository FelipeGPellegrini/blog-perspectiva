import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tag } from '../types/Post'; // Certifique-se de que este caminho está correto para seus tipos
import './TagFilter.css';

interface TagFilterProps {
  tags: Tag[];
}

const TagFilter: React.FC<TagFilterProps> = ({ tags }) => {
  const { tag: activeTag } = useParams<{ tag: string }>();

  return (
    <div className="tag-filter-container">
      <h3 className="tag-filter-title">Filtrar por Assunto</h3>
      <nav className="tag-cloud">
        <Link 
          to="/" 
          className={`tag-item ${!activeTag ? 'active' : ''}`}
        >
          Todos
        </Link>

        {/* Bloco de código corrigido */}
        {tags.map((tag) => (
          <Link
            key={tag.id}
            to={`/tags/${tag.name}`}
            className={`tag-item ${activeTag === tag.name ? 'active' : ''}`}
          >
            {tag.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default TagFilter;