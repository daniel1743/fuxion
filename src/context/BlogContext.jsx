import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CATEGORY_CATALOG } from '@/lib/categoryCatalog';

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

  const categories = CATEGORY_CATALOG;

  // Normalize a record to a unified "post" shape
  const normalizePost = (record, source) => ({
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    content: record.content,
    image_url: record.image_url,
    category: record.category || source,
    tags: record.tags || '',
    author: record.author || record.editor_name || 'Daniel Falcón',
    views: record.views || 0,
    is_published: record.is_published !== false,
    created_at: record.created_at || record.published_at,
    updated_at: record.updated_at || record.created_at,
    source,
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const [blogRes, wellnessRes] = await Promise.all([
        supabase.from('blog_posts').select('*').eq('is_published', true).order('created_at', { ascending: false }),
        supabase.from('wellness_articles').select('*').eq('is_published', true).order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }),
      ]);

      const blogPosts = (blogRes.data || []).map(r => normalizePost(r, 'blog_posts'));
      const wellnessPosts = (wellnessRes.data || []).map(r => normalizePost(r, 'wellness_articles'));

      const allPosts = [...blogPosts, ...wellnessPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(allPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const [blogRes, wellnessRes] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('wellness_articles').select('*').order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }),
      ]);
      const blogPosts = (blogRes.data || []).map(r => normalizePost(r, 'blog_posts'));
      const wellnessPosts = (wellnessRes.data || []).map(r => normalizePost(r, 'wellness_articles'));
      return [...blogPosts, ...wellnessPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (err) {
      console.error('Error fetching all posts:', err);
      return [];
    }
  };

  const getPostBySlug = async (slug) => {
    try {
      let post = await supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle();
      if (post.data) {
        await supabase.from('blog_posts').update({ views: (post.data.views || 0) + 1 }).eq('id', post.data.id);
        return normalizePost(post.data, 'blog_posts');
      }
      post = await supabase.from('wellness_articles').select('*').eq('slug', slug).maybeSingle();
      if (post.data) return normalizePost(post.data, 'wellness_articles');
      return null;
    } catch (err) {
      console.error('Error fetching post:', err);
      return null;
    }
  };

  const createPost = async (postData) => {
    try {
      const slug = postData.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const { data, error } = await supabase.from('blog_posts').insert([{ ...postData, slug }]).select().single();
      if (error) throw error;
      await fetchPosts();
      return { success: true, data };
    } catch (err) {
      console.error('Error creating post:', err);
      return { success: false, error: err.message };
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const { data, error } = await supabase.from('blog_posts').update(postData).eq('id', id).select().single();
      if (error) throw error;
      await fetchPosts();
      return { success: true, data };
    } catch (err) {
      console.error('Error updating post:', err);
      return { success: false, error: err.message };
    }
  };

  const deletePost = async (id) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      await fetchPosts();
      return { success: true };
    } catch (err) {
      console.error('Error deleting post:', err);
      return { success: false, error: err.message };
    }
  };

  const getPostsByCategory = (category) => posts.filter(post => post.category === category);

  useEffect(() => { fetchPosts(); }, []);

  const value = { posts, loading, error, categories, fetchPosts, fetchAllPosts, getPostBySlug, createPost, updatePost, deletePost, getPostsByCategory };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export default BlogContext;
