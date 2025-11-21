// Base de Conocimiento de Fuxion Shop
// Esta base de datos contiene información completa sobre productos, políticas y servicios

export const fuxionKnowledgeBase = {
  // Información de la empresa
  company: {
    name: "Fuxion Shop",
    slogan: "Gadgets del Futuro",
    description: "Tienda especializada en tecnología de vanguardia y gadgets innovadores",
    whatsapp: "https://wa.me/56989639088",
    email: "soporte@fuxionshop.com",
    horarios: "Lunes a Viernes: 9:00 AM - 6:00 PM, Sábados: 10:00 AM - 2:00 PM",
  },

  // Políticas de envío
  shipping: {
    envioGratis: {
      condicion: "Compras superiores a $50",
      tiempo: "2-3 días hábiles",
      cobertura: "Nacional"
    },
    envioRegular: {
      costo: "$5.00",
      tiempo: "3-5 días hábiles"
    },
    envioExpress: {
      costo: "$15.00",
      tiempo: "24 horas"
    }
  },

  // Políticas de devolución
  returns: {
    plazo: "30 días",
    condiciones: [
      "Producto sin usar",
      "Empaque original",
      "Factura de compra"
    ],
    proceso: "Contactar por WhatsApp para iniciar devolución"
  },

  // Métodos de pago
  payment: {
    metodos: [
      "Transferencia bancaria",
      "PayPal",
      "Tarjetas de crédito/débito",
      "Pago contra entrega (disponible en algunas zonas)"
    ],
    notas: "Todos los pedidos se procesan manualmente a través de WhatsApp"
  },

  // Garantías
  warranty: {
    duracion: "1 año",
    cobertura: "Defectos de fabricación",
    exclusiones: ["Daño por mal uso", "Daño por agua", "Modificaciones no autorizadas"]
  },

  // Categorías de productos
  categories: {
    computacion: {
      nombre: "Computación",
      descripcion: "Laptops, tablets y accesorios de alto rendimiento",
      productos: ["Quantum Laptop Pro", "Ultra Tablet X1"]
    },
    audioVideo: {
      nombre: "Audio y Video",
      descripcion: "Proyectores, auriculares y sistemas de sonido",
      productos: ["Holo-Projector 360", "Auriculares Noise Pro", "Webcam 4K Ultra"]
    },
    robotica: {
      nombre: "Robótica",
      descripcion: "Dispositivos robóticos y automatización",
      productos: ["Cybernetic Arm Pro"]
    },
    hogar: {
      nombre: "Hogar Inteligente",
      descripcion: "Dispositivos IoT para automatización del hogar",
      productos: ["Smart Plant Pot AI", "Termostato Inteligente Eco", "Cámara de Seguridad AI"]
    },
    gaming: {
      nombre: "Gaming",
      descripcion: "Accesorios y periféricos para gamers",
      productos: ["Teclado Mecánico RGB Pro", "Mouse Gaming Precision", "Silla Gaming Ergonómica"]
    },
    realidadVirtual: {
      nombre: "Realidad Virtual",
      descripcion: "Dispositivos de VR y AR",
      productos: ["VR Goggles X Pro"]
    },
    drones: {
      nombre: "Drones",
      descripcion: "Drones de última generación",
      productos: ["Drone 4K Pro", "Mini Drone Stealth"]
    },
    wearables: {
      nombre: "Wearables",
      descripcion: "Smartwatches y dispositivos ponibles",
      productos: ["Smartwatch Ultra Fitness", "Reloj Inteligente Elegance"]
    }
  },

  // Productos destacados con información detallada
  featuredProducts: [
    {
      id: 1,
      name: "Quantum Laptop Pro",
      categoria: "Computación",
      precio: 1999.99,
      descuento: 10,
      precioFinal: 1799.99,
      stock: 15,
      caracteristicas: [
        "Procesador Quantum Core i9 de última generación",
        "32GB RAM DDR5 para multitarea extrema",
        "1TB SSD NVMe - velocidad ultrarrápida",
        "Pantalla 15.6\" 4K OLED con colores vibrantes",
        "GPU dedicada para gaming y diseño",
        "Batería de 12 horas de duración",
        "Puerto Thunderbolt 4, USB-C y HDMI 2.1"
      ],
      usos: ["Edición de video profesional", "Gaming de alta gama", "Programación", "Diseño gráfico"],
      garantia: "1 año",
      incluye: ["Laptop", "Cargador", "Manual", "Software de productividad"]
    },
    {
      id: 5,
      name: "VR Goggles X Pro",
      categoria: "Realidad Virtual",
      precio: 499.99,
      descuento: 20,
      precioFinal: 399.99,
      stock: 22,
      caracteristicas: [
        "Resolución 4K por ojo",
        "Frecuencia de actualización 120Hz",
        "Seguimiento ocular avanzado",
        "Audio espacial 3D integrado",
        "Campo de visión 120 grados",
        "6 grados de libertad (6DoF)",
        "Compatible con PC y consolas"
      ],
      usos: ["Gaming inmersivo", "Simulaciones", "Entretenimiento", "Educación virtual"],
      garantia: "1 año",
      incluye: ["Gafas VR", "Controladores", "Cable de conexión", "Almohadilla facial extra"]
    },
    {
      id: 8,
      name: "Smartwatch Ultra Fitness",
      categoria: "Wearables",
      precio: 299.99,
      stock: 50,
      caracteristicas: [
        "Monitoreo cardíaco 24/7",
        "GPS integrado",
        "Resistente al agua 50m",
        "Batería de 7 días",
        "Pantalla AMOLED táctil",
        "Más de 100 modos deportivos",
        "Análisis de sueño avanzado"
      ],
      usos: ["Fitness tracking", "Natación", "Running", "Ciclismo", "Monitoreo de salud"],
      garantia: "1 año",
      incluye: ["Smartwatch", "Correa deportiva", "Cargador magnético", "Manual"]
    }
  ],

  // FAQs
  faqs: [
    {
      pregunta: "¿Cómo puedo hacer un pedido?",
      respuesta: "Agrega productos al carrito, llena tus datos y haz clic en 'Enviar Pedido por WhatsApp'. Te contactaremos para confirmar tu pedido."
    },
    {
      pregunta: "¿Cuánto tiempo tarda el envío?",
      respuesta: "El envío regular tarda 2-3 días hábiles. Ofrecemos envío gratis en compras superiores a $50."
    },
    {
      pregunta: "¿Puedo devolver un producto?",
      respuesta: "Sí, aceptamos devoluciones dentro de 30 días si el producto está sin usar y en su empaque original."
    },
    {
      pregunta: "¿Los productos tienen garantía?",
      respuesta: "Todos nuestros productos tienen garantía de 1 año contra defectos de fabricación."
    },
    {
      pregunta: "¿Qué métodos de pago aceptan?",
      respuesta: "Aceptamos transferencia bancaria, PayPal, tarjetas de crédito/débito y pago contra entrega en algunas zonas."
    },
    {
      pregunta: "¿Tienen tienda física?",
      respuesta: "Actualmente operamos solo online. Todos los pedidos se gestionan por WhatsApp para brindarte mejor atención personalizada."
    },
    {
      pregunta: "¿Los precios incluyen impuestos?",
      respuesta: "Sí, todos los precios mostrados incluyen impuestos."
    },
    {
      pregunta: "¿Puedo rastrear mi pedido?",
      respuesta: "Sí, una vez confirmado tu pedido te enviaremos un número de rastreo por WhatsApp."
    },
    {
      pregunta: "¿Hacen envíos internacionales?",
      respuesta: "Actualmente solo realizamos envíos nacionales. Contacta por WhatsApp para consultas internacionales."
    },
    {
      pregunta: "¿Qué hago si mi producto llega defectuoso?",
      respuesta: "Contacta inmediatamente por WhatsApp con fotos del defecto. Procesaremos el reemplazo o reembolso según corresponda."
    }
  ],

  // Promociones actuales
  promotions: [
    {
      nombre: "Descuento de Lanzamiento",
      descripcion: "Hasta 20% de descuento en productos seleccionados",
      productos: ["VR Goggles X Pro", "Cybernetic Arm Pro", "Auriculares Noise Pro"],
      vigencia: "Válido hasta fin de mes"
    },
    {
      nombre: "Envío Gratis",
      descripcion: "Envío gratis en compras superiores a $50",
      aplicaA: "Todos los productos",
      vigencia: "Permanente"
    },
    {
      nombre: "Combo Tech",
      descripcion: "Compra laptop + mouse gaming y obtén 15% descuento adicional",
      vigencia: "Stock limitado"
    }
  ],

  // Consejos de compra
  buyingGuide: {
    laptops: "Para gaming elige modelos con GPU dedicada. Para trabajo de oficina, prioriza RAM y SSD.",
    vr: "Verifica compatibilidad con tu PC/consola. Para uso intenso, elige modelos con mejor refrigeración.",
    smartwatches: "Si haces natación, verifica resistencia al agua. Para runners, GPS integrado es esencial.",
    drones: "Principiantes: mini drones. Profesionales: modelos 4K con gimbal estabilizado.",
    audio: "Cancelación de ruido activa para viajes. Drivers grandes para mejor bass."
  },

  // Comparaciones de productos
  comparisons: {
    laptopsVsTablets: "Laptops para trabajo pesado y multitarea. Tablets para portabilidad y consumo de contenido.",
    vrBasicVsPro: "VR básico para casual gaming. VR Pro para experiencias inmersivas profesionales.",
    smartwatchBasicVsUltra: "Basic para notificaciones básicas. Ultra para fitness tracking avanzado y GPS."
  }
};

export default fuxionKnowledgeBase;
