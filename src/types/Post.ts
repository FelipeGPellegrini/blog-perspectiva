// src/types/Post.ts - VERSÃO CORRIGIDA

// Este tipo representa o que NOSSOS COMPONENTES REACT USAM.
export interface Post {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  content: string;
  date: string;
  tags: string[];
  gallery?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  bannerImage?: string; // URL da imagem do banner
  bannerLink?: string;  // Link do banner
}

// Interface para um objeto de mídia da sua API
interface StrapiMedia {
  id: number;
  url: string;
  // adicione outros campos da mídia se precisar, como width, height, etc.
}

// Este tipo representa o que a API DO STRAPI NOS ENVIA
export interface StrapiPost {
  id: string;
  title: string;
  subtitle: string;
  content: any; // O content vem como um array de objetos, então 'any' é mais seguro aqui
  date: string;
  tags: string | string[]; // Suas tags podem vir como string ou array
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: StrapiMedia;
  gallery: StrapiMedia[];
  bannerImage?: StrapiMedia; // Objeto de mídia do Strapi
  bannerLink?: string;
}