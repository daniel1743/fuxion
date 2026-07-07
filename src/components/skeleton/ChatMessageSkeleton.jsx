import React from 'react';

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
            <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.21 0-4-1.79-4-4h2c0 1.1.9 2 2 2s2-.9 2-2h2c0 2.21-1.79 4-4 4z"/>
            </svg>
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
