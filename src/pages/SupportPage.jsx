import React, { useState } from 'react';
import SEO from '@/components/SEO';
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
  Star,
  Settings
} from 'lucide-react';
import { useForumContext } from '@/context/ForumContext';
import { useAdmin } from '@/context/AdminContext';
import QuestionCard from '@/components/forum/QuestionCard';
import NewQuestionForm from '@/components/forum/NewQuestionForm';
import QuestionDetail from '@/components/forum/QuestionDetail';
import ProductReviewForm from '@/components/forum/ProductReviewForm';
import ProductReviewCard from '@/components/forum/ProductReviewCard';
import AdminPanel from '@/components/admin/AdminPanel';
import MobileAppShell from '@/components/mobile/MobileAppShell';

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
  const { isAdmin } = useAdmin();
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [showNewReview, setShowNewReview] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

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
      className="container mx-auto px-4 sm:px-6 pt-0 md:pt-28 pb-28 max-w-7xl overflow-x-hidden"
    >
      <SEO
        title="Opiniones y Consultas"
        description="Consultas, respuestas y opiniones sobre productos Fuxion. Comparte tu experiencia o solicita orientación antes de comprar."
        canonical="/faq"
      />

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title="Soporte"
          description="Consultas y opiniones."
        />
      </div>

      {/* Header */}
      <div className="hidden md:block text-center mb-12 mt-6 md:mt-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          <Badge variant="outline" className="mb-4 text-sm">
            Centro de consultas y opiniones
          </Badge>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter mb-4">
          Opiniones y consultas
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Deja una reseña, inicia una consulta o responde dudas de forma clara y respetuosa.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-4 sm:gap-8 mt-8 flex-wrap">
          <div className="text-center min-w-[80px]">
            <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Consultas</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.solved}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Resueltas</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.totalAnswers}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Respuestas</div>
          </div>
        </div>
      </div>

      {/* Tabs y Content */}
      <div className="max-w-5xl mx-auto w-full">
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Consultas
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Opiniones de productos
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
                    placeholder="Buscar consultas u opiniones..."
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
                  Iniciar tema
                </Button>

                {/* Admin Panel Button - Only visible for admin */}
                {isAdmin && (
                  <Button
                    onClick={() => setShowAdminPanel(true)}
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    size="lg"
                  >
                    <Settings className="w-5 h-5" />
                    Panel Admin
                  </Button>
                )}
              </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Filter by status */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Filtrar:</span>
            {/* Contenedor scroll horizontal en móvil */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x before:content-[''] before:w-1 before:shrink-0 before:block after:content-[''] after:w-1 after:shrink-0 after:block -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="rounded-full snap-start shrink-0"
              >
                Todas
              </Button>
              <Button
                variant={filter === 'solved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('solved')}
                className="flex items-center gap-1 rounded-full snap-start shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resueltas
              </Button>
              <Button
                variant={filter === 'unsolved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unsolved')}
                className="flex items-center gap-1 rounded-full snap-start shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Sin resolver
              </Button>
            </div>
          </div>
          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Ordenar:</span>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
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
                  {searchTerm ? 'No se encontraron resultados' : 'No hay consultas aún'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Inicia el primer tema para recibir orientación general o compartir una duda.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowNewQuestion(true)}>
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    Iniciar primer tema
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
                    placeholder="Buscar opiniones..."
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
                  Escribir opinión
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
                  {searchTerm ? 'No se encontraron opiniones' : 'No hay opiniones aún'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Comparte tu experiencia de compra o uso de un producto.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowNewReview(true)}>
                    <Star className="w-4 h-4 mr-2" />
                    Escribir primera opinión
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
        {showAdminPanel && (
          <AdminPanel
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SupportPage;
