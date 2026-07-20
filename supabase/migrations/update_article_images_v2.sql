-- Corrige image_url en blog_posts usando los slugs reales de insert_ALL_articles_1_to_20.sql
-- (La migración update_article_images.sql original usaba slugs que no coinciden con la BD)
-- Ejecutar UNA SOLA VEZ si los artículos aún muestran imagen genérica de verduras Unsplash

UPDATE public.blog_posts SET image_url = '/images/articles-webp/Disbiosis.webp' WHERE slug = 'disbiosis-intestinal-desequilibrio-del-microbioma-y-su-relaci-n-con-la-inflamaci-n-sist-mica';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/factores-modulares.webp' WHERE slug = 'permeabilidad-intestinal-leaky-gut-m-s-all-del-mito';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/sindrome-intestino-irritable.webp' WHERE slug = 's-ndrome-del-intestino-irritable-sii-eje-intestino-cerebro-y-alteraciones-de-la-motilidad';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/sibo.webp' WHERE slug = 'sibo-sobrecrecimiento-bacteriano-del-intestino-delgado-migraci-n-microbiana-fermentaci-n-prematura-y-diagn-stico';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/eje-intestino-cerebro.webp' WHERE slug = 'eje-intestino-cerebro-v-as-de-comunicaci-n-bidireccional-y-neurotransmisores-ent-ricos';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/higado-graso-hgna.webp' WHERE slug = 'h-gado-graso-no-alcoh-lico-hgna-acumulaci-n-lip-dica-estr-s-oxidativo-y-el-rol-del-intestino';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/reflujo-gastroesofagico-erge.webp' WHERE slug = 'reflujo-gastroesof-gico-erge-cuando-el-esf-nter-esof-gico-inferior-no-cierra';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/celiaquia-vs-sensibilidad-gluten.webp' WHERE slug = 'celiaqu-a-vs-sensibilidad-al-gluten-no-cel-aca-diferencias-en-autoinmunidad-e-inflamaci-n';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/digestion-enzimatica-exocrina.webp' WHERE slug = 'digesti-n-enzim-tica-exocrina-c-mo-el-p-ncreas-descompone-los-macronutrientes-que-comes';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/fibra-soluble-vs-insoluble.webp' WHERE slug = 'fibra-soluble-vs-insoluble-impacto-en-la-motilidad-y-modulaci-n-del-microbioma';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/acidos-grasos-cadena-corta-butirato.webp' WHERE slug = '-cidos-grasos-de-cadena-corta-butirato-el-combustible-del-epitelio-col-nico';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/estrenimiento-cronico.webp' WHERE slug = 'estre-imiento-funcional-cr-nico-causas-subyacentes-y-estrategias-de-manejo-basadas-en-evidencia';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/metabolismo-acidos-biliares.webp' WHERE slug = 'metabolismo-de-los-cidos-biliares-digesti-n-de-grasas-y-circulaci-n-enterohep-tica';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/helicobacter-pylori.webp' WHERE slug = 'infecci-n-por-helicobacter-pylori-del-diagn-stico-a-la-erradicaci-n';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/eje-intestino-higado.webp' WHERE slug = 'eje-intestino-h-gado-comunicaci-n-bidireccional-y-su-implicaci-n-en-la-salud-metab-lica';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/intolerancia-a-la-lactosa.webp' WHERE slug = 'intolerancia-a-la-lactosa-gen-tica-vs-adquirida-causas-diagn-stico-y-manejo-nutricional';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/alergias-alimentarias-ige.webp' WHERE slug = 'alergias-alimentarias-y-respuesta-ige-cuando-el-sistema-inmune-reacciona-a-las-prote-nas-de-los-alimentos';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/histaminosis-enterica.webp' WHERE slug = 'histaminosis-ent-rica-cuando-el-intestino-no-degrada-la-histamina';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/funcion-moco-gastrico.webp' WHERE slug = 'funci-n-del-moco-g-strico-y-su-rol-en-la-protecci-n-de-la-mucosa';
UPDATE public.blog_posts SET image_url = '/images/articles-webp/transito-intestinal-acelerado-principal.webp' WHERE slug = 'tr-nsito-intestinal-acelerado-causas-consecuencias-y-regulaci-n-del-ritmo-digestivo';

-- Verificar que ya no queden imágenes de Unsplash
-- SELECT slug, image_url FROM public.blog_posts WHERE image_url LIKE '%unsplash%';