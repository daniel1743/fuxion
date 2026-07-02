
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Instagram, Facebook } from 'lucide-react';
import { buildWhatsappUrl } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { useSiteSettings } from '@/context/SiteSettingsContext';

const Footer = () => {
    const { settings } = useSiteSettings();

    return (
        <footer className="bg-card border-t border-border mt-20">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1 flex flex-col items-start">
                         <Link to="/" className="flex items-center gap-2 mb-4">
                            {settings.logo_url ? (
                                <img
                                    src={settings.logo_url}
                                    alt={settings.site_name}
                                    className="h-10 w-10 rounded-full object-cover ring-1 ring-emerald-200"
                                />
                            ) : (
                                <Leaf className="text-emerald-600 h-10 w-10" />
                            )}
                            <span className="text-xl font-bold text-foreground tracking-tight">{settings.site_name}</span>
                        </Link>
                        <p className="text-muted-foreground text-sm">Productos Fuxion para nutrición, bienestar natural, energía, digestión y control de peso. Compra asistida por WhatsApp.</p>
                    </div>

                    <div>
                        <p className="font-semibold text-foreground tracking-wider">Tienda</p>
                        <div className="flex flex-col mt-4 space-y-2">
                            <Link to="/explorar" className="text-muted-foreground hover:text-primary transition-colors">Productos Fuxion</Link>
                            <Link to="/categorias" className="text-muted-foreground hover:text-primary transition-colors">Categorías</Link>
                            <Link to="/opiniones" className="text-muted-foreground hover:text-primary transition-colors">Bienestar</Link>
                            <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Evidencias</Link>
                            <Link to="/terminos" className="text-muted-foreground hover:text-primary transition-colors">Términos y Condiciones</Link>
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold text-foreground tracking-wider">Ayuda</p>
                        <div className="flex flex-col mt-4 space-y-2">
                            <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors">Contacto</Link>
                            <Link to="/envios" className="text-muted-foreground hover:text-primary transition-colors">Envíos y Devoluciones</Link>
                            <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold text-foreground tracking-wider">Síguenos</p>
                        <div className="flex mt-4 space-x-4">
                            <a 
                                href="https://www.instagram.com/donde_mi_negro?igsh=MWU1MWo5aXhvMnh3bg==" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://www.facebook.com/share/1KVxA4JL4t/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a 
                                href={buildWhatsappUrl('Hola, quiero hablar con un asesor Fuxion.')} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="WhatsApp"
                            >
                                <WhatsAppIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                        © {new Date().getFullYear()} {settings.site_name}. Atención personalizada por {settings.owner_name || 'Daniel Falcon'}.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
