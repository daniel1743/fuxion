/**
 * Base de datos de alimentos para recomendaciones personalizadas.
 * Se seleccionan según el perfil del usuario.
 */

export const FOOD_DATABASE = {
  // ─── Proteínas ────────────────────────────────────────────────────────
  proteins: [
    { name: 'Huevo', benefits: 'Proteína completa, colina para el cerebro, vitamina D', calories: 78 },
    { name: 'Pechuga de pollo', benefits: 'Proteína magra, baja en grasa, rica en B6', calories: 165 },
    { name: 'Salmón', benefits: 'Omega-3, proteína, vitamina D, selenio', calories: 208 },
    { name: 'Sardinas', benefits: 'Omega-3, calcio (huesos), vitamina D', calories: 208 },
    { name: 'Atún', benefits: 'Proteína magra, omega-3, vitamina D', calories: 144 },
    { name: 'Lentejas', benefits: 'Hierro, fibra, proteína vegetal', calories: 230 },
    { name: 'Garbanzos', benefits: 'Proteína, fibra, folato', calories: 269 },
    { name: 'Yogurt griego', benefits: 'Probióticos, proteína, calcio', calories: 100 },
    { name: 'Quinoa', benefits: 'Proteína completa vegetal, magnesio', calories: 120 },
    { name: 'Tofu', benefits: 'Proteína vegetal, isoflavonas, calcio', calories: 76 },
  ],

  // ─── Verduras ─────────────────────────────────────────────────────────
  vegetables: [
    { name: 'Brócoli', benefits: 'Sulforafano, vitamina C, K', calories: 55 },
    { name: 'Espinaca', benefits: 'Hierro, magnesio, folato', calories: 23 },
    { name: 'Calabacín', benefits: 'Baja en calorías, vitamina C, K', calories: 17 },
    { name: 'Zanahoria', benefits: 'Betacaroteno, vitamina A', calories: 41 },
    { name: 'Tomate', benefits: 'Licopeno, vitamina C, potasio', calories: 18 },
    { name: 'Pimiento', benefits: 'Vitamina C, betacaroteno', calories: 31 },
    { name: 'Aguacate', benefits: 'Grasas monoinsaturadas, potasio, fibra', calories: 160 },
    { name: 'Cebolla', benefits: 'Quercetina, prebiótico (inulina)', calories: 40 },
    { name: 'Ajo', benefits: 'Alicina, antibacteriano, prebiótico', calories: 4 },
    { name: 'Espinaca baby', benefits: 'Hierro, magnesio, folato', calories: 23 },
  ],

  // ─── Frutas ───────────────────────────────────────────────────────────
  fruits: [
    { name: 'Kiwi', benefits: 'Vitamina C, fibra, serotonina natural', calories: 61 },
    { name: 'Arándanos', benefits: 'Antioxidantes, flavonoides, memoria', calories: 57 },
    { name: 'Plátano', benefits: 'Potasio, vitamina B6, energía rápida', calories: 89 },
    { name: 'Manzana', benefits: 'Pectina, fibra, antioxidantes', calories: 52 },
    { name: 'Naranja', benefits: 'Vitamina C, folato, flavonoides', calories: 47 },
    { name: 'Papaya', benefits: 'Papaína (digestión), vitamina C', calories: 43 },
    { name: 'Fresas', benefits: 'Vitamina C, manganeso, antioxidantes', calories: 32 },
    { name: 'Sandía', benefits: 'Hidratación, licopeno, citrulina', calories: 30 },
    { name: 'Granada', benefits: 'Antioxidantes, antiinflamatorio', calories: 83 },
    { name: 'Uvas', benefits: 'Resveratrol, vitamina K', calories: 69 },
  ],

  // ─── Grasas saludables ────────────────────────────────────────────────
  healthyFats: [
    { name: 'Aceite de oliva extra virgen', benefits: 'Polifenoles, antiinflamatorio', calories: 119 },
    { name: 'Nueces', benefits: 'Omega-3, magnesio, antioxidantes', calories: 654 },
    { name: 'Almendras', benefits: 'Vitamina E, magnesio, proteína', calories: 579 },
    { name: 'Chía', benefits: 'Omega-3, fibra, calcio', calories: 486 },
    { name: 'Semillas de lino', benefits: 'Omega-3, lignanos, fibra', calories: 534 },
    { name: 'Pistachos', benefits: 'Proteína, potasio, antioxidantes', calories: 560 },
    { name: 'Semillas de calabaza', benefits: 'Zinc, magnesio, hierro', calories: 559 },
  ],

  // ─── Alimentos a REDUCIR ──────────────────────────────────────────────
  foodsToReduce: [
    { name: 'Bebidas azucaradas', why: 'Azúcar líquida, pico de insulina, cero nutrientes' },
    { name: 'Pan blanco', why: 'Harina refinada, alto índice glucémico' },
    { name: 'Embutidos', why: 'Sodio, nitritos, grasas saturadas' },
    { name: 'Bollería industrial', why: 'Grasas trans, azúcar, aditivos' },
    { name: 'Cerveza', why: 'Calorías vacías, inflamación, hígado graso' },
    { name: 'Comida rápida', why: 'Sodio, grasas trans, calorías densas' },
  ],

  // ─── Alimentos a EVITAR ───────────────────────────────────────────────
  foodsToAvoid: [
    { name: 'Asgitamina (azúcar)', why: 'Principal causa de inflamación crónica' },
    { name: 'Grasas trans', why: 'Daño cardiovascular directo' },
    { name: 'Alcohol excesivo', why: 'Daño hepático, deshidratación, cáncer' },
    { name: 'Ultraprocesados', why: 'Aditivos, sodio, calorías vacías' },
  ],

  // ─── Ideas de desayunos ───────────────────────────────────────────────
  breakfastIdeas: [
    { name: 'Avena con frutos secos y frutas', ingredients: ['Avena', 'Leche o bebida vegetal', 'Nueces', 'Arándanos', 'Canela'], calories: 350 },
    { name: 'Yogurt con granola casera', ingredients: ['Yogurt griego', 'Granola', 'Frutos rojos', 'Chía'], calories: 300 },
    { name: 'Huevos revueltos con espinaca', ingredients: ['Huevos', 'Espinaca', 'Tomate cherry', 'Aceite de oliva'], calories: 280 },
    { name: 'Smoothie verde', ingredients: ['Espinaca', 'Plátano', 'Leche de almendras', 'Chía', 'Proteína en polvo'], calories: 320 },
    { name: 'Tostada de aguacate y huevo', ingredients: ['Pan integral', 'Aguacate', 'Huevo pochado', 'Semillas'], calories: 380 },
  ],

  // ─── Ideas de almuerzos ───────────────────────────────────────────────
  lunchIdeas: [
    { name: 'Pechuga a la plancha con quinoa', ingredients: ['Pechuga de pollo', 'Quinoa', 'Brócoli', 'Limón'], calories: 450 },
    { name: 'Salmón al horno con ensalada', ingredients: ['Salmón', 'Aguacate', 'Espinaca', 'Tomate', 'Aceite de oliva'], calories: 520 },
    { name: 'Lentejas con verduras', ingredients: ['Lentejas', 'Zanahoria', 'Cebolla', 'Pimiento', 'Tomate'], calories: 380 },
    { name: 'Ensalada César saludable', ingredients: ['Lechuga romana', 'Pollo', 'Parmesano', 'Croutons integrales'], calories: 420 },
    { name: 'Wrap de atún', ingredients: ['Tortilla integral', 'Atún', 'Lechuga', 'Tomate', 'Mayonesa ligera'], calories: 380 },
    { name: 'Pollo stir-fry con vegetales', ingredients: ['Pechuga', 'Brócoli', 'Zanahoria', 'Salsa de soja baja en sodio'], calories: 400 },
    { name: 'Sopa de verduras', ingredients: ['Calabacín', 'Zanahoria', 'Papa', 'Apio', 'Perejil'], calories: 250 },
    { name: 'Bowl de arroz y pollo', ingredients: ['Arroz integral', 'Pollo', 'Brócoli', 'Edamame', 'Sésamo'], calories: 480 },
    { name: 'Tacos de pescado', ingredients: ['Tilapia', 'Tortilla de maíz', 'Col morada', 'Limón', 'Aguacate'], calories: 350 },
    { name: 'Pasta integral con verduras', ingredients: ['Pasta integral', 'Zucchini', 'Tomate', 'Albahaca', 'Aceite de oliva'], calories: 420 },
  ],

  // ─── Ideas de cenas ───────────────────────────────────────────────────
  dinnerIdeas: [
    { name: 'Sopa de verduras', ingredients: ['Calabacín', 'Zanahoria', 'Apio', 'Tomate'], calories: 200 },
    { name: 'Pescado al vapor con ensalada', ingredients: ['Merluza', 'Espinaca', 'Tomate', 'Limón'], calories: 300 },
    { name: 'Ensalada de pollo', ingredients: ['Pechuga', 'Lechuga', 'Tomate', 'Aguacate'], calories: 350 },
    { name: 'Crema de calabaza', ingredients: ['Calabaza', 'Papa', 'Cebolla', 'Jengibre'], calories: 220 },
    { name: 'Tortilla francesa de espinaca', ingredients: ['Huevos', 'Espinaca', 'Queso fresco'], calories: 280 },
    { name: 'Salmón al horno', ingredients: ['Salmón', 'Limón', 'Eneldo', 'Espárragos'], calories: 380 },
    { name: 'Pollo al curry ligero', ingredients: ['Pechuga', 'Leche de coco', 'Curry', 'Arroz basmati'], calories: 420 },
    { name: 'Falafel con hummus', ingredients: ['Garbanzos', 'Hummus', 'Pan pita', 'Lechuga'], calories: 350 },
    { name: 'Sopa de lentejas', ingredients: ['Lentejas', 'Zanahoria', 'Apio', 'Tomate'], calories: 280 },
    { name: 'Omelette de champiñones', ingredients: ['Huevos', 'Champiñones', 'Espinaca', 'Queso'], calories: 300 },
  ],

  // ─── Snacks saludables ────────────────────────────────────────────────
  snackIdeas: [
    { name: 'Manzana con mantequilla de maní', calories: 190 },
    { name: 'Yogurt griego con frutos rojos', calories: 150 },
    { name: 'Mix de frutos secos (puñado)', calories: 170 },
    { name: 'Palitos de zanahoria con hummus', calories: 120 },
    { name: 'Huevo duro', calories: 78 },
    { name: 'Barrita de avena casera', calories: 150 },
    { name: 'Edamames al vapor', calories: 120 },
    { name: 'Plátano con canela', calories: 105 },
    { name: 'Palomitas caseras (sin mantequilla)', calories: 90 },
    { name: 'Tostada de aguacate pequeña', calories: 160 },
    { name: 'Quesillo con nueces', calories: 140 },
    { name: 'Smoothie de berries', calories: 130 },
    { name: 'Semillas de girasol', calories: 165 },
    { name: 'Cúrcuma con leche tibia', calories: 80 },
    { name: 'Gelatina sin azúcar', calories: 50 },
  ],
};

export default FOOD_DATABASE;
