import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import {
  buildProductFaqSchema,
  buildProductMetaDescription,
  buildProductSchema,
  buildProductTitle,
  getProductSeoContent,
  getSeoProductBySlug,
  SITE_URL,
  STORE_NAME
} from '@/lib/productSeo';
import { getPlaceholderImage } from '@/lib/imageUtils';
import { confirmAndOpenWhatsapp } from '@/lib/whatsapp';
import { AiRobotIcon, WhatsAppIcon } from '@/components/icons/BrandIcons';

const ProductPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const product = getSeoProductBySlug(slug);

  if (!product) {
    return (
      <main className="container mx-auto px-6 py-32">
        <Helmet>
          <title>Producto no encontrado | {STORE_NAME}</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold text-foreground">Producto no encontrado</h1>
          <p className="mt-4 text-muted-foreground">
            Este producto no esta disponible en la lista actual de productos.
          </p>
          <Button asChild className="mt-6">
            <Link to="/explorar">Ver productos Fuxion</Link>
          </Button>
        </div>
      </main>
    );
  }

  const metaDescription = buildProductMetaDescription(product);
  const seoContent = getProductSeoContent(product);
  const faqSchema = buildProductFaqSchema(product);
  const relatedProducts = (seoContent?.relatedSlugs || [])
    .map((relatedSlug) => getSeoProductBySlug(relatedSlug))
    .filter(Boolean);
  const internalLinkProducts = (seoContent?.internalLinks || [])
    .map((item) => {
      const linkedProduct = getSeoProductBySlug(item.slug);
      return linkedProduct ? { ...linkedProduct, reason: item.reason } : null;
    })
    .filter(Boolean);
  const productForCart = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    stock: 50,
    rating: 4.5,
    reviews: 120,
    description: product.description,
    categoria: product.category,
    image: product.image,
    beneficios: product.benefits,
    ingredientes: product.ingredients,
    specs: [
      { label: 'Presentacion', value: product.presentation || 'Consultar' },
      { label: 'Modo de uso', value: product.usage || 'Consultar' },
      { label: 'Horario', value: product.schedule || 'Consultar' },
      ...(product.flavor ? [{ label: 'Sabor', value: product.flavor }] : [])
    ]
  };

  const handleAskAi = () => {
    window.dispatchEvent(new CustomEvent('fuxion:open-product-ai', {
      detail: {
        product: {
          ...productForCart,
          category: product.category,
          presentation: product.presentation,
          usage: product.usage,
          schedule: product.schedule,
          benefits: product.benefits,
          ingredients: product.ingredients
        }
      }
    }));
  };

  const handleProductWhatsapp = () => {
    confirmAndOpenWhatsapp(`Hola, quiero hablar con un asesor sobre ${product.name}.`);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-6 py-28"
    >
      <Helmet>
        <title>{buildProductTitle(product)}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={product.url} />

        <meta property="og:type" content="product" />
        <meta property="og:url" content={product.url} />
        <meta property="og:title" content={buildProductTitle(product)} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={product.imageUrl} />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="CLP" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={buildProductTitle(product)} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={product.imageUrl} />

        <script type="application/ld+json">
          {JSON.stringify(buildProductSchema(product))}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <Link to="/explorar" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="h-4 w-4" />
        Volver a productos
      </Link>

      <section className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 items-start">
        <div className="bg-secondary rounded-2xl overflow-hidden border border-border">
          <img
            src={product.image || getPlaceholderImage('product')}
            alt={`${product.name} Fuxion producto nutraceutico`}
            className="w-full aspect-square object-cover"
            onError={(event) => {
              event.currentTarget.src = getPlaceholderImage('product');
            }}
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">
            {product.category}
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-foreground">
            {product.name} Fuxion
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            {seoContent?.intro || metaDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-4xl font-bold text-primary">
              ${product.price.toLocaleString('es-CL')}
            </span>
            <span className="text-sm text-muted-foreground">
              Producto Fuxion disponible para pedido y asesoria.
            </span>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Presentacion</p>
              <p className="font-semibold text-foreground">{product.presentation || 'Consultar'}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Modo de uso</p>
              <p className="font-semibold text-foreground">{product.usage || 'Consultar'}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Horario sugerido</p>
              <p className="font-semibold text-foreground">{product.schedule || 'Consultar'}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Linea</p>
              <p className="font-semibold text-foreground">{product.line || 'Fuxion Biotech'}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => addToCart(productForCart)}
              className="h-12 px-6 gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Agregar al carrito
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleAskAi}
              className="h-12 px-5 gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white"
            >
              <AiRobotIcon className="h-4 w-4" />
              Consultar con IA
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleProductWhatsapp}
              className="h-12 px-5 gap-2 border-green-200 text-green-700 hover:bg-green-600 hover:text-white"
              title="Hablar con asesor"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Asesor
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-14 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Beneficios de {product.name}
          </h2>
          <div className="mt-5 space-y-3">
            {product.benefits.map((benefit) => (
              <div key={benefit} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Ingredientes y enfoque natural
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {product.name} forma parte del listado Fuxion de nutricion y bienestar. Su informacion se presenta con enfoque educativo y de asesoria comercial.
          </p>
          {product.ingredients.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.ingredients.map((ingredient) => (
                <span key={ingredient} className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
                  {ingredient}
                </span>
              ))}
            </div>
          )}
          <p className="mt-6 text-sm text-muted-foreground">
            No somos medicos ni reemplazamos la evaluacion profesional. Si tienes una condicion de salud, embarazo, lactancia o tomas medicamentos, consulta con un profesional de salud.
          </p>
        </div>
      </section>
      {seoContent && (
        <section className="mt-14 rounded-3xl border border-primary/15 bg-primary/5 p-6 md:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Guía de compra y uso
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground">
              {seoContent.seoHeading}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Esta guía resume lo más importante antes de comprar {product.name} en Chile: para qué se usa, cómo integrarlo a una rutina real y cuándo pedir asesoría.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {seoContent.searchIntent.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}


      {seoContent?.deepSections?.length > 0 && (
        <section className="mt-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Guía ampliada
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground">
              Cómo evaluar {product.name} antes de comprar
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Estos puntos ayudan a comparar ingredientes, uso real, combinaciones y precauciones sin convertir el producto en una promesa médica.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {seoContent.deepSections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-lg font-bold text-foreground">{section.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {seoContent?.semanticTerms?.length > 0 && (
        <section className="mt-14 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-bold text-foreground">
            Temas relacionados con {product.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Estos conceptos ayudan a entender mejor el contexto del producto y a compararlo con otras opciones del catálogo Fuxion.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {seoContent.semanticTerms.map((term) => (
              <span key={term} className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
                {term}
              </span>
            ))}
          </div>
        </section>
      )}

      {internalLinkProducts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-3xl font-extrabold text-foreground">
            Cómo combinar o comparar {product.name}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {internalLinkProducts.map((linkedProduct) => (
              <Link
                key={linkedProduct.slug}
                to={`/producto/${linkedProduct.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <h3 className="font-bold text-foreground group-hover:text-primary">
                  {linkedProduct.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{linkedProduct.reason}</p>
                <p className="mt-4 text-sm font-semibold text-primary">Ver ficha de producto</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {seoContent?.faqs?.length > 0 && (
        <section className="mt-14">
          <h2 className="text-3xl font-extrabold text-foreground">
            Preguntas frecuentes sobre {product.name}
          </h2>
          <div className="mt-6 grid gap-4">
            {seoContent.faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-lg font-bold text-foreground">{faq.question}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-3xl font-extrabold text-foreground">
            Productos relacionados que también puedes revisar
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.slug}
                to={`/producto/${relatedProduct.slug}`}
                className="group rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <img
                  src={relatedProduct.image || getPlaceholderImage('product')}
                  alt={`${relatedProduct.name} Fuxion`}
                  className="h-32 w-full rounded-xl object-cover"
                  onError={(event) => {
                    event.currentTarget.src = getPlaceholderImage('product');
                  }}
                />
                <h3 className="mt-4 font-bold text-foreground group-hover:text-primary">
                  {relatedProduct.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{relatedProduct.category}</p>
                <p className="mt-2 font-bold text-primary">
                  ${relatedProduct.price.toLocaleString('es-CL')}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.main>
  );
};

export default ProductPage;



