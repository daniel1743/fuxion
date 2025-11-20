import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Star, X } from 'lucide-react';
import { ProductEmoji } from './ProductEmojiPicker';
import ProductEmojiInput from './ProductEmojiInput';

// ============================================
// MODAL: Reseñar Producto
// ============================================
export const ProductReviewModal = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    author: '',
    rating: 0,
    comment: ''
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.author && formData.rating && formData.comment) {
      onSubmit({
        ...formData,
        productId: product.id,
        productName: product.name
      });
      onClose();
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredStar || formData.rating);

      return (
        <button
          key={index}
          type="button"
          onClick={() => setFormData({ ...formData, rating: starValue })}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          className="transition-all hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              isFilled
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      );
    });
  };

  const remainingChars = 300 - formData.comment.length;
  const isNearLimit = remainingChars <= 50;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {/* Header con producto */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <ProductEmoji productId={product.id} size="mini" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reseñar Producto</h2>
            <p className="text-gray-600">{product.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="¿Cómo te llamas?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Calificación con estrellas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Calificación
            </label>
            <div className="flex items-center gap-2">
              {renderStars()}
              {formData.rating > 0 && (
                <span className="ml-3 text-lg font-semibold text-gray-700">
                  {formData.rating} de 5 estrellas
                </span>
              )}
            </div>
          </div>

          {/* Reseña con emojis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Reseña
            </label>
            <ProductEmojiInput
              value={formData.comment}
              onChange={(value) => setFormData({ ...formData, comment: value })}
              placeholder={`Cuéntanos tu experiencia con ${product.name}...`}
              maxLength={300}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.author || !formData.rating || !formData.comment}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Publicar Reseña
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// MODAL: Comentar Producto
// ============================================
export const ProductCommentModal = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    author: '',
    comment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.author && formData.comment) {
      onSubmit({
        ...formData,
        productId: product.id,
        productName: product.name
      });
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {/* Header con producto */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <ProductEmoji productId={product.id} size="mini" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Comentar Producto</h2>
            <p className="text-gray-600">{product.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="¿Cómo te llamas?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Comentario con emojis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Comentario
            </label>
            <ProductEmojiInput
              value={formData.comment}
              onChange={(value) => setFormData({ ...formData, comment: value })}
              placeholder={`Comparte un comentario rápido sobre ${product.name}...`}
              maxLength={300}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.author || !formData.comment}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Publicar Comentario
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// MODAL: Opinar sobre Producto
// ============================================
export const ProductOpinionModal = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    opinion: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.author && formData.title && formData.opinion) {
      onSubmit({
        ...formData,
        productId: product.id,
        productName: product.name
      });
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {/* Header con producto */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <ProductEmoji productId={product.id} size="mini" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Opinar sobre Producto</h2>
            <p className="text-gray-600">{product.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="¿Cómo te llamas?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Título de la opinión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de tu Opinión
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={`Ejemplo: ${product.name} cambió mi vida`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Opinión detallada con emojis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Opinión Detallada
            </label>
            <ProductEmojiInput
              value={formData.opinion}
              onChange={(value) => setFormData({ ...formData, opinion: value })}
              placeholder={`Comparte tu experiencia detallada con ${product.name}...`}
              maxLength={500}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.author || !formData.title || !formData.opinion}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Publicar Opinión
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
