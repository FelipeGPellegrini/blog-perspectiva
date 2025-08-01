import React from 'react';
import './BlogHeader.css'; // We'll create this file next

const BlogHeader: React.FC = () => {
  return (
    <header className="blog-header">
      <h1 className="blog-title">
        Perspectiva <span className="blog-title-highlight">Blog</span>
      </h1>
    </header>
  );
};

export default BlogHeader;