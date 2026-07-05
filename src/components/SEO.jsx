import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_URL, STORE_NAME } from '@/lib/productSeo';

/**
 * SEO component — reusable Helmet wrapper for consistent meta tags across all pages.
 *
 * Props:
 *   title         — Page title (appended with " | Tienda Fuxion Chile")
 *   description   — Meta description
 *   canonical     — Canonical URL path (e.g. "/producto/thermo-t3")
 *   ogType        — Open Graph type (default: "website")
 *   ogImage       — Open Graph image URL
 *   noindex       — If true, sets robots to noindex
 *   schema        — Optional array of schema.org JSON-LD objects
 *   children      — Additional Helmet children (e.g. extra meta tags)
 */
const SEO = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = `${SITE_URL}/img/familia.fuxion.png`,
  noindex = false,
  schema = [],
  children
}) => {
  const fullTitle = title ? `${title} | ${STORE_NAME}` : STORE_NAME;
  const url = canonical ? `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content={STORE_NAME} />
      <meta property="og:locale" content="es_CL" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org JSON-LD */}
      {schema.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}

      {children}
    </Helmet>
  );
};

export default SEO;
