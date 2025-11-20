import React, { useState, useRef } from 'react';
import { Smile } from 'lucide-react';
import ProductEmojiPicker, { ProductEmoji } from './ProductEmojiPicker';

// ============================================
// COMPONENTE: ProductEmojiInput
// Input de texto con selector de emojis de productos
// ============================================
const ProductEmojiInput = ({
  value,
  onChange,
  placeholder = 'Escribe tu mensaje...',
  maxLength = 300,
  className = ''
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef(null);

  // Insertar emoji de producto en el texto
  const handleSelectProduct = (productId) => {
    const emoji = `:product-${productId}:`;
    const textarea = textareaRef.current;

    if (!textarea) {
      onChange(value + emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + emoji + value.substring(end);

    onChange(newValue);

    // Restaurar cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    setShowPicker(false);
  };

  // Renderizar texto con emojis de productos
  const renderTextWithEmojis = (text) => {
    const parts = text.split(/(:product-[a-z0-9+-]+:)/g);

    return parts.map((part, index) => {
      const match = part.match(/:product-([a-z0-9+-]+):/);
      if (match) {
        return <ProductEmoji key={index} productId={match[1]} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const remainingChars = maxLength - value.length;
  const isNearLimit = remainingChars <= 50;
  const isAtLimit = remainingChars <= 0;

  return (
    <div className={`relative ${className}`}>
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />

        {/* Botón de emojis */}
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="absolute right-3 top-3 text-gray-400 hover:text-blue-500 transition-colors"
          title="Agregar producto Fuxion"
        >
          <Smile size={20} />
        </button>
      </div>

      {/* Contador de caracteres */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500">
          Usa <code className="bg-gray-100 px-1 rounded">:product-nombre:</code> o click en 😊
        </div>
        <div
          className={`text-sm font-medium ${
            isAtLimit
              ? 'text-red-600'
              : isNearLimit
              ? 'text-yellow-600'
              : 'text-gray-500'
          }`}
        >
          {remainingChars} caracteres restantes
        </div>
      </div>

      {/* Preview con emojis renderizados */}
      {value && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Vista previa:</div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            {renderTextWithEmojis(value)}
          </div>
        </div>
      )}

      {/* Picker de productos */}
      {showPicker && (
        <div className="absolute bottom-full mb-2 left-0 z-50">
          <ProductEmojiPicker
            onSelect={handleSelectProduct}
            onClose={() => setShowPicker(false)}
          />
        </div>
      )}
    </div>
  );
};

// ============================================
// UTILIDAD: Renderizar texto con emojis
// Para usar en QuestionCard, AnswerCard, ReviewCard
// ============================================
export const renderProductEmojis = (text) => {
  const parts = text.split(/(:product-[a-z0-9+-]+:)/g);

  return parts.map((part, index) => {
    const match = part.match(/:product-([a-z0-9+-]+):/);
    if (match) {
      return <ProductEmoji key={index} productId={match[1]} />;
    }
    return <span key={index}>{part}</span>;
  });
};

export default ProductEmojiInput;
