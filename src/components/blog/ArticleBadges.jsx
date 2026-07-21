import React, { useState } from 'react';
import { parseCategories, getCategoryData } from '@/lib/categoryCatalog';
import { extractTopics } from '@/lib/topicExtractor';

const ArticleBadges = ({ categoryString, content }) => {
  const [expanded, setExpanded] = useState(false);
  const parsedCats = parseCategories(categoryString);

  if (parsedCats.length === 0 && (!content || extractTopics(content, categoryString).length === 0)) return null;

  const primaryCatName = parsedCats[0];
  const primaryCatData = getCategoryData(primaryCatName);
  const secondaryCats = parsedCats.slice(1);

  // Extraer temas adicionales desde el contenido del artículo
  const extraTopics = content ? extractTopics(content, categoryString) : [];

  // Combinar todo en una lista plana
  const allBadges = [
    ...(parsedCats.length > 0 ? [{ name: primaryCatName, data: primaryCatData }] : []),
    ...secondaryCats.map(name => ({ name, data: getCategoryData(name) })),
    ...extraTopics.map(t => ({ name: t.name, data: getCategoryData(t.name) })),
  ];

  // Mostrar todos si está expandido, o solo el primero + "+N"
  const visible = expanded ? allBadges : allBadges.slice(0, 1);
  const hiddenCount = expanded ? 0 : allBadges.length - 1;

  return (
    <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10 pr-3">
      {/* Badges visibles */}
      {visible.map(({ name, data }, idx) => (
        <span
          key={idx}
          className={`text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm ${data.color}`}
        >
          {name}
        </span>
      ))}

      {/* Indicador "+N" si hay más badges ocultos */}
      {hiddenCount > 0 && !expanded && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(true); }}
          className="bg-white/90 backdrop-blur text-slate-700 hover:bg-white text-xs font-bold px-2 py-1 rounded-full shadow-sm transition-colors border border-slate-200"
        >
          +{hiddenCount}
        </button>
      )}

      {/* Badges ocultos al expandir */}
      {expanded && allBadges.slice(1).map(({ name, data }, idx) => (
        <span
          key={idx + 1}
          className={`text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm ${data.color} animate-in fade-in zoom-in duration-200`}
        >
          {name}
        </span>
      ))}
    </div>
  );
};

export default ArticleBadges;
