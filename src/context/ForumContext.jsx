import React, { createContext, useContext, useState, useEffect } from 'react';
import { startForumBots } from '@/services/forumBotService';

const ForumContext = createContext();

export const useForumContext = () => {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error('useForumContext debe usarse dentro de ForumProvider');
  }
  return context;
};

// Datos de ejemplo iniciales - Foro vacío para que los bots lo llenen
const initialQuestions = [];
const initialAnswers = {};

export const ForumProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all'); // all, solved, unsolved
  const [sortBy, setSortBy] = useState('recent'); // recent, votes, answers

  // Cargar datos desde localStorage o usar datos iniciales
  useEffect(() => {
    // Verificar si necesitamos limpiar el localStorage (primera carga con bots)
    const hasOldData = localStorage.getItem('forumQuestions');
    const botsInitialized = localStorage.getItem('forumBotsInitialized');

    // Si hay datos viejos pero los bots no se han inicializado, limpiar todo
    if (hasOldData && !botsInitialized) {
      console.log('🧹 Limpiando conversaciones antiguas del foro...');
      localStorage.removeItem('forumQuestions');
      localStorage.removeItem('forumAnswers');
      localStorage.removeItem('productReviews');
      localStorage.setItem('forumBotsInitialized', 'true');

      // Iniciar con datos vacíos
      setQuestions(initialQuestions);
      setAnswers(initialAnswers);
      setReviews([]);
    } else {
      // Cargar normalmente
      const savedQuestions = localStorage.getItem('forumQuestions');
      const savedAnswers = localStorage.getItem('forumAnswers');
      const savedReviews = localStorage.getItem('productReviews');

      if (savedQuestions) {
        setQuestions(JSON.parse(savedQuestions));
      } else {
        setQuestions(initialQuestions);
      }

      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      } else {
        setAnswers(initialAnswers);
      }

      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      }

      // Marcar que los bots ya fueron inicializados
      if (!botsInitialized) {
        localStorage.setItem('forumBotsInitialized', 'true');
      }
    }
  }, []);

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('forumQuestions', JSON.stringify(questions));
    }
  }, [questions]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('forumAnswers', JSON.stringify(answers));
    }
  }, [answers]);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('productReviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  // Crear nueva pregunta
  const addQuestion = (questionData) => {
    const newQuestion = {
      id: Date.now(),
      ...questionData,
      votes: 0,
      answers: 0,
      views: 0,
      solved: false,
      createdAt: new Date().toISOString(),
    };
    setQuestions([newQuestion, ...questions]);
    return newQuestion;
  };

  // Agregar respuesta
  const addAnswer = (questionId, answerData) => {
    const newAnswer = {
      id: Date.now(),
      questionId,
      ...answerData,
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
    };

    setAnswers({
      ...answers,
      [questionId]: [...(answers[questionId] || []), newAnswer],
    });

    // Incrementar contador de respuestas
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, answers: q.answers + 1 } : q
    ));

    return newAnswer;
  };

  // Votar pregunta
  const voteQuestion = (questionId, increment = 1) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, votes: q.votes + increment } : q
    ));
  };

  // Votar respuesta
  const voteAnswer = (questionId, answerId, increment = 1) => {
    setAnswers({
      ...answers,
      [questionId]: answers[questionId].map(a =>
        a.id === answerId ? { ...a, votes: a.votes + increment } : a
      ),
    });
  };

  // Marcar respuesta como aceptada
  const acceptAnswer = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answers[questionId].map(a => ({
        ...a,
        isAccepted: a.id === answerId,
      })),
    });

    // Marcar pregunta como resuelta
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, solved: true } : q
    ));
  };

  // Incrementar vistas
  const incrementViews = (questionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, views: q.views + 1 } : q
    ));
  };

  // Eliminar pregunta (solo para moderador/dueño)
  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    // También eliminar las respuestas asociadas
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
  };

  // Eliminar respuesta (solo para moderador/dueño)
  const deleteAnswer = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answers[questionId].filter(a => a.id !== answerId)
    });
    // Decrementar contador de respuestas
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, answers: Math.max(0, q.answers - 1) } : q
    ));
  };

  // Eliminar reseña (solo para moderador/dueño)
  const deleteReview = (reviewId) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  // Obtener pregunta por ID
  const getQuestionById = (id) => {
    return questions.find(q => q.id === parseInt(id));
  };

  // Obtener respuestas de una pregunta
  const getAnswersByQuestionId = (questionId) => {
    return answers[questionId] || [];
  };

  // Filtrar y ordenar preguntas
  const getFilteredQuestions = () => {
    let filtered = [...questions];

    // Aplicar filtro
    if (filter === 'solved') {
      filtered = filtered.filter(q => q.solved);
    } else if (filter === 'unsolved') {
      filtered = filtered.filter(q => !q.solved);
    }

    // Aplicar ordenamiento
    if (sortBy === 'votes') {
      filtered.sort((a, b) => b.votes - a.votes);
    } else if (sortBy === 'answers') {
      filtered.sort((a, b) => b.answers - a.answers);
    } else {
      // recent
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  // Funciones para reseñas de productos
  const addReview = (reviewData) => {
    const newReview = {
      id: Date.now(),
      ...reviewData,
      likes: 0,
      replies: 0,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    setReviews([newReview, ...reviews]);
    return newReview;
  };

  const likeReview = (reviewId) => {
    setReviews(reviews.map(r =>
      r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
    ));
  };

  const getReviewsByProduct = (productName) => {
    return reviews.filter(r => r.productName === productName);
  };

  const getAllReviews = () => {
    return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getAverageRating = (productName) => {
    const productReviews = getReviewsByProduct(productName);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };

  const value = {
    questions,
    answers,
    reviews,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    addQuestion,
    addAnswer,
    voteQuestion,
    voteAnswer,
    acceptAnswer,
    incrementViews,
    deleteQuestion,
    deleteAnswer,
    deleteReview,
    getQuestionById,
    getAnswersByQuestionId,
    getFilteredQuestions,
    addReview,
    likeReview,
    getReviewsByProduct,
    getAllReviews,
    getAverageRating,
  };

  // Iniciar bots automáticos del foro
  useEffect(() => {
    // Solo iniciar bots si hay contexto completo
    if (questions && addQuestion && addAnswer) {
      startForumBots({
        questions,
        addQuestion,
        addAnswer
      });
    }
  }, []); // Solo ejecutar una vez al montar

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
};
