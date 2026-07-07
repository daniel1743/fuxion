const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'FaqPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file ends with the broken line: placeholder="Bus
// We need to replace it with the complete component ending

const appendContent = `car preguntas frecuentes..."
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
                className={\`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border \${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground hover:shadow-sm'
                }\`}
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

export default FaqPage;`;

// Replace the broken line
const searchStr = '              placeholder="Bus';
if (content.includes(searchStr)) {
  content = content.replace(searchStr, appendContent);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('File completed successfully. Total lines:', content.split('\n').length);
} else {
  console.log('Could not find the search string. File may already be complete.');
  console.log('Last 100 chars:', content.slice(-100));
}
