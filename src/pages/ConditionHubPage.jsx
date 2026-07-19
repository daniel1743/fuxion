import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Leaf01Icon,
  WeightScaleIcon,
  Moon01Icon,
  Shield02Icon,
  HeartPulseIcon,
  HeartIcon,
  BoneIcon,
  DumbbellIcon,
  LiverIcon,
  BrainIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { CONDITIONS_HUB } from '@/data/conditionHub';
import { getSeoProductBySlug, buildBreadcrumbSchema, buildPersonSchema } from '@/lib/productSeo';
import { generateArticleSchema, extractSemanticKeywords } from '@/lib/articleEnricher';

const ICON_MAP = {
  weight: WeightScaleIcon,
  digestion: Leaf01Icon,
  sleep: Moon01Icon,
  stress: BrainIcon,
  liver: LiverIcon,
  intestine: Leaf01Icon,
  shield: Shield02Icon,
  beauty: HeartIcon,
  bone: BoneIcon,
  sport: DumbbellIcon,
};

const ConditionHubPage = () => {
  const { slug } = useParams();
  const condition = CONDITIONS_HUB[slug];

  if (!condition) {
    return (
      <main className="container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold">Condición no encontrada</h1>
        <Link to="/bienestar"><Button className="mt-6">Ir a Bienestar</Button></Link>
      </main>
    );
  }

  const Icon = ICON_MAP[condition.icon] || Leaf01Icon;
  const relatedProducts = condition.products.map(slug => getSeoProductBySlug(slug)).filter(Boolean);
  const keywords = extractSemanticKeywords(condition.description, condition.title);
  const personSchema = buildPersonSchema({ name: 'Daniel Falcón' });
  const schemas = [
    ...generateArticleSchema(
      {
        title: condition.title,
        excerpt: condition.description,
        category: condition.title,
        created_at: '2026-07-19',
        updated_at: '2026-07-19',
        image_url: '/branding/social/og-image.png'
      },
      personSchema
    ),
    buildBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Bienestar', url: '/bienestar' },
      { name: condition.title, url: `/condicion/${slug}` }
    ])
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <SEO
        title={condition.title}
        description={condition.description}
        canonical={`/condicion/${slug}`}
        ogType="article"
        ogImage="/branding/social/og-image.png"
        ogImageAlt={condition.title}
        ogType="article"
        schema={schemas}
      >
        <meta name="keywords" content={keywords.join(', ')} />
      </SEO>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-6">
              <HugeiconsIcon icon={Icon} className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
              {condition.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {condition.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products section */}
      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Productos Fuxion para {condition.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(product => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  to={`/producto/${product.slug}`}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-emerald-500/50 hover:shadow-lg transition-all"
                >
                  <div className="h-40 bg-secondary flex items-center justify-center">
                    <img
                      src={product.image || '/img/productos/placeholder.png'}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground group-hover:text-emerald-600">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                    <p className="text-lg font-bold text-emerald-600 mt-3">
                      ${product.price.toLocaleString('es-CL')}
                    </p>
                    <Button size="sm" className="mt-3 w-full">
                      Ver detalles
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            ¿Necesitas asesoría personalizada?
          </h2>
          <p className="text-muted-foreground mb-6">
            Te ayudamos a elegir el producto adecuado para tu condición y objetivos.
          </p>
          <Link to="https://wa.me/56989639088?text=Hola, quiero asesoría sobre {condition.title}">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Hablar con asesor por WhatsApp
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ConditionHubPage;
