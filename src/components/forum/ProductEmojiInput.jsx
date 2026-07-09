import React, { useState, useRef } from 'react';
import { Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumInput from '../ui/PremiumInput';
import ProductEmojiPicker, { ProductEmoji } from './ProductEmojiPicker';

// ============================================
// COMPONENTE: ProductEmojiInput
// Input de texto con selector de emojis de productos
// Versión premium con PremiumInput
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
      {/* Textarea premium */}
      <div className="relative">
        <PremiumInput
          ref={textareaRef}
          as="textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full"
          inputClassName="pr-12 min-h-[120px]"
          floatingLabel={false}
        />

        {/* Botón de emojis premium */}
        <motion.button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="absolute right-3 top-3 p-2 rounded-full text-gray-400 hover:text-emerald-500 transition-colors bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
          title="Agregar producto Fuxion"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Smile size={20} />
        </motion.button>
      </div>

      {/* Contador de caracteres premium */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-400 font-light">
          Usa <code className="bg-gray-100/50 px-1.5 py-0.5 rounded text-emerald-600">:product-nombre:</code> o click en 😊
        </div>
        <motion.div
          className={`text-sm font-medium ${
            isAtLimit
              ? 'text-red-500'
              : isNearLimit
              ? 'text-amber-500'
              : 'text-gray-400'
          }`}
          animate={{ scale: isNearLimit ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {remainingChars} caracteres restantes
        </motion.div>
      </div>

      {/* Preview con emojis renderizados */}
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm"
          >
            <div className="text-xs text-gray-400 font-light mb-1.5">Vista previa:</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {renderTextWithEmojis(value)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Picker de productos */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-0 z-50"
          >
            <ProductEmojiPicker
              onSelect={handleSelectProduct}
              onClose={() => setShowPicker(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
