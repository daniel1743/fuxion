import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { buildPersonSchema } from '@/lib/productSeo';

const AboutPage = () => {
  const schema = buildPersonSchema();

  return (
    <div className="min-h-screen bg-slate-50 py-16 dark:bg-background">
      <SEO 
        title="Sobre mí | Daniel Falcón - Bienestar en Claro"
        description="Conoce a Daniel Falcón, Investigador de Salud y Bienestar. Descubre la misión detrás de Bienestar en Claro y nuestra rigurosa metodología editorial."
        canonical="https://bienestarenclaro.com/sobre-nosotros"
        structuredData={schema}
      />

      <div className="container mx-auto max-w-3xl px-4 mt-8 md:mt-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-500 dark:text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">
            Inicio
          </Link>{' '}
          &gt; Sobre mí
        </nav>

        {/* Profile Card */}
        <section className="mb-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-border dark:bg-card">
          <div className="flex flex-col md:flex-row items-center md:items-start p-8 gap-8">
            <div className="flex-shrink-0">
              <img
                src="/images/DANIEL_FALCON.jpeg"
                alt="Daniel Falcón"
                className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-slate-100 object-cover shadow-md dark:border-slate-800"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground">
                Daniel Falcón
              </h1>
              <p className="mt-2 text-lg font-medium text-emerald-700 dark:text-primary">
                Investigador de Salud y Bienestar
              </p>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-muted-foreground">
                Mi misión es traducir la complejidad de la ciencia médica y el metabolismo humano en 
                guías prácticas, claras y sin alarmismos para que puedas tomar el control de tu salud.
              </p>
            </div>
          </div>
        </section>

        {/* The Mission */}
        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            La misión detrás de Bienestar en Claro
          </h2>
          <div className="prose prose-slate max-w-none leading-loose dark:prose-invert">
            <p>
              En la era de la información, existe demasiada desinformación sobre el metabolismo, el hígado 
              graso, la resistencia a la insulina y el impacto del estrés en nuestro cuerpo. A menudo, 
              nos encontramos con dietas extremas o consejos médicos poco fundamentados.
            </p>
            <p>
              <strong>Bienestar en Claro nace como un refugio de información basada en evidencia.</strong> 
              Nuestro objetivo es diseñar un espacio donde la ciencia se explica de manera sencilla, 
              enfocándonos no solo en explicar qué ocurre en el cuerpo, sino en ofrecer herramientas realistas 
              y sostenibles para solucionarlo.
            </p>
          </div>
        </section>

        {/* E-E-A-T Signals */}
        <section className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
            <div className="mb-4 text-emerald-600 dark:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-foreground">Investigación Rigurosa</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-muted-foreground">
              Cada artículo publicado atraviesa un riguroso proceso de investigación y es respaldado 
              exclusivamente por literatura y consensos científicos actuales.
            </p>
          </div>
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
            <div className="mb-4 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-foreground">Enfoque Práctico</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-muted-foreground">
              No creemos en soluciones mágicas ni en restricciones extremas. Proponemos ajustes metabólicos 
              y hábitos sostenibles que se adaptan a la vida real.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-2xl bg-slate-100 p-6 dark:bg-slate-800/50">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Descargo de Responsabilidad Médica
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-muted-foreground">
            Los artículos en este sitio tienen un propósito puramente informativo y educativo. 
            <strong> Ningún contenido sustituye el diagnóstico, tratamiento o consejo médico profesional. </strong> 
            Siempre consulte a su médico o especialista antes de realizar cambios significativos en su 
            salud, dieta o estilo de vida.
          </p>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
