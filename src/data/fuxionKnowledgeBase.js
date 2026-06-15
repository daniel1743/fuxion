import fuxionDatabase from './fuxion_database.json';

const products = Object.values(fuxionDatabase.productos || {});

export const fuxionKnowledgeBase = {
  company: {
    name: 'Tienda Fuxion Chile',
    slogan: 'Nutricion y bienestar natural con asesoria personalizada',
    description: 'Tienda de productos Fuxion Biotech para nutricion, energia, digestion, control de peso, defensas, belleza y deporte.',
    whatsapp: 'https://wa.me/56989639088',
    horarios: 'Atencion y coordinacion de pedidos por WhatsApp.',
    certifications: fuxionDatabase.empresa?.certificaciones || []
  },

  shipping: {
    proceso: 'El cliente agrega productos al carrito y envia el pedido por WhatsApp para coordinar disponibilidad, pago y despacho.',
    cobertura: 'Coordinacion personalizada segun comuna o ciudad.'
  },

  payment: {
    metodos: [
      'Transferencia bancaria',
      'Coordinacion directa por WhatsApp'
    ],
    notas: 'Los pedidos se confirman manualmente por WhatsApp.'
  },

  categories: products.reduce((acc, product) => {
    const key = product.categoria || 'Productos Fuxion';
    if (!acc[key]) {
      acc[key] = {
        nombre: key,
        descripcion: `Productos Fuxion de ${key.toLowerCase()}.`,
        productos: []
      };
    }
    acc[key].productos.push(product.nombre);
    return acc;
  }, {}),

  featuredProducts: products.slice(0, 8).map((product, index) => ({
    id: index + 1,
    name: product.nombre,
    categoria: product.categoria,
    price: product.precio,
    codigo: product.codigo,
    presentacion: product.presentacion,
    description: product.beneficios?.join('. ') || product.efecto || '',
    features: product.beneficios || [],
    beneficios: product.beneficios || [],
    ingredientes: product.ingredientes || [],
    modo_uso: product.modo_uso,
    horario: product.horario,
    fuente_precio: product.fuente_precio
  })),

  faqs: [
    {
      pregunta: 'Como puedo hacer un pedido?',
      respuesta: 'Agrega productos al carrito, completa tus datos y envia el pedido por WhatsApp. Luego se confirma disponibilidad, pago y despacho.'
    },
    {
      pregunta: 'Los productos Fuxion son medicamentos?',
      respuesta: 'No. Son alimentos nutraceuticos. No reemplazan la evaluacion medica ni tratamientos indicados por profesionales de salud.'
    },
    {
      pregunta: 'Como se toman los productos?',
      respuesta: 'La mayoria viene en sobres o sachets para mezclar con agua. Cada producto tiene modo de uso y horario sugerido en su ficha.'
    },
    {
      pregunta: 'De donde salen los precios?',
      respuesta: 'Los precios fueron cargados desde el Catalogo Chile.pdf.'
    }
  ],

  officialProducts: products
};

export default fuxionKnowledgeBase;
