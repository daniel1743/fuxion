import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categorías del blog enfocadas en sobrepeso, salud y bienestar
  const categories = [
    { id: 'perdida-peso', name: 'Pérdida de Peso', color: 'bg-green-500' },
    { id: 'sobrepeso', name: 'Sobrepeso', color: 'bg-orange-500' },
    { id: 'bienestar', name: 'Bienestar', color: 'bg-purple-500' },
    { id: 'nutricion', name: 'Nutrición', color: 'bg-blue-500' },
    { id: 'recetas', name: 'Recetas Saludables', color: 'bg-pink-500' },
    { id: 'motivacion', name: 'Motivación', color: 'bg-yellow-500' },
  ];

  // Cargar artículos publicados
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los artículos (para admin)
  const fetchAllPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching all posts:', err);
      return [];
    }
  };

  // Obtener artículo por slug
  const getPostBySlug = async (slug) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      // Incrementar vistas
      if (data) {
        await supabase
          .from('blog_posts')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id);
      }

      return data;
    } catch (err) {
      console.error('Error fetching post:', err);
      return null;
    }
  };

  // Crear nuevo artículo
  const createPost = async (postData) => {
    try {
      // Generar slug desde el título
      const slug = postData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{ ...postData, slug }])
        .select()
        .single();

      if (error) throw error;

      // Actualizar lista local
      await fetchPosts();
      return { success: true, data };
    } catch (err) {
      console.error('Error creating post:', err);
      return { success: false, error: err.message };
    }
  };

  // Actualizar artículo
  const updatePost = async (id, postData) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchPosts();
      return { success: true, data };
    } catch (err) {
      console.error('Error updating post:', err);
      return { success: false, error: err.message };
    }
  };

  // Eliminar artículo
  const deletePost = async (id) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPosts();
      return { success: true };
    } catch (err) {
      console.error('Error deleting post:', err);
      return { success: false, error: err.message };
    }
  };

  // Filtrar por categoría
  const getPostsByCategory = (category) => {
    return posts.filter(post => post.category === category);
  };

  // Cargar posts al montar
  useEffect(() => {
    fetchPosts();
  }, []);

  const value = {
    posts,
    loading,
    error,
    categories,
    fetchPosts,
    fetchAllPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    getPostsByCategory,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
