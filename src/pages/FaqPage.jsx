import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { SITE_URL, STORE_NAME } from '@/lib/productSeo';
import { openWhatsapp } from '@/lib/whatsapp';
import {
  ChevronDown,
  Search,
  MessageCircle,
  HelpCircle,
  Leaf,
  Zap,
  Scale,
  ShoppingBag,
  Info,
  ArrowRight,
  Sparkles,
  Heart,
  Shield,
  Bot,
  Package,
  Truck,
  Droplets,
  BookOpen,
  Pill,
  Coffee,
  Timer,
  Activity,
  Apple,
  Sun,
  AlertCircle,
  Flame,
  Brain,
  Dumbbell,
  Apple as AppleIcon,
  Gem,
  Wind,
  HeartPulse,
  Check,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PAGE TRANSITION VARIANTS
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// CATEGORY DEFINITIONS — All product lines
// ═══════════════════════════════════════════════════════════════
const FAQ_CATEGORIES = [
  { id: 'all', label: 'Todas', icon: HelpCircle, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'general', label: 'Información general', icon: Info, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'digestion', label: 'Digestión y equilibrio intestinal', icon: Droplets, color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  { id: 'limpieza_balance', label: 'Limpieza y balance', icon: Wind, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'vitalidad', label: 'Energía y vitalidad', icon: Zap, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'control_peso', label: 'Control de hábitos y composición corporal', icon: Scale, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-100 dark:bg-rose-900/30' },
  { id: 'belleza', label: 'Belleza y cuidado anti edad', icon: Gem, color: 'text-pink-600 dark:text-pink-400', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  { id: 'defensas', label: 'Sistema de defensas', icon: Shield, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { id: 'bienestar_mental', label: 'Bienestar mental y concentración', icon: Brain, color: 'text-violet-600 dark:text-violet-400', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
  { id: 'nutricion', label: 'Nutrición diaria y proteína', icon: AppleIcon, color: 'text-lime-600 dark:text-lime-400', bgColor: 'bg-lime-100 dark:bg-lime-900/30' },
  { id: 'compra', label: 'Compra y envío', icon: ShoppingBag, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
];

// ═══════════════════════════════════════════════════════════════
// FAQ DATA — Premium Content — All Product Lines
// ═══════════════════════════════════════════════════════════════
const FAQ_ITEMS = [
  // ── GENERAL ──────────────────────────────────────────────────
  {
    id: 'que-es-fuxion',
    category: 'general',
    question: '¿Qué es FuXion?',
    answer: (
      <div className="space-y-4">
        <p>
          FuXion es una línea de productos nutracéuticos que combina ingredientes de origen natural,
          ciencia y nutrición funcional para acompañar diferentes objetivos de bienestar como energía,
          digestión, nutrición diaria, control de hábitos y estilo de vida saludable.
        </p>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Aclaración importante:</strong> Los productos FuXion no reemplazan una alimentación
              equilibrada ni tratamientos médicos.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Leaf,
  },
  {
    id: 'donde-comprar-chile',
    category: 'general',
    question: '¿Dónde puedo comprar productos FuXion en Chile?',
    answer: (
      <div className="space-y-4">
        <p>
          Puedes comprar productos FuXion a través de distribuidores independientes autorizados.
          En nuestra tienda puedes revisar disponibilidad, recibir orientación personalizada y
          coordinar entrega según tu ubicación.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            size="sm"
            onClick={() => openWhatsapp('Hola, quiero hablar con un asesor FuXion para comprar productos.')}
            className="w-full sm:w-auto"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Hablar con un asesor
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.href = '/explorar'}
            className="w-full sm:w-auto"
          >
            <Package className="mr-2 h-4 w-4" />
            Ver productos
          </Button>
        </div>
      </div>
    ),
    icon: ShoppingBag,
  },
  {
    id: 'son-medicamentos',
    category: 'general',
    question: '¿Los productos FuXion son medicamentos?',
    answer: (
      <div className="space-y-4">
        <p>
          No. Los productos FuXion son nutracéuticos y suplementos alimenticios. No son medicamentos,
          no diagnostican ni reemplazan tratamientos indicados por profesionales de salud.
        </p>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4">
          <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Su consumo debe ser parte de un estilo de vida saludable y no sustituye
              una consulta médica.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Pill,
  },
  {
    id: 'como-se-preparan',
    category: 'general',
    question: '¿Cómo se preparan los productos FuXion?',
    answer: (
      <div className="space-y-4">
        <p>
          La mayoría de los productos FuXion vienen en sobres individuales que se mezclan con agua
          fría o caliente, dependiendo del producto.
        </p>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
            <span>
              <strong>Recomendación:</strong> Siempre revisar la indicación específica de cada fórmula
              en el empaque del producto.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Coffee,
  },
  {
    id: 'combinar-productos',
    category: 'general',
    question: '¿Puedo combinar varios productos FuXion?',
    answer: (
      <div className="space-y-4">
        <p>
          Muchos productos pueden formar parte de una rutina personalizada, pero la combinación ideal
          depende del objetivo de cada persona.
        </p>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4">
          <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Recomendamos asesoría personalizada</strong> para encontrar la combinación que
              mejor se adapte a tus necesidades.
            </span>
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => openWhatsapp('Hola, quiero una asesoría personalizada para combinar productos FuXion.')}
          className="w-full sm:w-auto"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Solicitar asesoría personalizada
        </Button>
      </div>
    ),
    icon: Sparkles,
  },
  {
    id: 'que-producto-necesito',
    category: 'general',
    question: '¿Cómo sé qué producto FuXion necesito?',
    answer: (
      <div className="space-y-4">
        <p>
          No todos buscan lo mismo. Cada persona tiene objetivos distintos y lo que funciona para
          alguien puede no ser lo ideal para otro.
        </p>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                ¿No sabes por dónde empezar?
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-3">
                Cuéntanos tu objetivo (energía, digestión, hábitos, bienestar general) y te ayudamos
                a encontrar una alternativa adecuada.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  const botTrigger = document.querySelector('[data-falcon-bot-trigger]');
                  if (botTrigger) {
                    botTrigger.click();
                  } else {
                    openWhatsapp('Hola, quiero ayuda para elegir un producto FuXion. Mi objetivo es:');
                  }
                }}
              >
                <Bot className="mr-2 h-4 w-4" />
                Preguntar al asistente IA
              </Button>
            </div>
          </div>
        </div>
      </div>
    ),
    icon: HelpCircle,
  },

  // ── DIGESTIÓN Y EQUILIBRIO INTESTINAL ────────────────────────
  {
    id: 'producto-digestion',
    category: 'digestion',
    question: 'Me siento inflamado o mi digestión no está equilibrada ¿qué opciones existen?',
    answer: (
      <div className="space-y-4">
        <p>
          Si sientes molestias digestivas o inflamación, FuXion cuenta con alternativas naturales
          pensadas para apoyar el bienestar intestinal desde distintos enfoques. La elección depende
          de tu objetivo principal:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Prunex 1</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Té herbal que combina fibras como psyllium, inulina de achicoria y linaza, junto con
              guindón, pensado para apoyar el tránsito intestinal y contribuir a una sensación de
              ligereza.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Flora Liv</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Producto orientado al equilibrio de la microbiota intestinal, combinando cultivos
              probióticos con fibra prebiótica, granadilla y aguaymanto. Ideal para quienes buscan
              apoyar su flora intestinal.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Liquid Fiber</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Alternativa con fibra soluble prebiótica, vitaminas y minerales para apoyar la función
              digestiva diaria y contribuir al bienestar intestinal de forma práctica.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
            <span>
              <strong>¿Cuál elegir?</strong> Si buscas apoyo para el tránsito intestinal, Prunex 1
              puede ser una buena opción. Si prefieres enfocarte en el equilibrio de tu microbiota,
              Flora Liv está diseñado para eso. Y si buscas una alternativa práctica de fibra diaria,
              Liquid Fiber es una excelente opción.
            </span>
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Importante:</strong> La opción ideal depende de cada persona y sus necesidades
              específicas. Consulta con un asesor para encontrar la alternativa más adecuada para ti.
            </span>
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4">
          <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Cada persona tiene objetivos diferentes. Si tienes dudas puedes recibir orientación
              personalizada para elegir la alternativa más adecuada.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Droplets,
  },

  // ── LIMPIEZA Y BALANCE ────────────────────────────────────────
  {
    id: 'higado-limpieza',
    category: 'limpieza_balance',
    question: '¿Qué productos apoyan el equilibrio del organismo?',
    answer: (
      <div className="space-y-4">
        <p>
          Si buscas apoyar el equilibrio natural de tu organismo, FuXion cuenta con alternativas
          que combinan vegetales, antioxidantes y nutrientes para acompañar hábitos saludables:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Wind className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Rexet</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Bebida efervescente con concentrados vegetales como tuna roja, alcachofa, hierba luisa,
              perejil y clorofila, orientada al apoyo de funciones relacionadas con el bienestar
              hepático.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Wind className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Alpha Balance</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Bebida verde con alfalfa, chlorella, espirulina, pasto de trigo y espinaca, diseñada
              para acompañar hábitos saludables con vegetales y minerales.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Wind className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Berry Balance</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Producto basado en berries como cranberry y camu camu, combinado con antioxidantes
              y probióticos para apoyar el equilibrio del organismo.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
            <span>
              <strong>¿Cuál elegir?</strong> Rexet está orientado al bienestar hepático con
              concentrados vegetales. Alpha Balance aporta vegetales verdes y minerales. Berry
              Balance ofrece una alternativa con berries y probióticos.
            </span>
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Estos productos apoyan el equilibrio natural del cuerpo como parte de un
              estilo de vida saludable.
            </span>
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4">
          <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Cada persona tiene objetivos diferentes. Si tienes dudas puedes recibir orientación
              personalizada para elegir la alternativa más adecuada.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Wind,
  },

  // ── ENERGÍA Y VITALIDAD ──────────────────────────────────────
  {
    id: 'producto-energia',
    category: 'vitalidad',
    question: 'Me siento cansado o quiero más vitalidad ¿qué productos podrían acompañarme?',
    answer: (
      <div className="space-y-4">
        <p>
          Si sientes que tu energía necesita un impulso o buscas mayor vitalidad en tu día a día,
          FuXion cuenta con alternativas diseñadas para distintos estilos de vida y necesidades:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Vita Xtra T+</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Producto enfocado en apoyar energía, vitalidad y rendimiento diario, combinando
              guayusa, té verde, maca, ginseng, cordyceps y antioxidantes.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Vitaenergía</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Complemento nutricional diario diseñado para aportar nutrientes esenciales como
              aminoácidos, vitaminas, minerales, fibra prebiótica, camu camu y luteína.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Nutraday</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Apoyo nutricional diario para complementar la alimentación y una rutina saludable,
              ideal como hidratación funcional para toda la familia.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
            <span>
              <strong>¿Cuál elegir?</strong> Si buscas un impulso de energía con ingredientes como
              guayusa y maca, Vita Xtra T+ puede ser una excelente opción. Si prefieres un
              complemento nutricional completo con vitaminas y minerales, Vitaenergía es ideal.
              Nutraday es una alternativa práctica para hidratación nutricional diaria.
            </span>
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4">
          <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Cada persona tiene objetivos diferentes. Si tienes dudas puedes recibir orientación
              personalizada para elegir la alternativa más adecuada.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Zap,
  },

  // ── CONTROL DE PESO ──────────────────────────────────────────
  {
    id: 'control-peso',
    category: 'control_peso',
    question: '¿Qué productos FuXion ayudan a controlar el peso?',
    answer: (
      <div className="space-y-4">
        <p>
          FuXion cuenta con una línea completa de productos diseñados para acompañar hábitos saludables
          relacionados con composición corporal, metabolismo y control de peso:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Thermo T3</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Termogénico con té verde, negro y rojo, L-Carnitina y cetonas de frambuesa que
              transforma grasa en energía y acelera el metabolismo.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                <Scale className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Nocarb-T</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Inhibidor de carbohidratos con fibras solubles, yacón y té verde que reduce la
              asimilación de azúcares y ayuda a controlar la glucosa en sangre.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                <Apple className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Protein Active Fit</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Batido proteico 100% vegetal que acelera el metabolismo, quema grasa localizada,
              tonifica músculos y reduce la sensación de apetito.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                <Coffee className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Café & Café Fit Cappuccino</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Café funcional con Svetol® que bloquea la liberación de glucosa hepática,
              domina el apetito y apoya el control de peso en formato cappuccino.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            El resultado depende de múltiples factores como:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              { icon: Apple, text: 'Alimentación equilibrada' },
              { icon: Activity, text: 'Actividad física regular' },
              { icon: Timer, text: 'Constancia en los hábitos' },
              { icon: Sun, text: 'Estilo de vida en general' },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Los productos FuXion acompañan, no reemplazan, una alimentación saludable y la
              actividad física.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Scale,
  },

  // ── BELLEZA Y ANTI-EDAD ──────────────────────────────────────
  {
    id: 'belleza-antiedad',
    category: 'belleza',
    question: '¿Qué productos FuXion son ideales para belleza, anti-edad y cuidado de la piel?',
    answer: (
      <div className="space-y-4">
        <p>
          FuXion tiene una línea completa Anti-Edad diseñada para cuidar la piel desde adentro,
          estimular la hormona de crecimiento, equilibrar hormonas y mantener la vitalidad:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                <Gem className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Beauty-In</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Colágeno bioactivo tipos 1 y 3 con Coenzima Q10, biotina y vitamina E. Nutre la piel
              desde adentro, mejora firmeza, reduce arrugas y fortalece cabello y uñas.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                <Gem className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Youth Elixir HGH</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Estimula la glándula pituitaria y la secreción de la hormona de crecimiento (HGH).
              Retarda el envejecimiento prematuro, aumenta la vitalidad y mejora el sueño.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Probal</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Té herbal con aguaje y orégano que equilibra desbalances hormonales femeninos,
              controla molestias del período y mantiene el balance durante la menopausia.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                <Gem className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Golden FLX</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Cúrcuma orgánica con jengibre, cardamomo y leche de coco. Antiinflamatorio natural
              que previene problemas articulares, artritis y dolor articular.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Passion</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Con jalea real, ginseng y maca que mejora la circulación, la potencia sexual
              y la vitalidad general. Ideal para hombres y mujeres.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-pink-500" />
            <span>
              <strong>Combo anti-edad recomendado:</strong> Youth Elixir HGH + Beauty-In + Golden FLX
              para un enfoque integral desde adentro.
            </span>
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Los resultados visibles en piel y vitalidad suelen apreciarse después de 4 a 8 semanas
              de consumo constante.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Gem,
  },

  // ── SISTEMA INMUNOLÓGICO ─────────────────────────────────────
  {
    id: 'sistema-inmunologico',
    category: 'defensas',
    question: '¿Qué productos FuXion fortalecen el sistema inmunológico?',
    answer: (
      <div className="space-y-4">
        <p>
          FuXion cuenta con productos diseñados para fortalecer las defensas del organismo,
          activar el sistema inmune y proteger el sistema respiratorio:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Vera+</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Fórmula con beta glucanos de levadura de cerveza que activa el sistema inmune,
              fortalece las defensas y protege el sistema respiratorio.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Gano+ Cappuccino</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Café con beta glucanos y ganoderma que combina el placer del cappuccino con el
              fortalecimiento del sistema inmune. Ideal para niños y adultos.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Alpha Balance</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Bebida verde con alfalfa, chlorella y espirulina que también apoya las defensas
              gracias a su alto contenido de clorofila y antioxidantes.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Vitaenergía</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Multivitamínico con vitaminas C, D, zinc y selenio que complementa la nutrición
              diaria y fortalece el sistema inmunológico.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            Para una protección completa, muchos combinan Vera+ en la mañana con Gano+ Cappuccino
            en la tarde como parte de su rutina diaria de defensas.
          </p>
        </div>
      </div>
    ),
    icon: Shield,
  },

  // ── VIGOR MENTAL ─────────────────────────────────────────────
  {
    id: 'vigor-mental',
    category: 'bienestar_mental',
    question: '¿Qué productos FuXion ayudan con la concentración, el estrés y la salud mental?',
    answer: (
      <div className="space-y-4">
        <p>
          FuXion tiene productos diseñados para apoyar la función cerebral, reducir el estrés,
          mejorar la concentración y mantener el equilibrio mental:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Brain className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">ON</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Bebida funcional con taurina, yerba mate y vitaminas del complejo B que potencia
              la concentración, el aprendizaje y mantiene la mente activa y alerta.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Brain className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">No Stress</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Fórmula con pasiflora, tila, magnesio y vitaminas del complejo B que ayuda a reducir
              el estrés, la ansiedad y mejora la calidad del sueño.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Brain className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Youth Elixir HGH</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Estimula la hormona de crecimiento, mejora la calidad del sueño profundo y la
              regeneración celular, lo que impacta positivamente en la claridad mental.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Brain className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Vita Xtra T+</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Energizante natural con guayusa y té verde que también aporta claridad mental
              y enfoque sostenido sin los altibajos del café.
            </p>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Estos productos complementan, no reemplazan, el tratamiento de condiciones de salud
              mental diagnosticadas. Siempre consulta con un profesional.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Brain,
  },

  // ── DEPORTE ──────────────────────────────────────────────────
  {
    id: 'deporte-rendimiento',
    category: 'nutricion',
    question: '¿Qué productos FuXion son ideales para deportistas y rendimiento físico?',
    answer: (
      <div className="space-y-4">
        <p>
          FuXion cuenta con una línea Sport diseñada para apoyar el rendimiento deportivo,
          la recuperación muscular y la nutrición del atleta:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">BioPro+ Sport</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Proteína vegetal de alta calidad con aminoácidos esenciales para la recuperación
              y el crecimiento muscular. Ideal para atletas y deportistas frecuentes.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Pre Sport</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Bebida pre-entreno con cafeína natural, beta-alanina y arginina que potencia la
              energía, la fuerza y el rendimiento durante el entrenamiento.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Post Sport</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Recuperador muscular con proteínas, carbohidratos y electrolitos que acelera la
              recuperación después del ejercicio intenso.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Protein Active Fit</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Batido proteico 100% vegetal que acelera el metabolismo, quema grasa y tonifica
              músculos. Ideal para quienes buscan definición.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
            <span>
              <strong>Protocolo recomendado:</strong> Pre Sport 30 min antes de entrenar + Post Sport
              inmediatamente después + BioPro+ Sport en las comidas.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: Dumbbell,
  },

  // ── NUTRICIÓN ────────────────────────────────────────────────
  {
    id: 'nutricion-diaria',
    category: 'nutricion',
    question: '¿Qué productos FuXion son ideales para la nutrición diaria y el bienestar general?',
    answer: (
      <div className="space-y-4">
        <p>
          FuXion ofrece alternativas para la nutrición diaria que complementan la alimentación
          con vitaminas, minerales y superfoods:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/40 flex items-center justify-center">
                <AppleIcon className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Nutraday</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Hidratación nutricional con guayaba, camu camu, acai berry, quinua germinada,
              12 vitaminas y 5 minerales. Ideal para niños y adultos como complemento diario.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/40 flex items-center justify-center">
                <AppleIcon className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Vitaenergía</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Multivitamínico completo con aminoácidos, vitaminas y minerales para la nutrición
              celular y la vitalidad diaria.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/40 flex items-center justify-center">
                <AppleIcon className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Liquid Fiber</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Fibra prebiótica con vitaminas y minerales que regula el tránsito intestinal
              y mejora la absorción de nutrientes.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/40 flex items-center justify-center">
                <AppleIcon className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Alpha Balance</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Bebida verde con alfalfa, chlorella, espirulina y pasto de trigo que aporta
              clorofila, vitaminas y minerales esenciales.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          La nutrición diaria es la base del bienestar. Estos productos están diseñados para
          complementar una alimentación equilibrada, no para reemplazarla.
        </p>
      </div>
    ),
    icon: AppleIcon,
  },

  // ── COMPRA Y ENVÍO ───────────────────────────────────────────
  {
    id: 'como-comprar',
    category: 'compra',
    question: '¿Cómo puedo comprar productos FuXion y cómo funcionan los envíos?',
    answer: (
      <div className="space-y-4">
        <p>
          Comprar productos FuXion es sencillo. Puedes hacerlo a través de nuestros canales
          de atención con asesoría personalizada incluida:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Compra por WhatsApp</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Escríbenos directamente, te asesoramos sobre el producto ideal y coordinamos
              el pago y envío.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Envíos a todo Chile</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Realizamos envíos a regiones a través de empresas de courier. El costo y tiempo
              de entrega se coordinan directamente contigo.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Entrega en Santiago</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              En la Región Metropolitana podemos coordinar entrega directa o punto de encuentro
              según disponibilidad.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Productos originales</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Todos nuestros productos son 100% originales FuXion Biotech, con garantía de
              autenticidad y seguimiento post-venta.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            size="sm"
            onClick={() => openWhatsapp('Hola, quiero comprar productos FuXion. ¿Me pueden ayudar?')}
            className="w-full sm:w-auto"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Comprar ahora por WhatsApp
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.href = '/explorar'}
            className="w-full sm:w-auto"
          >
            <Package className="mr-2 h-4 w-4" />
            Ver catálogo completo
          </Button>
        </div>
      </div>
    ),
    icon: ShoppingBag,
  },
  {
    id: 'metodos-pago',
    category: 'compra',
    question: '¿Qué métodos de pago aceptan?',
    answer: (
      <div className="space-y-4">
        <p>
          Aceptamos varios métodos de pago para tu comodidad:
        </p>
        <ul className="space-y-3">
          {[
            { text: 'Transferencia bancaria (BCI, Banco Estado, Santander)' },
            { text: 'Depósito en efectivo' },
            { text: 'Mercado Pago' },
            { text: 'Efectivo (solo entregas presenciales en Santiago)' },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-foreground">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
            <span>
              Una vez realizado el pago, coordinamos el envío y te compartimos el número de
              seguimiento si aplica.
            </span>
          </p>
        </div>
      </div>
    ),
    icon: ShoppingBag,
  },
  {
    id: 'tiempo-entrega',
    category: 'compra',
    question: '¿Cuánto tiempo tardan los envíos?',
    answer: (
      <div className="space-y-4">
        <p>
          Los tiempos de entrega dependen de tu ubicación:
        </p>
        <ul className="space-y-3">
          {[
            { icon: Timer, text: 'Santiago: 24-48 horas hábiles' },
            { icon: Truck, text: 'Regiones (courier): 3-7 días hábiles' },
            { icon: Package, text: 'Zonas extremas: 7-12 días hábiles' },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-foreground">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Los tiempos son referenciales y pueden variar según la disponibilidad del producto
          y la empresa de courier.
        </p>
      </div>
    ),
    icon: Truck,
  },
];

// ═══════════════════════════════════════════════════════════════
// ACCORDION COMPONENT
// ═══════════════════════════════════════════════════════════════
const FaqAccordion = ({ item, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  const IconComponent = item.icon;

  return (
    <motion.div
      layout
      className={`group rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-md'
          : 'border-border bg-card hover:border-primary/20 hover:shadow-sm'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl"
        aria-expanded={isOpen}
      >
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span className="flex-1 font-semibold text-foreground text-sm sm:text-base">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div ref={contentRef} className="px-5 pb-5 pt-0 border-t border-border/50 mt-0">
              <div className="pt-4 text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchInputRef = useRef(null);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Toggle accordion item
  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return FAQ_CATEGORIES.find((cat) => cat.id === categoryId);
  };

  return (
    <motion.main
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="overflow-x-hidden"
    >
      <SEO
        title="Preguntas Frecuentes — FuXion Chile | FAQ sobre productos nutracéuticos"
        description="Encuentra respuestas a las preguntas más frecuentes sobre productos FuXion: digestión, energía, control de peso, belleza, sistema inmune, deporte, compras y envíos en Chile."
        canonical="/faq"
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-28 bg-gradient-to-br from-[#f0faf4] via-white to-[#e8f5e9] dark:from-[#0f1f18] dark:via-[#111827] dark:to-[#1b1630]">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">
          <div className="max-w-3xl">
            <motion.p
              className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Preguntas Frecuentes · FuXion Chile
            </motion.p>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              FAQ — Preguntas Frecuentes sobre productos FuXion
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Resolvemos tus dudas sobre nuestros productos nutracéuticos: beneficios, 
              formas de uso, combinaciones recomendadas, compras y envíos a todo Chile.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── SEARCH & FILTERS ─────────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar preguntas frecuentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl border-border bg-background"
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTERS ─────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {FAQ_CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground hover:shadow-sm'
                }`}
              >
                <CatIcon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ACCORDION LIST ───────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredItems.map((item) => (
                <FaqAccordion
                  key={item.id}
                  item={item}
                  isOpen={!!openItems[item.id]}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No encontramos resultados
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Intenta con otros términos o explora las categorías disponibles.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Limpiar filtros
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        {filteredItems.length > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            Mostrando {filteredItems.length} de {FAQ_ITEMS.length} preguntas frecuentes
          </p>
        )}
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────── */}
      <section className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Si tienes una pregunta específica sobre productos FuXion, beneficios, 
            combinaciones o compras, nuestro equipo está listo para ayudarte.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-emerald-700 hover:bg-emerald-50"
            >
              <Link to="/contacto">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contactar asesor
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Link to="/explorar">
                Ver productos <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── SCROLL TO TOP ────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            aria-label="Volver arriba"
          >
            <ChevronDown className="w-5 h-5 rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default FaqPage;
