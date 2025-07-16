import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tag } from 'lucide-react';
import './TagFilter.css';

interface TagFilterProps {
  tags: string[];
}

const TagFilter: React.FC<TagFilterProps> = ({ tags }) => {
  const { tag } = useParams<{ tag: string }>();
  
  // Remove duplicates
  const uniqueTags = [...new Set(tags)];
  
  return (
    <div className="tag-filter">
      <div className="tag-filter-header">
        <Tag size={18} />
        <h3>Filtrar por assunto</h3>
      </div>
      <div className="tags-list">
        <Link 
          to="/" 
          className={`tag-item ${!tag ? 'tag-active' : ''}`}
        >
          Todos
        </Link>
        {uniqueTags.map((tagName) => (
          <Link 
            key={tagName} 
            to={`/tag/${tagName}`} 
            className={`tag-item ${tag === tagName ? 'tag-active' : ''}`}
          >
            {tagName}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;