import React, { useState } from 'react';
import ProductQuickSelector from './ProductQuickSelector';
import {
  ProductReviewModal,
  ProductCommentModal,
  ProductOpinionModal
} from './ProductActionModals';
import { useForumContext } from '@/context/ForumContext';

// ============================================
// COMPONENTE: ProductActionManager
// Maneja todo el flujo:
// 1. Selector de producto
// 2. Selección de acción
// 3. Modal correspondiente
// 4. Guardar en el contexto
// ============================================

const ProductActionManager = () => {
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addReview, addQuestion } = useForumContext();

  // Cuando el usuario selecciona producto + acción
  const handleActionSelect = ({ product, action }) => {
    setSelectedProduct(product);
    setCurrentAction(action);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setCurrentAction(null);
    setSelectedProduct(null);
  };

  // Guardar reseña
  const handleReviewSubmit = (data) => {
    const review = {
      author: data.author,
      rating: data.rating,
      comment: data.comment,
      productName: data.productName,
      likes: 0,
      replies_count: 0,
      verified: false,
      createdAt: new Date().toISOString()
    };

    addReview(review);
    console.log('Reseña publicada:', review);
  };

  // Guardar comentario
  const handleCommentSubmit = (data) => {
    const question = {
      author: data.author,
      authorAvatar: '💬',
      title: `Comentario sobre ${data.productName}`,
      content: data.comment,
      category: 'Productos',
      tags: [data.productName],
      votes: 0,
      answers_count: 0,
      views: 0,
      solved: false,
      createdAt: new Date().toISOString()
    };

    addQuestion(question);
    console.log('Comentario publicado:', question);
  };

  // Guardar opinión
  const handleOpinionSubmit = (data) => {
    const question = {
      author: data.author,
      authorAvatar: '✍️',
      title: data.title,
      content: data.opinion,
      category: 'Opiniones',
      tags: [data.productName],
      votes: 0,
      answers_count: 0,
      views: 0,
      solved: false,
      createdAt: new Date().toISOString()
    };

    addQuestion(question);
    console.log('Opinión publicada:', question);
  };

  return (
    <>
      {/* Selector de producto */}
      <ProductQuickSelector onActionSelect={handleActionSelect} />

      {/* Modales según la acción seleccionada */}
      {currentAction === 'review' && selectedProduct && (
        <ProductReviewModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSubmit={handleReviewSubmit}
        />
      )}

      {currentAction === 'comment' && selectedProduct && (
        <ProductCommentModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSubmit={handleCommentSubmit}
        />
      )}

      {currentAction === 'opinion' && selectedProduct && (
        <ProductOpinionModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSubmit={handleOpinionSubmit}
        />
      )}
    </>
  );
};

export default ProductActionManager;
