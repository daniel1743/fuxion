import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Heart,
  Package,
  Tags,
  BookOpen,
  FileText,
  Instagram,
  Facebook,
  HelpCircle,
  MessageCircle,
  Truck,
  MessagesSquare,
  Shield,
  Cookie,
} from 'lucide-react';
import { buildWhatsappUrl } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { useSiteSettings } from '@/context/SiteSettingsContext';

const Footer = () => {
    const { settings } = useSiteSettings();

    const tiendaLinks = [
      { label: 'Productos FuXion', icon: Package, path: '/explorar' },
      { label: 'Categorías', icon: Tags, path: '/categorias' },
      { label: 'Sobre Nosotros', icon: Heart, path: '/sobre-nosotros' },
      { label: 'Bienestar', icon: Heart, path: '/opiniones' },
      { label: 'Evidencias', icon: BookOpen, path: '/blog' },
      { label: 'Términos y Condiciones', icon: FileText, path: '/terminos' },
    ];

    const ayudaLinks = [
      { label: 'Centro de ayuda', icon: HelpCircle, path: '/ayuda' },
      { label: 'Contacto', icon: MessageCircle, path: '/contacto' },
      { label: 'Envíos', icon: Truck, path: '/envios' },
      { label: 'FAQ', icon: MessagesSquare, path: '/faq' },
      { label: 'Política de Privacidad', icon: Shield, path: '/privacidad' },
      { label: 'Política de Cookies', icon: Cookie, path: '/cookies' },
    ];

    const socialLinks = [
      {
        name: 'Instagram',
        icon: Instagram,
        url: 'https://www.instagram.com/donde_mi_negro?igsh=MWU1MWo5aXhvMnh3bg==',
      },
      {
        name: 'Facebook',
        icon: Facebook,
        url: 'https://www.facebook.com/share/1KVxA4JL4t/',
      },
      {
        name: 'WhatsApp',
        icon: WhatsAppIcon,
        url: buildWhatsappUrl('Hola, quiero hablar con un asesor Fuxion.'),
      },
    ];

    return (
        <footer className="bg-card border-t border-border mt-16 sm:mt-20">
            <div className="container mx-auto px-5 sm:px-6 py-10 sm:py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
                    {/* ── Brand Section ───────────────────────────── */}
                    <div className="col-span-1 md:col-span-1 flex flex-col items-start">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            {settings.logo_url ? (
                                <img
                                    src={settings.logo_url}
                                    alt={settings.site_name}
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-200 shadow-sm"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center ring-2 ring-emerald-200 shadow-sm">
                                    <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-foreground tracking-tight leading-tight">
                                    Naturalmente FuXion
                                </span>
                                <span className="text-[11px] text-muted-foreground mt-0.5">
                                    Bienestar natural y asesoría personalizada
                                </span>
                            </div>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Productos Fuxion para nutrición, bienestar natural, energía, digestión y control de peso. Compra asistida por WhatsApp.
                        </p>
                    </div>

                    {/* ── Tienda Section (with icons) ─────────────── */}
                    <div>
                        <p className="font-semibold text-foreground tracking-wider text-sm uppercase">Tienda</p>
                        <div className="flex flex-col mt-4 space-y-2.5">
                            {tiendaLinks.map((link) => {
                                const IconComponent = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="group flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors duration-200"
                                    >
                                        <span className="flex items-center justify-center w-5 h-5 shrink-0">
                                            <IconComponent className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors duration-200" strokeWidth={1.5} />
                                        </span>
                                        <span className="text-sm">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Ayuda Section (with icons) ──────────────── */}
                    <div>
                        <p className="font-semibold text-foreground tracking-wider text-sm uppercase">Ayuda</p>
                        <div className="flex flex-col mt-4 space-y-2.5">
                            {ayudaLinks.map((link) => {
                                const IconComponent = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="group flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors duration-200"
                                    >
                                        <span className="flex items-center justify-center w-5 h-5 shrink-0">
                                            <IconComponent className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors duration-200" strokeWidth={1.5} />
                                        </span>
                                        <span className="text-sm">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Social Section ──────────────────────────── */}
                    <div>
                        <p className="font-semibold text-foreground tracking-wider text-sm uppercase">Conecta con nosotros</p>
                        <div className="flex mt-4 gap-3">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group w-10 h-10 rounded-full border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/20 hover:scale-105 transition-all duration-200"
                                        aria-label={social.name}
                                        title={social.name}
                                    >
                                        <IconComponent className="w-5 h-5" strokeWidth={1.8} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Copyright ──────────────────────────────────── */}
                <div className="mt-10 sm:mt-14 border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left flex items-center gap-1.5">
                        © {new Date().getFullYear()} {settings.site_name || 'Naturalmente FuXion'}. Atención personalizada por {settings.owner_name || 'Daniel Falcon'}.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
