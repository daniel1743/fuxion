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

const CategoryPage = () => {
  const { categorySlug } = useParams();

  if (!categorySlug || !VALID_CATEGORIES.includes(categorySlug)) {
    return <Navigate to="/explorar" replace />;
  }

  // We render ExplorePage which reads ?categoria= from URL params.
  // The route /categoria/:slug will pass the slug, but ExplorePage
  // reads from useSearchParams. We need to handle this differently.
  // Instead, we'll use a wrapper that sets the search params.
  return <CategoryRedirect slug={categorySlug} />;
};

/**
 * This component sets the category via a redirect with search params.
 * It renders ExplorePage which reads ?categoria= from the URL.
 */
const CategoryRedirect = ({ slug }) => {
  return <Navigate to={`/explorar?categoria=${slug}`} replace />;
};

export default CategoryPage;
