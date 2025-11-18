
import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Heart, Twitter, Youtube, Twitch } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-card border-t border-border mt-20">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1 flex flex-col items-start">
                         <Link to="/" className="flex items-center gap-2 mb-4">
                            <Rocket className="text-primary h-10 w-10 animate-pulse" />
                            <span className="text-xl font-bold text-foreground tracking-tighter">Fuxion Shop</span>
                        </Link>
                        <p className="text-muted-foreground text-sm">Tu universo de gadgets premium, arte digital y colecciones únicas.</p>
                    </div>

                    <div>
                        <p className="font-semibold text-foreground tracking-wider">Compañía</p>
                        <div className="flex flex-col mt-4 space-y-2">
                            <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
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
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Youtube /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Twitch /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                        © {new Date().getFullYear()} Fuxion Shop. Creado con <Heart className="h-4 w-4 text-pink-500" /> por Daniel Falcon.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
