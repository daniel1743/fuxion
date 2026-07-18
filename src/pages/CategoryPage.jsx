import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ExplorePage from './ExplorePage';

/**
 * Clean URL category page (/categoria/control-peso)
 * Redirects to /explorar?categoria=control-peso internally,
 * preserving the clean URL for SEO while reusing ExplorePage logic.
 */
const VALID_CATEGORIES = [
  'limpieza-desintoxicacion',
  'proteinas-nutricion',
  'energia-natural',
  'sistema-inmune',
  'control-peso',
  'anti-edad-belleza',
  'vigor-mental',
  'deportes',
];

import { getCategoryBySlug } from '@/lib/categoryCatalog';
import BlogCategoryPage from './BlogCategoryPage';

const CategoryPage = () => {
  const { categorySlug } = useParams();

  // If it's a Fuxion product category, redirect to ExplorePage
  if (VALID_CATEGORIES.includes(categorySlug)) {
    return <CategoryRedirect slug={categorySlug} />;
  }

  // If it's a Blog category, render the semantic hub
  const blogCategory = getCategoryBySlug(categorySlug);
  if (blogCategory) {
    return <BlogCategoryPage slug={categorySlug} />;
  }

  // Otherwise, redirect to root
  return <Navigate to="/" replace />;
};

/**
 * This component sets the category via a redirect with search params.
 * It renders ExplorePage which reads ?categoria= from the URL.
 */
const CategoryRedirect = ({ slug }) => {
  return <Navigate to={`/explorar?categoria=${slug}`} replace />;
};

export default CategoryPage;
