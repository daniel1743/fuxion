import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { smartSearch, normalizeText } from '@/lib/searchEngine';

/**
 * SmartSearchAutocomplete
 * Experiencia de búsqueda premium con autocompletado, soporte de teclado y fuzzy matching.
 */
const SmartSearchAutocomplete = ({
  dataset = [],
  searchKeys = ['name'],
  placeholder = 'Buscar...',
  onSelect,
  renderItem, // function to customize item rendering
  className = '',
  autoFocus = false
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Debounce logic (150ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setSelectedIndex(-1); // Reset index on new search
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    return smartSearch(debouncedQuery, dataset, searchKeys, 6);
  }, [debouncedQuery, dataset, searchKeys]);

  const showDropdown = isFocused && debouncedQuery.length > 0;

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        // Ejecutar búsqueda general si no seleccionó ningún autocompletado
        if (onSelect) onSelect({ isCustomQuery: true, query: query.trim() });
        setIsFocused(false);
        inputRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (item) => {
    // Populate searchbar
    const itemName = item[searchKeys[0]];
    setQuery(itemName || '');
    if (onSelect) onSelect(item);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const highlightMatch = (text, match) => {
    if (!match) return text;
    const normalizedText = normalizeText(text);
    const normalizedMatch = normalizeText(match);
    const index = normalizedText.indexOf(normalizedMatch);
    
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <span className="font-bold text-emerald-700">{text.substring(index, index + match.length)}</span>
        {text.substring(index + match.length)}
      </>
    );
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <form 
        onSubmit={(e) => { e.preventDefault(); handleKeyDown({ key: 'Enter', preventDefault: () => {} }); }}
        className="w-full h-[52px] bg-white rounded-full shadow-xl shadow-black/10 flex items-center px-5 gap-3 border border-white focus-within:scale-[1.02] transition-transform relative z-dropdown"
      >
        <HugeiconsIcon icon={Search01Icon} className="h-[22px] w-[22px] text-emerald-800/50" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-full bg-transparent text-[15px] font-medium text-emerald-950 placeholder:text-emerald-900/40 outline-none flex-1"
          autoFocus={autoFocus}
          aria-label={placeholder}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        />
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[60px] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-dropdown"
            role="listbox"
          >
            {results.length > 0 ? (
              <ul className="py-2 max-h-[60vh] overflow-y-auto">
                {results.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <li
                      key={index}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                        isSelected ? 'bg-emerald-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {renderItem ? (
                        renderItem(item, debouncedQuery)
                      ) : (
                        <>
                          <HugeiconsIcon icon={Search01Icon} className="w-5 h-5 text-gray-400 shrink-0" />
                          <div className="flex flex-col flex-1 truncate">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {highlightMatch(item[searchKeys[0]], debouncedQuery)}
                            </span>
                            {item.categoria && (
                              <span className="text-xs text-gray-500 truncate">{item.categoria}</span>
                            )}
                          </div>
                          {item.image && (
                            <img src={item.image} alt="" className="w-8 h-8 object-contain shrink-0" />
                          )}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-5 text-center flex flex-col items-center justify-center">
                <HugeiconsIcon icon={Search01Icon} className="w-8 h-8 text-gray-300 mb-2" />
                <h3 className="text-sm font-bold text-gray-900">No encontramos resultados</h3>
                <p className="text-xs text-gray-500 mt-1">Intenta buscar por objetivo, ingrediente o nombre.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearchAutocomplete;
