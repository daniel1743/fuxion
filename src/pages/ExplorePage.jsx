
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import ProductModal from '@/components/ProductModal';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const mockProducts = [
  {
    id: 1,
    name: 'Quantum Laptop Pro',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    slug: 'quantum-laptop-pro',
    price: 1999.99,
    stock: 15,
    rating: 4.8,
    reviews: 234,
    discount: 10,
    description: 'Laptop de última generación con procesador cuántico, 32GB RAM y GPU dedicada para profesionales.',
    specs: [
      { label: 'Procesador', value: 'Quantum Core i9' },
      { label: 'RAM', value: '32GB DDR5' },
      { label: 'Almacenamiento', value: '1TB SSD NVMe' },
      { label: 'Pantalla', value: '15.6" 4K OLED' }
    ]
  },
  {
    id: 2,
    name: 'Holo-Projector 360',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620',
    slug: 'holo-projector',
    price: 899.99,
    stock: 8,
    rating: 4.6,
    reviews: 156,
    description: 'Proyector holográfico de 360 grados con resolución 4K y sistema de sonido envolvente integrado.',
    specs: [
      { label: 'Resolución', value: '4K Ultra HD' },
      { label: 'Proyección', value: '360° Holográfica' },
      { label: 'Conectividad', value: 'WiFi 6, Bluetooth 5.2' },
      { label: 'Batería', value: '6 horas' }
    ]
  },
  {
    id: 3,
    name: 'Cybernetic Arm Pro',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a',
    slug: 'cybernetic-arm',
    price: 3500.00,
    stock: 3,
    rating: 5.0,
    reviews: 89,
    discount: 15,
    description: 'Brazo robótico avanzado con sensores táctiles, control neural y 20 puntos de articulación.',
    specs: [
      { label: 'Material', value: 'Titanio reforzado' },
      { label: 'Puntos de articulación', value: '20' },
      { label: 'Fuerza máxima', value: '150 kg' },
      { label: 'Batería', value: '24 horas' }
    ]
  },
  {
    id: 4,
    name: 'Smart Plant Pot AI',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
    slug: 'smart-plant-pot',
    price: 129.99,
    stock: 45,
    rating: 4.4,
    reviews: 312,
    description: 'Maceta inteligente con IA que monitorea humedad, luz y nutrientes. Riego automático incluido.',
    specs: [
      { label: 'Capacidad', value: '3 litros' },
      { label: 'Sensores', value: 'Humedad, Luz, pH' },
      { label: 'Autonomía', value: '30 días' },
      { label: 'Material', value: 'Cerámica biodegradable' }
    ]
  },
  {
    id: 5,
    name: 'VR Goggles X Pro',
    image: 'https://images.unsplash.com/photo-1617802690658-1173a812650d',
    slug: 'vr-goggles-x',
    price: 499.99,
    stock: 22,
    rating: 4.7,
    reviews: 445,
    discount: 20,
    description: 'Gafas de realidad virtual de última generación con seguimiento ocular y audio espacial 3D.',
    specs: [
      { label: 'Resolución', value: '4K por ojo' },
      { label: 'Frecuencia', value: '120Hz' },
      { label: 'Campo de visión', value: '120°' },
      { label: 'Peso', value: '380g' }
    ]
  },
  {
    id: 6,
    name: 'Drone Companion AI',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f',
    slug: 'drone-companion',
    price: 750.00,
    stock: 12,
    rating: 4.5,
    reviews: 198,
    description: 'Drone compañero con IA que te sigue automáticamente. Perfecto para vlogging y fotografía aérea.',
    specs: [
      { label: 'Cámara', value: '4K 60fps' },
      { label: 'Autonomía', value: '45 minutos' },
      { label: 'Alcance', value: '7 km' },
      { label: 'Peso', value: '249g' }
    ]
  },
  {
    id: 7,
    name: 'Smart RGB Lamp Pro',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
    slug: 'smart-rgb-lamp',
    price: 89.99,
    stock: 67,
    rating: 4.3,
    reviews: 523,
    description: 'Lámpara inteligente con 16 millones de colores, control por voz y sincronización con música.',
    specs: [
      { label: 'Colores', value: '16 millones' },
      { label: 'Potencia', value: '15W LED' },
      { label: 'Conectividad', value: 'WiFi, Bluetooth' },
      { label: 'Vida útil', value: '50,000 horas' }
    ]
  },
  {
    id: 8,
    name: 'Gaming Keyboard Pro Max',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212',
    slug: 'gaming-keyboard-pro',
    price: 149.99,
    stock: 34,
    rating: 4.9,
    reviews: 678,
    discount: 5,
    description: 'Teclado mecánico gaming con switches personalizables, RGB por tecla y reposamuñecas magnético.',
    specs: [
      { label: 'Switches', value: 'Mecánicos personalizables' },
      { label: 'RGB', value: 'Por tecla programable' },
      { label: 'Conectividad', value: 'USB-C + Wireless' },
      { label: 'Teclas', value: '104 + multimedia' }
    ]
  },
  {
    id: 9,
    name: 'Wireless Earbuds Elite',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
    slug: 'wireless-earbuds-elite',
    price: 199.99,
    stock: 56,
    rating: 4.7,
    reviews: 892,
    description: 'Audífonos inalámbricos con cancelación de ruido activa, audio Hi-Fi y 30 horas de batería.',
    specs: [
      { label: 'Batería', value: '30 horas totales' },
      { label: 'Driver', value: '11mm dinámico' },
      { label: 'ANC', value: 'Hasta -40dB' },
      { label: 'Certificación', value: 'IPX7' }
    ]
  },
  {
    id: 10,
    name: 'Smartwatch Fusion',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    slug: 'smartwatch-fusion',
    price: 349.99,
    stock: 28,
    rating: 4.6,
    reviews: 445,
    discount: 12,
    description: 'Reloj inteligente con monitoreo de salud 24/7, GPS integrado y pantalla AMOLED siempre activa.',
    specs: [
      { label: 'Pantalla', value: '1.4" AMOLED' },
      { label: 'Batería', value: '7 días' },
      { label: 'Sensores', value: 'FC, SpO2, ECG' },
      { label: 'Resistencia', value: '5ATM' }
    ]
  },
  {
    id: 11,
    name: 'Portable SSD Ultra',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b',
    slug: 'portable-ssd-ultra',
    price: 179.99,
    stock: 41,
    rating: 4.8,
    reviews: 234,
    description: 'SSD portátil de 2TB con velocidades de hasta 1050 MB/s y resistencia IP67.',
    specs: [
      { label: 'Capacidad', value: '2TB' },
      { label: 'Velocidad lectura', value: '1050 MB/s' },
      { label: 'Velocidad escritura', value: '1000 MB/s' },
      { label: 'Conectividad', value: 'USB-C 3.2 Gen 2' }
    ]
  },
  {
    id: 12,
    name: 'Mechanical Mouse Pro',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    slug: 'mechanical-mouse-pro',
    price: 79.99,
    stock: 63,
    rating: 4.5,
    reviews: 567,
    description: 'Mouse gaming ultra ligero con sensor óptico de 25,000 DPI y switches mecánicos de 80M clicks.',
    specs: [
      { label: 'Sensor', value: '25,000 DPI' },
      { label: 'Peso', value: '59g' },
      { label: 'Batería', value: '70 horas' },
      { label: 'Conectividad', value: 'Wireless 2.4GHz' }
    ]
  },
  {
    id: 13,
    name: 'Ultra Monitor 4K',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
    slug: 'ultra-monitor-4k',
    price: 599.99,
    stock: 18,
    rating: 4.9,
    reviews: 312,
    discount: 18,
    description: 'Monitor gaming 32" 4K con 144Hz, HDR1000 y tiempo de respuesta de 1ms.',
    specs: [
      { label: 'Tamaño', value: '32" 4K UHD' },
      { label: 'Frecuencia', value: '144Hz' },
      { label: 'Tiempo respuesta', value: '1ms GTG' },
      { label: 'Panel', value: 'IPS Quantum Dot' }
    ]
  },
  {
    id: 14,
    name: 'Webcam 4K Pro',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
    slug: 'webcam-4k-pro',
    price: 129.99,
    stock: 52,
    rating: 4.4,
    reviews: 445,
    description: 'Cámara web 4K con enfoque automático, HDR y micrófono dual con cancelación de ruido.',
    specs: [
      { label: 'Resolución', value: '4K 30fps / 1080p 60fps' },
      { label: 'Campo de visión', value: '90°' },
      { label: 'Enfoque', value: 'Automático' },
      { label: 'Micrófono', value: 'Dual con ANC' }
    ]
  },
  {
    id: 15,
    name: 'USB-C Hub Ultimate',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f',
    slug: 'usb-c-hub-ultimate',
    price: 59.99,
    stock: 78,
    rating: 4.6,
    reviews: 789,
    description: 'Hub USB-C 11 en 1 con HDMI 4K, puertos USB 3.0, lector SD y carga PD de 100W.',
    specs: [
      { label: 'Puertos', value: '11 en 1' },
      { label: 'HDMI', value: '4K 60Hz' },
      { label: 'USB', value: '3x USB 3.0 5Gbps' },
      { label: 'Carga', value: 'PD 100W' }
    ]
  },
  {
    id: 16,
    name: 'Gaming Chair Elite',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6',
    slug: 'gaming-chair-elite',
    price: 399.99,
    stock: 14,
    rating: 4.8,
    reviews: 234,
    discount: 25,
    description: 'Silla gaming ergonómica con soporte lumbar ajustable, reposabrazos 4D y reclinación 180°.',
    specs: [
      { label: 'Material', value: 'Cuero PU premium' },
      { label: 'Peso máximo', value: '150 kg' },
      { label: 'Reclinación', value: '90°-180°' },
      { label: 'Garantía', value: '3 años' }
    ]
  },
  {
    id: 17,
    name: 'Tablet Pro 12.9"',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    slug: 'tablet-pro-129',
    price: 1099.99,
    stock: 25,
    rating: 4.9,
    reviews: 567,
    description: 'Tablet profesional con pantalla Liquid Retina XDR, chip M2 y compatibilidad con Apple Pencil.',
    specs: [
      { label: 'Pantalla', value: '12.9" Liquid Retina XDR' },
      { label: 'Procesador', value: 'M2 chip' },
      { label: 'Almacenamiento', value: '256GB' },
      { label: 'Batería', value: '10 horas' }
    ]
  },
  {
    id: 18,
    name: 'Microphone Studio XLR',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
    slug: 'microphone-studio-xlr',
    price: 249.99,
    stock: 31,
    rating: 4.7,
    reviews: 312,
    discount: 10,
    description: 'Micrófono de condensador XLR profesional con patrón polar cardioide y soporte anti-vibración.',
    specs: [
      { label: 'Tipo', value: 'Condensador XLR' },
      { label: 'Patrón polar', value: 'Cardioide' },
      { label: 'Frecuencia', value: '20Hz - 20kHz' },
      { label: 'SPL máximo', value: '134dB' }
    ]
  },
  {
    id: 19,
    name: 'Mechanical Numpad RGB',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    slug: 'mechanical-numpad-rgb',
    price: 49.99,
    stock: 89,
    rating: 4.3,
    reviews: 445,
    description: 'Teclado numérico mecánico con switches hot-swap, RGB y cable USB-C desmontable.',
    specs: [
      { label: 'Teclas', value: '21 mecánicas' },
      { label: 'Switches', value: 'Hot-swappable' },
      { label: 'RGB', value: 'Por tecla' },
      { label: 'Conectividad', value: 'USB-C' }
    ]
  },
  {
    id: 20,
    name: 'Portable Charger 30000mAh',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5',
    slug: 'portable-charger-30000',
    price: 69.99,
    stock: 93,
    rating: 4.5,
    reviews: 1234,
    description: 'Power bank de 30000mAh con carga rápida PD 65W, 3 puertos y pantalla LED.',
    specs: [
      { label: 'Capacidad', value: '30000mAh' },
      { label: 'Potencia máxima', value: '65W PD' },
      { label: 'Puertos', value: '2x USB-C, 1x USB-A' },
      { label: 'Pantalla', value: 'LED digital' }
    ]
  },
  {
    id: 21,
    name: 'LED Strip Smart 5m',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    slug: 'led-strip-smart-5m',
    price: 39.99,
    stock: 145,
    rating: 4.4,
    reviews: 678,
    description: 'Tira LED inteligente de 5m con sincronización de música y control por app.',
    specs: [
      { label: 'Longitud', value: '5 metros' },
      { label: 'LEDs', value: '300 (60/m)' },
      { label: 'Colores', value: 'RGB 16M' },
      { label: 'Control', value: 'App + Voz' }
    ]
  },
  {
    id: 22,
    name: 'Ring Light Pro 18"',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4',
    slug: 'ring-light-pro-18',
    price: 119.99,
    stock: 37,
    rating: 4.6,
    reviews: 523,
    description: 'Aro de luz LED de 18" con trípode, control remoto y temperatura de color ajustable.',
    specs: [
      { label: 'Diámetro', value: '18" (46cm)' },
      { label: 'Potencia', value: '55W' },
      { label: 'Temperatura', value: '3000K-6000K' },
      { label: 'Brillo', value: '1%-100% dimmer' }
    ]
  },
  {
    id: 23,
    name: 'Action Camera 5.3K',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
    slug: 'action-camera-53k',
    price: 449.99,
    stock: 19,
    rating: 4.8,
    reviews: 345,
    discount: 15,
    description: 'Cámara de acción 5.3K con estabilización HyperSmooth y resistencia al agua hasta 10m.',
    specs: [
      { label: 'Video', value: '5.3K 60fps' },
      { label: 'Foto', value: '27MP' },
      { label: 'Estabilización', value: 'HyperSmooth 5.0' },
      { label: 'Resistencia', value: '10m sin carcasa' }
    ]
  },
  {
    id: 24,
    name: 'Wireless Charging Pad',
    image: 'https://images.unsplash.com/photo-1591290619762-d99844e03d29',
    slug: 'wireless-charging-pad',
    price: 34.99,
    stock: 167,
    rating: 4.2,
    reviews: 892,
    description: 'Base de carga inalámbrica Qi de 15W con detección inteligente y protección contra sobrecalentamiento.',
    specs: [
      { label: 'Potencia', value: '15W máx' },
      { label: 'Compatibilidad', value: 'Qi universal' },
      { label: 'LED', value: 'Indicador discreto' },
      { label: 'Seguridad', value: 'Anti-sobrecalentamiento' }
    ]
  },
  {
    id: 25,
    name: 'Bluetooth Speaker 360°',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    slug: 'bluetooth-speaker-360',
    price: 89.99,
    stock: 54,
    rating: 4.5,
    reviews: 445,
    description: 'Altavoz Bluetooth portátil con sonido 360°, resistencia IPX7 y 20 horas de batería.',
    specs: [
      { label: 'Potencia', value: '30W' },
      { label: 'Batería', value: '20 horas' },
      { label: 'Conectividad', value: 'Bluetooth 5.3' },
      { label: 'Certificación', value: 'IPX7' }
    ]
  },
  {
    id: 26,
    name: 'Graphics Tablet Pro',
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae',
    slug: 'graphics-tablet-pro',
    price: 299.99,
    stock: 23,
    rating: 4.7,
    reviews: 234,
    discount: 20,
    description: 'Tableta gráfica profesional con 8192 niveles de presión, pantalla HD y lápiz sin batería.',
    specs: [
      { label: 'Área activa', value: '10x6.25"' },
      { label: 'Presión', value: '8192 niveles' },
      { label: 'Resolución', value: '5080 LPI' },
      { label: 'Compatibilidad', value: 'Windows/Mac/Android' }
    ]
  },
  {
    id: 27,
    name: 'Smart Thermostat',
    image: 'https://images.unsplash.com/photo-1558089687-e460d06870c0',
    slug: 'smart-thermostat',
    price: 179.99,
    stock: 42,
    rating: 4.6,
    reviews: 312,
    description: 'Termostato inteligente con control por app, aprendizaje automático y ahorro energético.',
    specs: [
      { label: 'Pantalla', value: 'LCD táctil' },
      { label: 'Sensores', value: 'Temperatura, Humedad' },
      { label: 'Conectividad', value: 'WiFi, App' },
      { label: 'Ahorro', value: 'Hasta 23%' }
    ]
  },
  {
    id: 28,
    name: 'Security Camera 2K',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9',
    slug: 'security-camera-2k',
    price: 99.99,
    stock: 68,
    rating: 4.4,
    reviews: 567,
    description: 'Cámara de seguridad 2K con visión nocturna, detección de movimiento y audio bidireccional.',
    specs: [
      { label: 'Resolución', value: '2K QHD' },
      { label: 'Visión nocturna', value: 'Hasta 10m' },
      { label: 'Almacenamiento', value: 'Cloud + SD' },
      { label: 'Audio', value: 'Bidireccional' }
    ]
  },
  {
    id: 29,
    name: 'E-Reader Premium',
    image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666',
    slug: 'e-reader-premium',
    price: 199.99,
    stock: 35,
    rating: 4.8,
    reviews: 445,
    description: 'Lector de libros electrónicos con pantalla E Ink de 7", luz ajustable y resistencia al agua.',
    specs: [
      { label: 'Pantalla', value: '7" E Ink HD' },
      { label: 'Resolución', value: '300 PPI' },
      { label: 'Almacenamiento', value: '32GB' },
      { label: 'Batería', value: 'Hasta 6 semanas' }
    ]
  },
  {
    id: 30,
    name: 'Fitness Tracker Band',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6',
    slug: 'fitness-tracker-band',
    price: 59.99,
    stock: 112,
    rating: 4.3,
    reviews: 789,
    description: 'Pulsera de actividad con monitor de frecuencia cardíaca, SpO2 y seguimiento del sueño.',
    specs: [
      { label: 'Pantalla', value: '1.1" AMOLED' },
      { label: 'Sensores', value: 'FC, SpO2, Acelerómetro' },
      { label: 'Batería', value: '14 días' },
      { label: 'Resistencia', value: '5ATM' }
    ]
  }
];

const ExplorePage = () => {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-28"
    >
      <Helmet>
        <title>Explorar Productos — Fuxion Shop</title>
        <meta name="description" content="Descubre la colección completa de gadgets y productos únicos en Fuxion Shop." />
      </Helmet>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter">Explorar Productos</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Sumérgete en nuestro catálogo de {mockProducts.length} productos y encuentra tu próximo gadget favorito.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.01, 0.3) }}
          >
            <div className="group relative bg-card rounded-xl overflow-hidden border border-border transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full">
              <div className="absolute inset-0 radial-gradient-glow opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>

              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-secondary flex-shrink-0">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={product.name}
                  src={product.image || "https://images.unsplash.com/photo-1635865165118-917ed9e20936"}
                  loading="lazy"
                />
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}
                {product.stock < 10 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    ¡Últimas {product.stock}!
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-foreground truncate mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      ${product.discount
                        ? (product.price * (1 - product.discount / 100)).toFixed(2)
                        : product.price}
                    </p>
                    {product.discount && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${product.price}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ⭐ {product.rating || 4.5}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-auto">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 h-9 text-sm gap-1 cursor-pointer"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.stock === 0 ? 'Agotado' : 'Agregar'}
                  </Button>
                  <Button
                    onClick={() => handleViewDetails(product)}
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 cursor-pointer"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  );
};

export default ExplorePage;
