import React from 'react';
import { motion } from 'framer-motion';

/**
 * Extracts headings from markdown content and renders a clickable TOC.
 * Parses # through ### headings.
 */
export function extractHeadings(content) {
  const headings = [];
  const lines = content?.split('\n') || [];
  const regex = /^(#{1,3})\s+(.+)$/;

  for (const line of lines) {
    const match = line.trim().match(regex);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      headings.push({ level, text, id });
    }
  }
  return headings;
}

const TableOfContents = ({ content, className = '' }) => {
  const headings = extractHeadings(content);
  if (headings.length < 3) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-2xl border border-border bg-card/80 p-5 ${className}`}
    >
      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">
        Tabla de Contenidos
      </h3>
      <nav>
        <ul className="space-y-1.5">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`text-muted-foreground hover:text-foreground transition-colors block ${
                  heading.level === 2 ? 'font-medium' : 'pl-4 text-sm'
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default TableOfContents;
