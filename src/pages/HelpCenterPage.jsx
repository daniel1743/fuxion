import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import SEO from '@/components/SEO';
import {
  MessageCircle,
  HelpCircle,
  Package,
  AlertTriangle,
  Star,
  Users,
  Send,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Mail,
  Phone,
  Shield,
  Heart,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { openWhatsapp } from '@/lib/whatsapp';

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

// ── Help cards ────────────────────────────────────────────────
const helpCards = [
  {
    id: 'producto',
    emoji: '💬',
    title: 'Necesito ayuda con un producto',
    description: 'Orientación sobre productos FuXion.',
    icon: HelpCircle,
    gradient: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800/40',
  },
  {
    id: 'pedido',
    emoji: '📦',
    title: 'Tengo una duda sobre mi pedido',
    description: 'Consultas sobre compra, entrega o disponibilidad.',
    icon: Package,
    gradient: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800/40',
  },
  {
    id: 'reclamo',
    emoji: '📝',
    title: 'Enviar reclamo',
    description: 'Cuéntanos qué ocurrió para ayudarte.',
    icon: AlertTriangle,
    gradient: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/20',
    borderColor: 'border-amber-200 dark:border-amber-800/40',
  },
  {
    id: 'felicitacion',
    emoji: '⭐',
    title: 'Enviar felicitación o sugerencia',
    description: 'Tu opinión nos ayuda a mejorar.',
    icon: Star,
    gradient: 'from-purple-500 to-pink-500',
    lightBg: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800/40',
  },
  {
    id: 'asesor',
    emoji: '🤝',
    title: 'Quiero hablar con un asesor',
    description: 'Contacto directo.',
    icon: Users,
    gradient: 'from-emerald-600 to-green-600',
    lightBg: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800/40',
  },
];

// ── Request types for form ────────────────────────────────────
const requestTypes = [
  { value: 'pregunta', label: 'Tengo una pregunta', icon: HelpCircle },
  { value: 'producto', label: 'Consulta sobre productos', icon: Package },
  { value: 'pedido', label: 'Consulta sobre mi pedido', icon: ShoppingBag },
  { value: 'reclamo', label: 'Reclamo o inconveniente', icon: AlertTriangle },
  { value: 'felicitacion', label: 'Felicitación o experiencia', icon: Star },
  { value: 'sugerencia', label: 'Sugerencia', icon: Sparkles },
  { value: 'otro', label: 'Otro motivo', icon: MessageCircle },
];

// ── Trust messages ────────────────────────────────────────────
const trustMessages = [
  {
    icon: Heart,
    text: 'Estamos para ayudarte',
    subtext: 'Respondemos personalmente cada solicitud',
  },
  {
    icon: Shield,
    text: 'Tu opinión nos ayuda a mejorar',
    subtext: 'Cada mensaje es leído por nuestro equipo',
  },
  {
    icon: MessageCircle,
    text: 'Atención 100% personalizada',
    subtext: 'Te responderemos a la brevedad',
  },
];

const HelpCenterPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    whatsapp: '',
    email: '',
    mensaje: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // ── Form handlers ───────────────────────────────────────────
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      toast({
        title: 'Nombre requerido',
        description: 'Por favor ingresa tu nombre.',
        variant: 'destructive',
      });
      return false;
    }
    if (!formData.tipo) {
      toast({
        title: 'Tipo de solicitud requerido',
        description: 'Selecciona el motivo de tu mensaje.',
        variant: 'destructive',
      });
      return false;
    }
    if (!formData.whatsapp.trim() && !formData.email.trim()) {
      toast({
        title: 'Contacto requerido',
        description: 'Necesitamos un medio de contacto para poder responderte.',
        variant: 'destructive',
      });
      return false;
    }
    if (!formData.mensaje.trim()) {
      toast({
        title: 'Mensaje requerido',
        description: 'Cuéntanos cómo podemos ayudarte.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormLoading(true);

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        tipo: formData.tipo,
        whatsapp: formData.whatsapp.trim(),
        email: formData.email.trim(),
        mensaje: formData.mensaje.trim(),
        origen: 'Centro de ayuda',
        fecha: new Date().toLocaleString('es-CL', {
          timeZone: 'America/Santiago',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const response = await fetch('/api/help-center-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      setFormSubmitted(true);

      toast({
        title: 'Solicitud enviada',
        description: 'Gracias, recibimos tu solicitud. Te responderemos pronto.',
      });
    } catch (error) {
      toast({
        title: 'No pudimos enviar tu solicitud',
        description: 'También puedes contactarnos por WhatsApp.',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      tipo: '',
      whatsapp: '',
      email: '',
      mensaje: ''
    });
    setFormSubmitted(false);
    setSelectedCard(null);
  };

  const handleCardClick = (cardId) => {
    const tipoMap = {
      'producto': 'producto',
      'pedido': 'pedido',
      'reclamo': 'reclamo',
      'felicitacion': 'felicitacion',
      'asesor': 'asesor',
    };
    const tipo = tipoMap[cardId] || 'otro';

    if (cardId === 'asesor') {
      openWhatsapp('Hola, quiero hablar con un asesor FuXion.');
      return;
    }

    setFormData(prev => ({ ...prev, tipo }));
    setSelectedCard(cardId);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('help-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const getCardById = (id) => helpCards.find(c => c.id === id);

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
        title="Centro de Ayuda FuXion | Contacto y Soporte"
        description="Centro de ayuda de Naturalmente FuXion. Envía tu consulta, reclamo, felicitación o sugerencia. Te responderemos personalmente."
        canonical="/ayuda"
      />

      {/* ═══════════════════════════════════════════════════════════
         HERO SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-24 bg-gradient-to-br from-[#f0faf4] via-white to-[#e8f5e9] dark:from-[#0a1a12] dark:via-[#0f1f18] dark:to-[#0d2818]">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-teal-100/30 dark:bg-teal-900/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-emerald-50/50 dark:bg-emerald-800/10 blur-2xl" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300 bg-white/80 dark:bg-emerald-950/40">
              <MessageCircle className="w-4 h-4 mr-2" />
              Centro de Ayuda
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            ¿En qué podemos{' '}
            <span className="text-emerald-600 dark:text-emerald-400">ayudarte</span>
            ? 🌱
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Estamos para ayudarte. Selecciona una opción y cuéntanos cómo podemos servirte.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: HELP CARDS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {helpCards.map((card, i) => {
              const IconComponent = card.icon;
              const isSelected = selectedCard === card.id;
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  onClick={() => handleCardClick(card.id)}
                  className={`relative group text-left w-full rounded-2xl p-6 border-2 transition-all duration-300 ${
                    isSelected
                      ? `${card.lightBg} ${card.borderColor} ring-2 ring-offset-2 ring-offset-background ${card.borderColor.replace('border-', 'ring-')}/50`
                      : 'bg-card border-border hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  {/* Gradient accent top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${card.gradient} opacity-60`} />

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/10`}>
                      <span className="text-2xl">{card.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-foreground text-base mb-1.5">
                        {card.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 mt-2 transition-all duration-300 ${
                      isSelected ? 'text-emerald-500 rotate-90' : 'text-muted-foreground/40 group-hover:text-emerald-400 group-hover:translate-x-1'
                    }`} strokeWidth={1.8} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: TRUST MESSAGES
      ════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustMessages.map((item, i) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{item.text}</h4>
                  <p className="text-xs text-muted-foreground">{item.subtext}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION: FORM
      ════════════════════════════════════════════════════════════ */}
      <section id="help-form-section" className="py-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <AnimatePresence mode="wait">
            {formSubmitted ? (
              /* ── Success state ──────────────────────────────── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-2xl p-8 md:p-12 border border-emerald-100 dark:border-border text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  ¡Gracias por contactarnos!
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  Recibimos tu solicitud. Nuestro equipo la revisará y te responderemos a la brevedad.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-3xl shadow-premium-soft btn-scale-hover"
                    onClick={handleReset}
                  >
                    Enviar otra solicitud
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="font-bold rounded-3xl btn-scale-hover"
                    onClick={() => openWhatsapp('Hola, recibí información sobre mi consulta FuXion y quiero saber más.')}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Hablar por WhatsApp
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* ── Form ───────────────────────────────────────── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-10">
                  <Badge className="mb-4 px-4 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">
                    <Send className="w-4 h-4 mr-1.5" />
                    Envíanos tu solicitud
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Cuéntanos cómo podemos ayudarte
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Completa el formulario y te responderemos pronto.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 border border-emerald-100 dark:border-border space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Request type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Motivo <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {requestTypes.map((option) => {
                        const Icon = option.icon;
                        const isSelected = formData.tipo === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleChange('tipo', option.value)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                                : 'border-border hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10'
                            }`}
                          >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${
                              isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                            }`} />
                            <span className={`text-sm font-medium ${
                              isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-foreground'
                            }`}>
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WhatsApp */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        WhatsApp <span className="text-xs text-muted-foreground">(obligatorio si no tienes correo)</span>
                      </label>
                      <Input
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={formData.whatsapp}
                        onChange={(e) => handleChange('whatsapp', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Correo electrónico <span className="text-xs text-muted-foreground">(obligatorio si no tienes WhatsApp)</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="tu@correo.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3">
                    <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      Necesitamos un medio de contacto para poder responderte.
                    </p>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                      value={formData.mensaje}
                      onChange={(e) => handleChange('mensaje', e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[120px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[20px] shadow-premium-soft btn-scale-hover text-base py-0 h-14"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Enviando solicitud...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Enviar solicitud
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
              ¿Prefieres atención directa?
            </h2>
            <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              Nuestro equipo está disponible para resolver tus dudas
              de forma rápida y personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button
                size="lg"
                className="btn-mobile-full bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-[20px] shadow-premium-soft btn-scale-hover text-base px-7 py-0 h-[54px] sm:h-14 max-w-[300px]"
                onClick={() => openWhatsapp('Hola, quiero contactar con un asesor FuXion.')}
              >
                <MessageCircle className="mr-2 h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
                <span className="text-balance">Hablar por WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="btn-mobile-full font-bold rounded-[20px] text-base px-7 py-0 h-[54px] sm:h-14 max-w-[300px] border border-emerald-300/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 btn-scale-hover"
                onClick={() => window.location.href = 'mailto:contacto@naturalmentefuxion.cl'}
              >
                <Mail className="mr-2 h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
                <span className="text-balance">Enviar correo</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HelpCenterPage;
