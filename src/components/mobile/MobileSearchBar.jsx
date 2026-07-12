import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';

const MobileSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (onSearch) onSearch(trimmed);
    navigate(`/explorar?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 pt-4"
    >
      <form
        onSubmit={handleSubmit}
        className="flex h-12 items-center gap-3 rounded-full border border-gray-100 bg-white px-4 shadow-sm transition-shadow focus-within:shadow-md"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="shrink-0 text-gray-400"
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos, objetivos o ingredientes..."
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
        />
      </form>
    </motion.div>
  );
};

export default MobileSearchBar;
