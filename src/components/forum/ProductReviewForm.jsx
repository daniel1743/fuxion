import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const ProductReviewForm = ({ onClose, onSubmit, productName }) => {
  const [formData, setFormData] = useState({
    author: '',
    rating: 0,
    comment: '',
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  const MAX_CHARS = 300;
  const remainingChars = MAX_CHARS - formData.comment.length;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.author || !formData.rating || !formData.comment) {
      toast({
        title: '⚠️ Campos incompletos',
        description: 'Por favor completa todos los campos.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.comment.length > MAX_CHARS) {
      toast({
        title: '⚠️ Texto muy largo',
        description: `El comentario no puede exceder ${MAX_CHARS} caracteres.`,
        variant: 'destructive',
      });
      return;
    }

    onSubmit(formData);
    toast({
      title: '✅ Reseña publicada',
      description: 'Gracias por compartir tu opinión.',
    });
    onClose();
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
          className="transition-transform hover:scale-125"
        >
          <Star
            className={`w-8 h-8 ${
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
            } transition-colors`}
          />
        </button>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl max-w-lg w-full p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Califica este producto</h2>
            {productName && (
              <p className="text-sm text-muted-foreground mt-1">{productName}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="author">Tu Nombre *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Ej: María González"
              required
            />
          </div>

          {/* Calificación con Estrellas */}
          <div className="space-y-2">
            <Label>Calificación *</Label>
            <div className="flex gap-2 items-center">
              {renderStars()}
              {formData.rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({formData.rating} de 5 estrellas)
                </span>
              )}
            </div>
          </div>

          {/* Comentario */}
          <div className="space-y-2">
            <Label htmlFor="comment">
              Tu Opinión *
              <span className={`ml-2 text-xs ${remainingChars < 50 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                ({remainingChars} caracteres restantes)
              </span>
            </Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setFormData({ ...formData, comment: e.target.value });
                }
              }}
              placeholder="Comparte tu experiencia con este producto..."
              rows={5}
              required
              maxLength={MAX_CHARS}
            />
            {formData.comment.length >= MAX_CHARS && (
              <p className="text-xs text-yellow-500">Has alcanzado el límite de caracteres</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Publicar Reseña
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductReviewForm;
