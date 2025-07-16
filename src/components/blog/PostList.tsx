import React from 'react';
import PostCard from './PostCard';
import { Post } from '../../types/Post';
import './PostList.css';

interface PostListProps {
  posts: Post[];
  filteredTag?: string;
}

const PostList: React.FC<PostListProps> = ({ posts, filteredTag }) => {
  // Filter posts if a tag is selected
  const filteredPosts = filteredTag
    ? posts.filter(post => post.tags.includes(filteredTag))
    : posts;

  if (filteredPosts.length === 0) {
    return (
      <div className="no-posts">
        <h2>Nenhum post encontrado</h2>
        {filteredTag && (
          <p>Não existem posts com a tag "{filteredTag}".</p>
        )}
      </div>
    );
  }

  return (
    <section className="posts-grid">
      {filteredPosts.map((post, index) => (
        <PostCard 
          key={post.id} 
          post={post} 
          featured={index === 0 && !filteredTag}
        />
      ))}
    </section>
  );
};

export default PostList;