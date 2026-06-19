import React from 'react';
import { Link } from 'react-router-dom';
import { getAllSeoProducts } from '@/lib/productSeo';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeProductName = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const buildProductAliases = () => {
  const aliases = [];

  getAllSeoProducts().forEach((product) => {
    const names = new Set([
      product.name,
      product.id,
      product.name.replace(/\+/g, ' PLUS'),
      product.name.replace(/&/g, 'Y'),
    ]);

    names.forEach((name) => {
      const cleanName = String(name || '').trim();
      if (cleanName.length < 2) return;

      aliases.push({
        label: cleanName,
        normalized: normalizeProductName(cleanName),
        slug: product.slug,
      });
    });
  });

  return aliases.sort((a, b) => b.label.length - a.label.length);
};

const PRODUCT_ALIASES = buildProductAliases();

const ProductLinkedText = ({ text, className = '', onProductClick }) => {
  if (!text || PRODUCT_ALIASES.length === 0) {
    return <p className={className}>{text}</p>;
  }

  const pattern = new RegExp(
    `\\b(${PRODUCT_ALIASES.map((item) => escapeRegExp(item.label)).join('|')})\\b`,
    'gi'
  );

  const parts = String(text).split(pattern).filter(Boolean);

  return (
    <p className={className}>
      {parts.map((part, index) => {
        const match = PRODUCT_ALIASES.find(
          (item) => item.normalized === normalizeProductName(part)
        );

        if (!match) {
          return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
        }

        return (
          <Link
            key={`${part}-${index}`}
            to={`/producto/${match.slug}`}
            onClick={() => onProductClick?.(match)}
            className="font-semibold underline decoration-current/40 underline-offset-4 transition hover:decoration-current"
          >
            {part}
          </Link>
        );
      })}
    </p>
  );
};

export default ProductLinkedText;
