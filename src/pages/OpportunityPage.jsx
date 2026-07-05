import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Heart,
  HeartHandshake,
  TrendingUp,
  Users,
  Rocket,
  Sparkles,
  Leaf,
  MessageCircle,
  Shield,
  ChevronDown,
  Send,
  Globe,
  BookOpen,
  Target,
  Star
} from 'lucide-react';
import SEO from '@/components/SEO';
import { SITE_URL, STORE_NAME } from '@/lib/productSeo';
import { openWhatsapp } from '@/lib/whatsapp';
import { toast } from '@/components/ui/use-toast';
import OpportunityVideo from '@/components/OpportunityVideo';

// ── Page transition variants ──────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

// ── FAQ Schema ─────────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Necesito experiencia para comenzar con FuXion?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No necesitas experiencia previa. FuXion entrega formación, acompañamiento y herramientas para que aprendas a tu ritmo. Muchas personas comienzan sin conocimientos previos en ventas o nutrición.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Puedo desarrollar FuXion junto a otra actividad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. La mayoría de las personas que comparten FuXion lo hacen como un proyecto complementario a su trabajo o estudios. Tú defines cuánto tiempo y dedicación le quieres dar.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cómo funciona la oportunidad FuXion?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FuXion es una empresa de bienestar con más de 15 años de presencia internacional. Ofrece la posibilidad de compartir sus productos nutracéuticos y desarrollar un proyecto independiente con acompañamiento, formación y herramientas digitales.'
      }
    }
  ]
};

// ── Quiz questions ────────────────────────────────────────────
const quizQuestions = [
  {
    id: 1,
    question: '¿Te interesa el mundo del bienestar?',
    options: [
      { value: 'yes', label: 'Sí, me gusta cuidarme', icon: '🌱' },
      { value: 'curious', label: 'Tengo curiosidad', icon: '🤔' },
      { value: 'not-sure', label: 'No estoy seguro', icon: '🤷' },
    ]
  },
  {
    id: 2,
    question: '¿Te gusta compartir recomendaciones?',
    options: [
      { value: 'yes', label: 'Sí, siempre recomiendo', icon: '💬' },
      { value: 'sometimes', label: 'A veces', icon: '😊' },
      { value: 'not-really', label: 'No mucho', icon: '🤐' },
    ]
  },
  {
    id: 3,
    question: '¿Quieres aprender sobre emprendimiento?',
    options: [
      { value: 'yes', label: 'Sí, me interesa', icon: '🚀' },
      { value: 'maybe', label: 'Quizás más adelante', icon: '⏳' },
      { value: 'already', label: 'Ya emprendo', icon: '💼' },
    ]
  },
  {
    id: 4,
    question: '¿Buscas desarrollar un proyecto flexible?',
    options: [
      { value: 'yes', label: 'Sí, necesito flexibilidad', icon: '🎯' },
      { value: 'maybe', label: 'Podría ser', icon: '🤝' },
      { value: 'not-now', label: 'Ahora no', icon: '📅' },
    ]
  }
];

// ── Why cards data ────────────────────────────────────────────
const whyCards = [
  {
    icon: 'Leaf',
    title: 'Bienestar como estilo de vida',
    description: 'Comparten productos relacionados con sus hábitos y objetivos personales.'
  },
  {
    icon: 'HeartHandshake',
    title: 'Conectar con personas',
    description: 'Acompañan a otros compartiendo información y experiencias.'
  },
  {
    icon: 'TrendingUp',
    title: 'Construir algo propio',
    description: 'Aprenden habilidades comerciales, comunicación y desarrollo personal.'
  }
];

// ── How it works steps ────────────────────────────────────────
const howItWorks = [
  { number: 1, text: 'Conoces los productos.' },
  { number: 2, text: 'Aprendes cómo compartirlos.' },
  { number: 3, text: 'Recibes acompañamiento.' },
  { number: 4, text: 'Avanzas según tus objetivos.' }
];

// ── Who it's for items ────────────────────────────────────────
const whoItems = [
  'Te interesa el bienestar y la nutrición.',
  'Te gusta recomendar cosas que valoras.',
  'Quieres aprender nuevas habilidades.',
  'Tienes curiosidad por emprender.'
];

// ── Country list for form ─────────────────────────────────────
const countries = [
  'Chile', 'Argentina', 'Perú', 'Colombia', 'Ecuador',
  'Bolivia', 'Paraguay', 'Uruguay', 'México', 'Estados Unidos',
  'España', 'Otro'
];

// ── Component ─────────────────────────────────────────────────
const OpportunityPage = () => {
  const navigate = useNavigate();
  const quizRef = useRef(null);
  const formRef = useRef(null);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    whatsapp: '',
    interest: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // ── Quiz handlers ───────────────────────────────────────────
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizComplete(false);
    // Track event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quiz_started', { event_category: 'opportunity' });
    }
  };

  const handleQuizAnswer = (value) => {
    const newAnswers = [...quizAnswers, value];
    setQuizAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
      // Track event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'quiz_completed', {
          event_category: 'opportunity',
          answers: newAnswers.join(',')
        });
      }
    }
  };

  const handleQuizRestart = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizComplete(false);
  };

  // ── Form handlers ───────────────────────────────────────────
  const handleOpenForm = () => {
    setShowForm(true);
    // Track event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'lead_form_opened', { event_category: 'opportunity' });
    }
    // Scroll to form after a brief delay
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.whatsapp.trim() || !formData.interest) {
      toast({
        title: 'Completa los campos requeridos',
        description: 'Nombre, WhatsApp e interés son necesarios para contactarte.',
        variant: 'destructive',
      });
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        nombre: formData.name.trim(),
        pais: formData.country || 'No especificado',
        whatsapp: formData.whatsapp.trim(),
        interes: formData.interest,
        fecha: new Date().toLocaleString('es-CL', {
          timeZone: 'America/Santiago',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        origen: 'Oportunidad FuXion'
      };

      const response = await fetch('/api/contact-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al enviar los datos');
      }

      setFormSubmitted(true);
      // Track event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'opportunity_lead_created', {
          event_category: 'opportunity',
          interest: formData.interest
        });
      }

      toast({
        title: '¡Gracias por tu interés!',
        description: 'Recibimos tus datos. Te contactaremos pronto.',
      });
    } catch (error) {
      toast({
        title: 'No pudimos enviar tus datos',
        description: 'Intenta nuevamente o escríbenos directamente por WhatsApp.',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleWhatsApp = (message) => {
    openWhatsapp(message);
  };

  // ── Track page visit ────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'opportunity_page_visit', { event_category: 'opportunity' });
    }
  }, []);

  // ── Quiz result message ─────────────────────────────────────
  const getQuizResultMessage = () => {
    const yesCount = quizAnswers.filter(a => a === 'yes').length;
    if (yesCount >= 3) {
      return '¡Parece que hay buena conexión! Conocer más sobre FuXion podría ser un gran paso.';
    } else if (yesCount >= 2) {
      return 'Hay interés. Tal vez sea buen momento para explorar un poco más.';
    }
    return 'Siempre está bien informarse. Si más adelante tienes curiosidad, aquí estamos.';
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="overflow-x-hidden"
    >
      <SEO
        title="Oportunidad FuXion | Comparte Bienestar y Desarrolla un Proyecto Propio"
        description="Descubre cómo algunas personas convierten su interés por el bienestar en un proyecto independiente junto a FuXion. Sin presión, sin promesas de riqueza rápida."
        canonical="/oportunidad-fuxion"
        schema={[faqSchema]}
      />

      {/* ═══════════════════════════════════════════════════════════
         HERO SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 bg-gradient-to-br from-[#f0faf4] via-white to-[#e8f5e9] dark:from-[#0a1a12] dark:via-[#0f1f18] dark:to-[#0d2818]">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-teal-100/30 dark:bg-teal-900/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-emerald-50/50 dark:bg-emerald-800/10 blur-2xl" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left column — text */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300 bg-white/80 dark:bg-emerald-950/40">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Oportunidad FuXion
                </Badge>
              </motion.div>

              <motion.h1
                className="text-responsive-hero font-extrabold text-foreground tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                Convierte tu interés por el{' '}
                <span className="text-emerald-600 dark:text-emerald-400">bienestar</span>{' '}
                en algo más
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Muchas personas conocen FuXion por sus productos.
                Algunas descubren que también pueden compartir bienestar
                y desarrollar un proyecto propio.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
              >
                <Button
                  size="lg"
                  className="btn-mobile-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[20px] shadow-premium-soft btn-scale-hover text-base px-7 py-0 h-[54px] sm:h-14 max-w-[300px]"
                  onClick={handleOpenForm}
                >
                  <span className="text-balance">Quiero conocer cómo funciona</span>
                  <ArrowRight className="ml-2 h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-mobile-full font-bold rounded-[20px] text-base px-7 py-0 h-[54px] sm:h-14 max-w-[300px] border border-emerald-200 dark:border-emerald-800 bg-white/75 dark:bg-transparent btn-scale-hover"
                  onClick={() => navigate('/explorar')}
                >
                  <Leaf className="mr-2 h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
                  <span className="text-balance">Primero quiero conocer los productos</span>
                </Button>
              </motion.div>
            </div>

            {/* Right column — visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 100 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-premium-soft border border-emerald-100 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-card p-8 md:p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-6">
                    <Leaf className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Bienestar que se comparte
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Un proyecto independiente donde tú pones el ritmo.
                    Acompañamiento, formación y una comunidad que crece contigo.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {[
                      { icon: Leaf, label: 'Bienestar natural' },
                      { icon: HeartHandshake, label: 'Comunidad' },
                      { icon: TrendingUp, label: 'Crecimiento' },
                      { icon: Heart, label: 'Bienestar' }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                      >
                        <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: WHY
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Por qué algunas personas deciden compartir FuXion?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No hay una sola razón. Cada persona encuentra la suya.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-card rounded-2xl p-6 md:p-8 border border-emerald-100 dark:border-border shadow-premium-soft card-hover-premium flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-5">
                  {card.icon === 'Leaf' && <Leaf className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
                  {card.icon === 'HeartHandshake' && <HeartHandshake className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
                  {card.icon === 'TrendingUp' && <TrendingUp className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: HOW IT WORKS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Un camino que puedes conocer paso a paso
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sin prisas. Sin compromiso inmediato. Solo información clara para que decidas.
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical line (desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-200 dark:from-emerald-800 dark:via-emerald-700 dark:to-emerald-800" />

            <div className="space-y-12 md:space-y-0">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`relative flex items-center gap-6 md:gap-0 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className={`bg-card rounded-xl p-5 md:p-6 border border-emerald-100 dark:border-border md:inline-block max-w-md w-full md:w-auto ${
                      i % 2 === 0 ? 'md:ml-auto' : ''
                    }`}>
                      <p className="text-base md:text-lg font-semibold text-foreground">{step.text}</p>
                    </div>
                  </div>

                  {/* Number circle */}
                  <div className="relative z-10 flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border-4 border-white dark:border-card flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                    <span className="text-xs md:text-sm font-bold text-emerald-700 dark:text-emerald-300">{step.number}</span>
                  </div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: WHO IT'S FOR
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-card">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Puede ser para ti si...
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {whoItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4 bg-card rounded-xl p-5 border border-emerald-100 dark:border-border"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-foreground font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: QUIZ
      ════════════════════════════════════════════════════════════ */}
      <section ref={quizRef} className="py-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <Badge className="mb-4 px-4 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">
              <Star className="w-4 h-4 mr-1.5" />
              Descubre si conecta contigo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Podría ser para ti?
            </h2>
            <p className="text-lg text-muted-foreground">
              Responde 4 preguntas rápidas. Sin compromiso, solo para explorar.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!quizStarted ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[20px] shadow-premium-soft btn-scale-hover text-base px-7 py-0 h-14"
                  onClick={handleStartQuiz}
                >
                  Comenzar quiz
                  <ChevronRight className="ml-2 h-[18px] w-[18px] stroke-[1.75]" />
                </Button>
              </motion.div>
            ) : quizComplete ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-2xl p-6 md:p-8 border border-emerald-100 dark:border-border text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="mb-6"
                >
                  {quizAnswers.filter(a => a === 'yes').length >= 3 ? (
                    <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto">
                      <Star className="w-8 h-8 text-amber-500" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto">
                      <Heart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {quizAnswers.filter(a => a === 'yes').length >= 3
                    ? '¡Hay buena conexión!'
                    : 'Gracias por participar'}
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  {getQuizResultMessage()}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-3xl shadow-premium-soft btn-scale-hover"
                    onClick={handleOpenForm}
                  >
                    Quiero más información
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="font-bold rounded-3xl btn-scale-hover"
                    onClick={handleQuizRestart}
                  >
                    Volver a intentar
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`q-${currentQuestion}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="bg-card rounded-2xl p-6 md:p-8 border border-emerald-100 dark:border-border"
              >
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Pregunta {currentQuestion + 1} de {quizQuestions.length}</span>
                    <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: `${(currentQuestion / quizQuestions.length) * 100}%` }}
                      animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-8 text-center">
                  {quizQuestions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleQuizAnswer(option.value)}
                      className="w-full text-left p-4 rounded-xl border border-emerald-100 dark:border-border bg-background hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200 group cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <span className="text-foreground font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                          {option.label}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: TRANSPARENCY BLOCK
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-amber-50/60 dark:bg-amber-950/10 border-y border-amber-100 dark:border-amber-900/30">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Un proyecto real requiere compromiso
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              FuXion es una oportunidad de emprendimiento independiente.
              Los resultados dependen del aprendizaje, constancia,
              dedicación y esfuerzo personal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: VIDEO OPORTUNIDAD
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-950/5 dark:to-card">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <Badge className="mb-4 px-4 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">
              <BookOpen className="w-4 h-4 mr-1.5" />
              Aprende cómo funciona
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Conoce cómo funciona la oportunidad FuXion
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Antes de decidir, puedes ver una explicación sencilla sobre cómo las personas
              desarrollan su proyecto FuXion a su ritmo.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
            <OpportunityVideo />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[20px] shadow-premium-soft btn-scale-hover text-base px-7 py-0 h-[54px] sm:h-14"
              onClick={() => {
                handleOpenForm();
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'OPPORTUNITY_FORM_SENT', {
                    event_category: 'opportunity',
                    event_label: 'Quiero recibir información'
                  });
                }
              }}
            >
              Quiero recibir información
              <ArrowRight className="ml-2 h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-bold rounded-[20px] text-base px-7 py-0 h-[54px] sm:h-14 border border-emerald-200 dark:border-emerald-800 bg-white/75 dark:bg-transparent btn-scale-hover"
              onClick={() => {
                handleWhatsApp('Hola, quiero información sobre la oportunidad FuXion.');
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'OPPORTUNITY_WHATSAPP_CLICK', {
                    event_category: 'opportunity',
                    event_label: 'WhatsApp desde video oportunidad'
                  });
                }
              }}
            >
              <MessageCircle className="mr-2 h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
              Hablar por WhatsApp
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: LEAD CAPTURE FORM
      ════════════════════════════════════════════════════════════ */}
      <section ref={formRef} className="py-20 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-card">
        <div className="container mx-auto px-6 max-w-xl">
          <AnimatePresence mode="wait">
            {formSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl p-6 md:p-12 border border-emerald-100 dark:border-border text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  ¡Gracias por tu interés!
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Hemos recibido tu información. Pronto recibirás más detalles
                  sobre cómo funciona la oportunidad FuXion.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-3xl shadow-premium-soft btn-scale-hover"
                    onClick={() => navigate('/explorar')}
                  >
                    Explorar productos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="font-bold rounded-3xl btn-scale-hover"
                    onClick={() => handleWhatsApp('Hola, recibí información sobre la oportunidad FuXion y quiero saber más.')}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Hablar por WhatsApp
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-10">
                  <Badge className="mb-4 px-4 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">
                    <Send className="w-4 h-4 mr-1.5" />
                    Recibe más información
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    ¿Te gustaría saber más?
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Déjanos tus datos y te contactamos sin compromiso.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="bg-card rounded-2xl p-6 md:p-8 border border-emerald-100 dark:border-border space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      País
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleFormChange('country', e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Selecciona tu país</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={formData.whatsapp}
                      onChange={(e) => handleFormChange('whatsapp', e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Interest */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      ¿Qué te interesa? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'products', label: 'Quiere consumir productos' },
                        { value: 'business', label: 'Quiere conocer el negocio FuXion' },
                        { value: 'both', label: 'Productos y oportunidad FuXion' },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                            formData.interest === option.value
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                              : 'border-border hover:border-emerald-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="interest"
                            value={option.value}
                            checked={formData.interest === option.value}
                            onChange={(e) => handleFormChange('interest', e.target.value)}
                            className="w-4 h-4 text-emerald-600"
                          />
                          <span className="text-foreground">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[20px] shadow-premium-soft btn-scale-hover text-base py-0 h-14"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Enviar
                        <Send className="h-[18px] w-[18px] stroke-[1.75]" />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: FINAL CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-emerald-800 to-teal-900 text-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para explorar esta posibilidad?
            </h2>
            <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              No necesitas decidir hoy. Solo queremos que conozcas cómo funciona.
              El resto lo decides tú, a tu ritmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button
                size="lg"
                className="btn-mobile-full bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-[20px] shadow-premium-soft btn-scale-hover text-base px-7 py-0 h-[54px] sm:h-14 max-w-[300px]"
                onClick={handleOpenForm}
              >
                <span className="text-balance">Quiero recibir información</span>
                <ArrowRight className="ml-2 h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="btn-mobile-full font-bold rounded-[20px] text-base px-7 py-0 h-[54px] sm:h-14 max-w-[300px] border border-emerald-300/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 btn-scale-hover"
                onClick={() => navigate('/explorar')}
              >
                <Leaf className="mr-2 h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
                <span className="text-balance">Ver productos</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: PRODUCT INTEGRATION BANNER (soft)
      ════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-card border-t border-emerald-100 dark:border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
            {...fadeUp}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-foreground font-semibold">
                  ¿Te gusta el mundo del bienestar?
                </p>
                <p className="text-sm text-muted-foreground">
                  Descubre cómo algunas personas también comparten FuXion.
                </p>
              </div>
            </div>
            <Button
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-3xl shadow-premium-soft btn-scale-hover whitespace-nowrap flex-shrink-0"
              onClick={() => navigate('/oportunidad-fuxion')}
            >
              Conocer oportunidad
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default OpportunityPage;
