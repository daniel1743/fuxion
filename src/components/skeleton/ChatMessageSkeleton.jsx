import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { AiChat02Icon } from '@hugeicons/core-free-icons';

/**
 * ChatMessageSkeleton — Indicador premium de "escribiendo..."
 * 
 * Muestra una burbuja con puntos animados que simulan escritura.
 * Diseñado para Falcon Assistant.
 */
const ChatMessageSkeleton = ({ text = 'Falcon Assistant está escribiendo...' }) => {
  return (
    <div className="flex justify-start" aria-label={text}>
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md chat-bubble-bot px-4 py-3 rounded-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="bg-white/20 rounded-full p-0.5">
            <HugeiconsIcon icon={AiChat02Icon} size={14} className="text-white" />
          </div>
          <span className="text-[11px] font-semibold text-white/90">Fuxion Assistant</span>
        </div>
        <p className="text-sm text-white/80">{text}</p>
        <div className="flex items-center gap-1.5 pl-0.5 mt-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:-0.24s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:-0.12s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default ChatMessageSkeleton;
