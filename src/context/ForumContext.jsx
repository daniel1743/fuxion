import React, { createContext, useContext, useState, useEffect } from 'react';

const ForumContext = createContext();

export const useForumContext = () => {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error('useForumContext debe usarse dentro de ForumProvider');
  }
  return context;
};

// Datos de ejemplo iniciales
const initialQuestions = [
  {
    id: 1,
    author: 'María González',
    authorAvatar: '👩‍💼',
    title: '¿Cómo funciona la garantía de los productos?',
    content: 'Me gustaría saber más detalles sobre la política de garantía. ¿Qué cubre exactamente y por cuánto tiempo?',
    category: 'Garantías',
    votes: 15,
    answers: 3,
    views: 234,
    solved: true,
    createdAt: '2025-01-15T10:30:00',
    tags: ['garantía', 'políticas', 'devoluciones'],
  },
  {
    id: 2,
    author: 'Carlos Méndez',
    authorAvatar: '👨‍💻',
    title: '¿Hacen envíos internacionales?',
    content: 'Vivo en Argentina y me interesa comprar algunos productos. ¿Realizan envíos fuera de Chile?',
    category: 'Envíos',
    votes: 8,
    answers: 2,
    views: 145,
    solved: false,
    createdAt: '2025-01-16T14:20:00',
    tags: ['envíos', 'internacional'],
  },
  {
    id: 3,
    author: 'Ana Silva',
    authorAvatar: '👩‍🎓',
    title: '¿Los productos tienen stock real o son por pedido?',
    content: 'Quiero asegurarme de que el producto que compre esté disponible de inmediato.',
    category: 'Stock',
    votes: 12,
    answers: 1,
    views: 189,
    solved: true,
    createdAt: '2025-01-14T09:15:00',
    tags: ['stock', 'disponibilidad'],
  },
];

const initialAnswers = {
  1: [
    {
      id: 1,
      questionId: 1,
      author: 'Soporte Fuxion',
      authorAvatar: '🚀',
      content: 'Todos nuestros productos cuentan con garantía de 12 meses contra defectos de fabricación. La garantía cubre cualquier problema técnico que no sea causado por mal uso del producto.',
      votes: 10,
      isAccepted: true,
      createdAt: '2025-01-15T11:00:00',
    },
    {
      id: 2,
      questionId: 1,
      author: 'Pedro Ruiz',
      authorAvatar: '👨‍🔧',
      content: 'Yo tuve un problema con mi laptop hace 3 meses y me la reemplazaron sin problema. El servicio fue excelente.',
      votes: 5,
      isAccepted: false,
      createdAt: '2025-01-15T15:30:00',
    },
    {
      id: 3,
      questionId: 1,
      author: 'Laura Torres',
      authorAvatar: '👩‍🦰',
      content: '¿La garantía también cubre daños por transporte?',
      votes: 2,
      isAccepted: false,
      createdAt: '2025-01-16T08:45:00',
    },
  ],
  2: [
    {
      id: 4,
      questionId: 2,
      author: 'Soporte Fuxion',
      authorAvatar: '🚀',
      content: 'Por el momento solo realizamos envíos dentro de Chile. Estamos trabajando en expandir nuestro servicio a otros países de Latinoamérica próximamente.',
      votes: 6,
      isAccepted: false,
      createdAt: '2025-01-16T15:00:00',
    },
    {
      id: 5,
      questionId: 2,
      author: 'Roberto Campos',
      authorAvatar: '👨‍🚀',
      content: 'Puedes usar un servicio de casilla de correo en Chile y ellos te lo reenvían a Argentina.',
      votes: 3,
      isAccepted: false,
      createdAt: '2025-01-16T16:20:00',
    },
  ],
  3: [
    {
      id: 6,
      questionId: 3,
      author: 'Soporte Fuxion',
      authorAvatar: '🚀',
      content: 'Todos los productos que ves en la web tienen stock real en nuestro almacén. El envío se realiza dentro de las 24-48 horas siguientes a la compra.',
      votes: 8,
      isAccepted: true,
      createdAt: '2025-01-14T10:00:00',
    },
  ],
};

export const ForumProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all'); // all, solved, unsolved
  const [sortBy, setSortBy] = useState('recent'); // recent, votes, answers

  // Cargar datos desde localStorage o usar datos iniciales
  useEffect(() => {
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
    getQuestionById,
    getAnswersByQuestionId,
    getFilteredQuestions,
    addReview,
    likeReview,
    getReviewsByProduct,
    getAllReviews,
    getAverageRating,
  };

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
};
