
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/components/ui/use-toast";
import { LifeBuoy, Mail, MessageSquare } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const SupportPage = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "📬 Mensaje Enviado (Simulación)",
      description: "Gracias por contactarnos. Te responderemos pronto.",
    });
    e.target.reset();
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
        <title>Soporte — Fuxion Shop</title>
        <meta name="description" content="Contacta con el equipo de soporte de Fuxion Shop." />
      </Helmet>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter">Centro de Soporte</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          ¿Necesitas ayuda? Estamos aquí para resolver tus dudas.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <LifeBuoy />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Preguntas Frecuentes</h3>
              <p className="text-muted-foreground mt-1">Encuentra respuestas rápidas a las dudas más comunes en nuestra sección de FAQ.</p>
              <Button variant="link" className="px-0">Ir a FAQ</Button>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Mail />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Soporte por Email</h3>
              <p className="text-muted-foreground mt-1">Envíanos un correo a <a href="mailto:soporte@fuxionshop.com" className="text-primary underline">soporte@fuxionshop.com</a>.</p>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card p-8 rounded-xl border border-border"
        >
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><MessageSquare /> Envíanos un mensaje</h2>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Tu nombre completo" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea id="message" placeholder="¿En qué podemos ayudarte?" required />
            </div>
            <Button type="submit" className="w-full">Enviar Mensaje</Button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SupportPage;
