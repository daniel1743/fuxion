import React, { useState } from 'react';
import { parseCategories, getCategoryData } from '@/lib/categoryCatalog';

const ArticleBadges = ({ categoryString }) => {
  const [expanded, setExpanded] = useState(false);
  const parsedCats = parseCategories(categoryString);
  
  if (parsedCats.length === 0) return null;

  const primaryCatName = parsedCats[0];
  const primaryCatData = getCategoryData(primaryCatName);
  const secondaryCats = parsedCats.slice(1);

  return (
    <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10 pr-3">
      {/* Primary Badge */}
      <span className={`text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm ${primaryCatData.color}`}>
        {primaryCatName}
      </span>
      
      {/* Secondary Badges or +N indicator */}
      {secondaryCats.length > 0 && !expanded && (
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(true); }}
          className="bg-white/90 backdrop-blur text-slate-700 hover:bg-white text-xs font-bold px-2 py-1 rounded-full shadow-sm transition-colors border border-slate-200"
        >
          +{secondaryCats.length}
        </button>
      )}

      {/* Expanded Badges */}
      {expanded && secondaryCats.map((catName, idx) => {
        const catData = getCategoryData(catName);
        return (
          <span 
            key={idx} 
            className={`text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm ${catData.color} animate-in fade-in zoom-in duration-200`}
          >
            {catName}
          </span>
        );
      })}
    </div>
  );
};

export default ArticleBadges;
