import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import {
  MessageSquarePlus,
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Star
} from 'lucide-react';
import { useForumContext } from '@/context/ForumContext';
import QuestionCard from '@/components/forum/QuestionCard';
import NewQuestionForm from '@/components/forum/NewQuestionForm';
import QuestionDetail from '@/components/forum/QuestionDetail';
import ProductReviewForm from '@/components/forum/ProductReviewForm';
import ProductReviewCard from '@/components/forum/ProductReviewCard';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const SupportPage = () => {
  const {
    getFilteredQuestions,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    getAllReviews,
    addReview,
    likeReview
  } = useForumContext();
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [showNewReview, setShowNewReview] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const questions = getFilteredQuestions();
  const allReviews = getAllReviews();

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredReviews = allReviews.filter((r) =>
    r.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: questions.length,
    solved: questions.filter(q => q.solved).length,
    totalAnswers: questions.reduce((acc, q) => acc + q.answers, 0),
    totalReviews: allReviews.length,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-28"
    >
      <Helmet>
        <title>Foro de Soporte — Fuxion Shop</title>
        <meta name="description" content="Foro de preguntas, respuestas y opiniones de Fuxion Shop. Resuelve tus dudas con la comunidad." />
      </Helmet>

      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          <Badge variant="outline" className="mb-4 text-sm">
            💬 Centro de Ayuda Comunitario
          </Badge>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter mb-4">
          Foro de Soporte
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Pregunta, responde y comparte opiniones con otros usuarios de Fuxion Shop
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Preguntas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{stats.solved}</div>
            <div className="text-sm text-muted-foreground">Resueltas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.totalAnswers}</div>
            <div className="text-sm text-muted-foreground">Respuestas</div>
          </div>
        </div>
      </div>

      {/* Tabs y Content */}
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Preguntas y Respuestas
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Reseñas de Productos
            </TabsTrigger>
          </TabsList>

          {/* TAB: Preguntas */}
          <TabsContent value="questions">
            {/* Action Bar */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar preguntas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* New Question Button */}
                <Button
                  onClick={() => setShowNewQuestion(true)}
                  className="flex items-center gap-2 whitespace-nowrap"
                  size="lg"
                >
                  <MessageSquarePlus className="w-5 h-5" />
                  Nueva Pregunta
                </Button>
              </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter by status */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtrar:</span>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todas
              </Button>
              <Button
                variant={filter === 'solved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('solved')}
                className="flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                Resueltas
              </Button>
              <Button
                variant={filter === 'unsolved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unsolved')}
                className="flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                Sin resolver
              </Button>
            </div>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Sort */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ordenar:</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('recent')}
              >
                Recientes
              </Button>
              <Button
                variant={sortBy === 'votes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('votes')}
              >
                Más votadas
              </Button>
              <Button
                variant={sortBy === 'answers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('answers')}
              >
                Más respondidas
              </Button>
            </div>
          </div>
        </div>
      </div>

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay preguntas aún'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : '¡Sé el primero en hacer una pregunta!'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowNewQuestion(true)}>
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    Crear Primera Pregunta
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onClick={() => setSelectedQuestion(question.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB: Reseñas */}
          <TabsContent value="reviews">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar reseñas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* New Review Button */}
                <Button
                  onClick={() => setShowNewReview(true)}
                  className="flex items-center gap-2 whitespace-nowrap"
                  size="lg"
                >
                  <Star className="w-5 h-5" />
                  Escribir Reseña
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchTerm ? 'No se encontraron reseñas' : 'No hay reseñas aún'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : '¡Sé el primero en escribir una reseña!'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowNewReview(true)}>
                    <Star className="w-4 h-4 mr-2" />
                    Escribir Primera Reseña
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <ProductReviewCard
                    key={review.id}
                    review={review}
                    onLike={likeReview}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewQuestion && (
          <NewQuestionForm onClose={() => setShowNewQuestion(false)} />
        )}
        {showNewReview && (
          <ProductReviewForm
            onClose={() => setShowNewReview(false)}
            onSubmit={addReview}
          />
        )}
        {selectedQuestion && (
          <QuestionDetail
            questionId={selectedQuestion}
            onClose={() => setSelectedQuestion(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SupportPage;
