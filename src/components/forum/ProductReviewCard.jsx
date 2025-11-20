import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductReviewCard = ({ review, onLike }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-400';
    if (rating >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          {/* Author */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{review.author}</span>
            {review.verified && (
              <Badge variant="secondary" className="text-xs">
                ✓ Compra verificada
              </Badge>
            )}
          </div>

          {/* Stars and Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">{renderStars(review.rating)}</div>
            <span className={`font-bold ${getRatingColor(review.rating)}`}>
              {review.rating}.0
            </span>
          </div>
        </div>

        {/* Date */}
        <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
      </div>

      {/* Product Name (if applicable) */}
      {review.productName && (
        <div className="mb-3">
          <Badge variant="outline" className="text-xs">
            📦 {review.productName}
          </Badge>
        </div>
      )}

      {/* Comment */}
      <p className="text-foreground leading-relaxed mb-4">{review.comment}</p>

      {/* Footer - Likes and Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike && onLike(review.id)}
          className="flex items-center gap-1 text-muted-foreground hover:text-primary"
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">{review.likes || 0}</span>
        </Button>

        {review.replies && review.replies > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MessageCircle className="w-4 h-4" />
            <span>{review.replies} {review.replies === 1 ? 'respuesta' : 'respuestas'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductReviewCard;
