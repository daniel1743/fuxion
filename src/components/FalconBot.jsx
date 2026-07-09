import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, X, Send, MessageCircle, FileText, Play, Heart, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { sendMessageToDeepSeek } from '@/services/deepseekService';
import { confirmAndOpenWhatsapp, getActiveAdvisor } from '@/lib/whatsapp';
import { recordAdvisorEvent } from '@/services/advisorService';
import { AiRobotIcon, WhatsAppIcon } from '@/components/icons/BrandIcons';
import ProductLinkedText from '@/components/ProductLinkedText';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { ChatMessageSkeleton } from '@/components/skeleton';
import { useScrollAware } from '@/components/ScrollAwareFloating';
import {
  getContextualGreeting,
  getSmartSuggestions,
  getContextForAI,
  markGreetingShown,
  getUserJourneyContext
} from '@/lib/userJourneyContext';
import {
  getJourneyGreeting,
  getJourneyContextForAI,
  getViewedProductNames,
  getMainInterest
} from '@/lib/productJourney';

const FalconBot = () => {
    const { user } = useAuth();
    const { adminData } = useAdmin();
    const { account, orders, isEligible } = useLoyalty();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);
    const [showQuickWhatsapp, setShowQuickWhatsapp] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [isFloatingHovered, setIsFloatingHovered] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const quickWhatsappTimerRef = useRef(null);
    const chatContainerRef = useRef(null);
    const customerName = user?.name || adminData?.nombre_completo || '';
    const firstName = customerName.trim().split(/\s+/)[0] || '';

    // Listen for mobile menu open/close events from Header
    useEffect(() => {
        const handleMobileMenu = (event) => {
            setIsMobileMenuOpen(event.detail?.isOpen || false);
        };
        window.addEventListener('fuxion:mobile-menu', handleMobileMenu);
        return () => window.removeEventListener('fuxion:mobile-menu', handleMobileMenu);
    }, []);

    // Scroll awareness — reduce opacidad al hacer scroll
    const { style: scrollStyle } = useScrollAware();

    // Smart suggestions based on user journey context
    const quickActions = getSmartSuggestions();

    // Load saved messages from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('fuxion-chat-history');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed);
                }
            }
        } catch (e) {
            // Ignore parse errors
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        try {
            if (messages.length > 0) {
                localStorage.setItem('fuxion-chat-history', JSON.stringify(messages));
            }
        } catch (e) {
            // Ignore storage errors
        }
    }, [messages]);

    const buildPersonalizedGreeting = () => {
        if (!isEligible) {
            return 'Hola. ¿En qué puedo ayudarte hoy?';
        }
        return firstName
            ? `Hola, ${firstName}. ¿En qué puedo ayudarte hoy?`
            : 'Hola. ¿En qué puedo ayudarte hoy?';
    };

    const makeConversationNatural = (text) => {
        if (!messages.length) return text;
        const escapedName = firstName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Si ya hay mensajes previos, eliminar cualquier saludo repetido al inicio
        let cleaned = String(text);
        if (messages.length > 0) {
            // Eliminar "Hola [nombre]" o "Hola" al inicio de la respuesta
            const greetingPattern = escapedName
                ? new RegExp(`^\\s*Hola(?:\\s+de\\s+nuevo)?,?\\s+${escapedName}[.!,:;]?\\s*`, 'i')
                : /^\s*Hola(?:,\s*)?[.!,:;]?\s*/i;
            cleaned = cleaned.replace(greetingPattern, '');
            // También eliminar "Hola [nombre]" si aparece como frase completa al inicio
            // (ej: "Hola Daniel. Te recomiendo..." -> "Te recomiendo...")
            const fullGreetingPattern = escapedName
                ? new RegExp(`^\\s*Hola(?:\\s+de\\s+nuevo)?,?\\s+${escapedName}[.!,:;]?\\s+`, 'i')
                : /^\s*Hola(?:,\s*)?[.!,:;]?\s+/i;
            cleaned = cleaned.replace(fullGreetingPattern, '');
        }
        return cleaned
            .replace(/^\s*Gracias por (?:consultarme|tu consulta|tu pregunta|preguntar)[.!,:;]?\s*/i, '')
            .replace(/^\s*Bienvenido(?: de nuevo)?[.!,:;]?\s*/i, '')
            .replace(/^([a-záéíóúñ])/, (letter) => letter.toUpperCase())
            .trim();
    };

    const bot = {
        name: 'Fuxion Assistant',
        subtitle: (
            <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 align-middle" />
                Disponible para ayudarte
            </>
        ),
        typingSubtitle: 'Falcon Assistant está escribiendo...',
        color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
        greeting: buildPersonalizedGreeting()
    };

    const buildWhatsappUrl = (message) => {
        const phone = '56912345678';
        const encoded = encodeURIComponent(message);
        return `https://wa.me/${phone}?text=${encoded}`;
    };

    const buildAdvisorMessage = (conversation, reason) => {
        const recentConversation = conversation
            .slice(-8)
            .map(message => `${message.sender === 'user' ? 'Cliente' : 'Chatbot'}: ${message.text}`)
            .join('\n');
        return `Hola, solicito asesoría desde Fuxion Shop.

Motivo de derivación: ${reason}
${activeProduct?.name ? `Producto en consulta: ${activeProduct.name}\n` : ''}
Resumen de la conversación:
${recentConversation}

Quedo atento para continuar la atención por WhatsApp.`;
    };

    const buildAdvisorUrl = (conversation, reason) =>
        buildWhatsappUrl(buildAdvisorMessage(conversation, reason));

    const showQuickWhatsappAction = () => {
        setShowQuickWhatsapp(true);
        if (quickWhatsappTimerRef.current) {
            clearTimeout(quickWhatsappTimerRef.current);
        }
        quickWhatsappTimerRef.current = setTimeout(() => {
            setShowQuickWhatsapp(false);
        }, 5000);
    };

    const hideQuickWhatsappAction = () => {
        if (quickWhatsappTimerRef.current) {
            clearTimeout(quickWhatsappTimerRef.current);
            quickWhatsappTimerRef.current = null;
        }
        setShowQuickWhatsapp(false);
    };

    const handleQuickWhatsapp = (event) => {
        event.stopPropagation();
        confirmAndOpenWhatsapp('Hola, quiero hablar con un asesor Fuxion.');
        hideQuickWhatsappAction();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isOpen || activeProduct) return;
        setMessages((current) => {
            if (current.length !== 1 || current[0].sender !== 'bot') return current;
            return [{ ...current[0], text: buildPersonalizedGreeting() }];
        });
    }, [isOpen, activeProduct, firstName, isEligible]);

    useEffect(() => {
        return () => {
            if (quickWhatsappTimerRef.current) {
                clearTimeout(quickWhatsappTimerRef.current);
            }
        };
    }, []);

    // Scroll lock: when chat is open, prevent page scrolling
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
            document.body.style.width = '100%';
        } else {
            const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            document.body.style.width = '';
            if (scrollY > 0) {
                window.scrollTo(0, scrollY);
            }
        }
        return () => {
            // Cleanup in case component unmounts while chat is open
            const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            document.body.style.width = '';
            if (scrollY > 0) {
                window.scrollTo(0, scrollY);
            }
        };
    }, [isOpen]);

    // Click outside to close + Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            // Prevent close when clicking inside the chat container
            if (chatContainerRef.current && chatContainerRef.current.contains(event.target)) {
                return;
            }
            setIsOpen(false);
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        // Use mousedown for more responsive feel (fires before click)
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    const getSpecValue = (product, label) => {
        if (!product) return null;
        const spec = product.specs?.find(item =>
            item.label?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === label
        );
        return spec?.value;
    };

    const buildProductIntro = (product) => {
        const benefits = product.beneficios || product.benefits || [];
        const ingredients = product.ingredientes || product.ingredients || [];
        const presentation = product.presentation || getSpecValue(product, 'presentacion') || 'Presentación en sobres';
        const usage = product.usage || getSpecValue(product, 'modo de uso') || 'Consultar modo de uso según objetivo';
        const schedule = product.schedule || getSpecValue(product, 'horario') || 'Horario según recomendación personalizada';
        const price = product.price || product.precio;
        return `Te ayudo con ${product.name}.

Precio: ${price ? `$${price.toLocaleString('es-CL')}` : 'Consultar'}
Presentación: ${presentation}
Cómo se toma: ${usage}
Horario sugerido: ${schedule}
${benefits.length ? `Para qué sirve: ${benefits.slice(0, 4).join(', ')}.` : ''}
${ingredients.length ? `Ingredientes destacados: ${ingredients.slice(0, 4).join(', ')}.` : ''}

Puedes preguntarme si es adecuado para tu objetivo, con qué combinarlo o cómo armar tu pedido.`;
    };

    useEffect(() => {
        const handleProductConsultation = (event) => {
            const product = event.detail?.product;
            if (!product?.name) return;
            const advisor = getActiveAdvisor();
            recordAdvisorEvent(advisor.id, 'product_ai', { productName: product.name });
            setActiveProduct(product);
            setIsOpen(true);
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: buildProductIntro(product),
                botType: 'assistant'
            }]);
        };
        window.addEventListener('fuxion:open-product-ai', handleProductConsultation);
        return () => window.removeEventListener('fuxion:open-product-ai', handleProductConsultation);
    }, []);

    /**
     * Añade o reemplaza un mensaje de contexto de producto en el historial.
     * 
     * Lógica inteligente:
     * - Si NO existe contextMessage → agrega normalmente
     * - Si existe contextMessage y el slug es igual → no hace nada
     * - Si existe contextMessage pero el slug cambió → reemplaza ese mensaje
     * 
     * @param {object} greetingObj - { text, slug } del saludo contextual
     * @param {object} greetingContext - { page, slug } para markGreetingShown
     */
    const addOrUpdateContextMessage = (greetingObj, greetingContext) => {
        markGreetingShown(greetingContext);
        
        setMessages(prev => {
            // Buscar si ya existe un mensaje de contexto
            const existingContextIndex = prev.findIndex(
                m => m.contextMessage === true
            );

            if (existingContextIndex === -1) {
                // No existe mensaje de contexto → agregar normalmente
                return [...prev, {
                    sender: 'bot',
                    text: greetingObj.text,
                    botType: 'assistant',
                    contextMessage: true,
                    contextSlug: greetingObj.slug || null
                }];
            }

            const existingMsg = prev[existingContextIndex];
            
            // Si el slug es el mismo → no hacer nada
            if (greetingObj.slug && existingMsg.contextSlug === greetingObj.slug) {
                return prev;
            }

            // Slug cambió → reemplazar el mensaje de contexto existente
            const updated = [...prev];
            updated[existingContextIndex] = {
                ...existingMsg,
                text: greetingObj.text,
                contextSlug: greetingObj.slug || null
            };
            return updated;
        });
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Verificar contexto de producto al abrir el chat
            const journeyCtx = getUserJourneyContext();

            // Obtener saludo contextual (ahora devuelve { text, slug } o null)
            const contextualGreeting = getContextualGreeting();

            if (contextualGreeting) {
                // Determinar el contexto del saludo
                const greetingContext = journeyCtx && journeyCtx.slug
                    ? { page: 'product', slug: journeyCtx.slug }
                    : { page: journeyCtx?.page || 'product', slug: null };

                // Usar la nueva lógica inteligente de contexto
                addOrUpdateContextMessage(contextualGreeting, greetingContext);
                return;
            }

            // Solo mostrar saludo default si no hay mensajes previos
            if (messages.length === 0) {
                // PRIORIDAD 2: Smart Product Interest Memory greeting
                const journeyGreeting = getJourneyGreeting();
                if (journeyGreeting) {
                    setMessages(prev => prev.length === 0 ? [{
                        sender: 'bot',
                        text: journeyGreeting,
                        botType: 'assistant'
                    }] : prev);
                } else {
                    setMessages(prev => prev.length === 0 ? [{
                        sender: 'bot',
                        text: bot.greeting,
                        botType: 'assistant'
                    }] : prev);
                }
            }
        }
    };

    const minimizeChat = () => {
        setIsOpen(false);
    };

    const declineAdvisor = (messageIndex) => {
        const advisor = getActiveAdvisor();
        if (advisor?.id) {
            recordAdvisorEvent(advisor.id, 'advisor_decline', {
                source: 'chat',
                messageIndex
            });
        }
        setMessages(prev => {
            const updated = prev.map((msg, index) => (
                index === messageIndex
                    ? { ...msg, advisorUrl: null, showContactForm: false }
                    : msg
            ));
            return [
                ...updated,
                {
                    sender: 'bot',
                    text: 'Perfecto, seguimos aquí. Continuaré respondiendo tu consulta dentro del chat. Si en cualquier momento quieres hablar con un asesor por WhatsApp, solo dime y te lo facilito.',
                    botType: 'assistant'
                }
            ];
        });
    };

    const handleOpenContactForm = () => {
        minimizeChat();
        // Pequeño delay para que se cierre el chat antes de navegar
        setTimeout(() => {
            window.location.href = '/ayuda';
        }, 300);
    };

    const handleOpenWhatsAppContact = () => {
        confirmAndOpenWhatsapp('Hola, quiero contactar con el equipo de Naturalmente FuXion.');
        minimizeChat();
    };

    const handleQuickAction = (actionText) => {
        setShowQuickActions(false);
        setInput(actionText);
        // Auto-send after a brief delay to show the text in input
        setTimeout(() => {
            const fakeEvent = { preventDefault: () => {} };
            setInput(actionText);
            // We need to trigger handleSend with the text
            const userMessage = actionText;
            setInput('');

            setMessages(prev => [...prev, {
                sender: 'user',
                text: userMessage
            }]);

            const nextMessages = [...messages, { sender: 'user', text: userMessage }];
            setIsLoading(true);

            // Reuse the send logic
            executeSend(userMessage, nextMessages);
        }, 100);
    };

    /**
     * Obtiene el contexto del producto actual desde userJourneyContext (sessionStorage)
     * como fallback cuando activeProduct no está disponible.
     * Esto asegura que la IA siempre sepa en qué producto está el usuario.
     */
    const getCurrentProductContext = () => {
        // Prioridad 1: activeProduct state (producto abierto vía botón "Preguntar a IA")
        if (activeProduct) {
            return {
                name: activeProduct.name,
                slug: activeProduct.slug,
                category: activeProduct.categoria || activeProduct.category || 'Fuxion',
                price: activeProduct.price,
                presentation: activeProduct.presentation || getSpecValue(activeProduct, 'presentacion'),
                usage: activeProduct.usage || getSpecValue(activeProduct, 'modo de uso'),
                schedule: activeProduct.schedule || getSpecValue(activeProduct, 'horario'),
                benefits: activeProduct.beneficios || activeProduct.benefits || [],
                ingredients: activeProduct.ingredientes || activeProduct.ingredients || []
            };
        }

        // Prioridad 2: userJourneyContext (producto actual de la página)
        const journeyCtx = getUserJourneyContext();
        if (journeyCtx && journeyCtx.page === 'product' && journeyCtx.product) {
            return {
                name: journeyCtx.product,
                slug: journeyCtx.slug,
                category: journeyCtx.category || 'Fuxion'
            };
        }

        return null;
    };

    const buildProductContextForAI = (productCtx) => {
        if (!productCtx) return '';
        
        let context = `\n\nPRODUCTO ACTUAL DEL USUARIO:
Nombre: ${productCtx.name}`;
        if (productCtx.slug) context += `\nSlug: ${productCtx.slug}`;
        if (productCtx.category) context += `\nCategoría: ${productCtx.category}`;
        if (productCtx.price) context += `\nPrecio: $${productCtx.price.toLocaleString('es-CL')}`;
        if (productCtx.presentation) context += `\nPresentación: ${productCtx.presentation}`;
        if (productCtx.usage) context += `\nModo de uso: ${productCtx.usage}`;
        if (productCtx.schedule) context += `\nHorario: ${productCtx.schedule}`;
        if (productCtx.benefits?.length) context += `\nBeneficios: ${productCtx.benefits.join(', ')}`;
        if (productCtx.ingredients?.length) context += `\nIngredientes: ${productCtx.ingredients.join(', ')}`;
        
        return context;
    };

    const executeSend = async (userMessage, nextMessages) => {
        try {
            const conversationHistory = messages
                .filter(m => m.sender && m.botType !== 'system')
                .slice(-8);

            // Legacy user journey context (page navigation)
            const journeyContext = getContextForAI();
            const journeySection = journeyContext ? `\n\nCONTEXTO DE NAVEGACIÓN DEL USUARIO:\n${journeyContext}` : '';

            // Smart Product Interest Memory context (product browsing journey)
            const productJourneyContext = getJourneyContextForAI();
            const productJourneySection = productJourneyContext ? `\n\nCONTEXTO DE PRODUCTOS VISTOS:\n${productJourneyContext}` : '';

            // Producto actual: siempre incluir contexto aunque no haya saludo visible
            const currentProductCtx = getCurrentProductContext();
            const productSection = buildProductContextForAI(currentProductCtx);

            const response = await sendMessageToDeepSeek(
                `${buildCustomerContext()}${journeySection}${productJourneySection}${productSection}

Pregunta del usuario: ${userMessage}`,
                'unificado',
                conversationHistory
            );


            setMessages(prev => [...prev, {
                sender: 'bot',
                text: makeConversationNatural(response.text),
                botType: 'assistant',
                apiUsed: response.apiUsed,
                advisorUrl: response.showWhatsApp
                    ? buildAdvisorUrl([...nextMessages, { sender: 'bot', text: response.text }], response.advisorReason || 'El cliente solicitó asistencia humana.')
                    : null,
                // Business Opportunity flags
                isBusinessOpportunity: response.isBusinessOpportunity === true,
                showOpportunityVideo: response.showOpportunityVideo === true,
                showOpportunityAdvisor: response.showOpportunityAdvisor === true
            }]);

            console.log(`💬 Respuesta generada por: ${response.apiUsed}`);

        } catch (error) {
            console.error('Error al enviar mensaje:', error);

            let errorMessage = 'Estoy teniendo dificultad para responder en este momento. ';

            if (error.message.includes('Insufficient Balance') || error.message.includes('402')) {
                errorMessage += 'El servicio de IA no está disponible temporalmente. Intenta nuevamente en unos segundos.';
            } else if (error.message.includes('API Key') || error.message.includes('API key')) {
                errorMessage += 'La configuración del servicio no está completa. Intenta nuevamente más tarde.';
            } else if (error.message.includes('429')) {
                errorMessage += 'Hay muchas consultas en este momento. Espera unos segundos y vuelve a intentar.';
            } else {
                errorMessage += 'Intenta nuevamente en unos segundos.';
            }

            setMessages(prev => [...prev, {
                sender: 'bot',
                text: errorMessage,
                botType: 'error',
                advisorUrl: buildAdvisorUrl(nextMessages, 'El chatbot tuvo un error técnico y derivó la conversación a asesor humano.')
            }]);

            toast({
                title: "Error de conexión",
                description: "Estoy teniendo dificultad para responder. Intenta nuevamente",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        setMessages(prev => [...prev, {
            sender: 'user',
            text: userMessage
        }]);

        const nextMessages = [...messages, { sender: 'user', text: userMessage }];

        setIsLoading(true);

        try {
            const conversationHistory = messages
                .filter(m => m.sender && m.botType !== 'system')
                .slice(-8);

            const journeyContext = getContextForAI();
            const journeySection = journeyContext ? `\n\nCONTEXTO DE NAVEGACIÓN DEL USUARIO:\n${journeyContext}` : '';

            // Smart Product Interest Memory context (product browsing journey)
            const productJourneyContext = getJourneyContextForAI();
            const productJourneySection = productJourneyContext ? `\n\nCONTEXTO DE PRODUCTOS VISTOS:\n${productJourneyContext}` : '';

            // Producto actual: siempre incluir contexto aunque no haya saludo visible
            const currentProductCtx = getCurrentProductContext();
            const productSection = buildProductContextForAI(currentProductCtx);

            const response = await sendMessageToDeepSeek(
                `${buildCustomerContext()}${journeySection}${productJourneySection}${productSection}

Pregunta del usuario: ${userMessage}`,
                'unificado',
                conversationHistory
            );

            // El backend ahora devuelve toda la información de contexto
            // incluyendo si debe mostrar WhatsApp o no
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: makeConversationNatural(response.text),
                botType: 'assistant',
                apiUsed: response.apiUsed,
                // Solo mostrar WhatsApp si el backend lo indica explícitamente
                advisorUrl: response.showWhatsApp
                    ? buildAdvisorUrl([...nextMessages, { sender: 'bot', text: response.text }], response.advisorReason || 'El cliente solicitó asistencia humana.')
                    : null,
                // Business Opportunity flags
                isBusinessOpportunity: response.isBusinessOpportunity === true,
                showOpportunityVideo: response.showOpportunityVideo === true,
                showOpportunityAdvisor: response.showOpportunityAdvisor === true
            }]);

            console.log(`💬 Respuesta generada por: ${response.apiUsed}`);

        } catch (error) {
            console.error('Error al enviar mensaje:', error);

            let errorMessage = 'Estoy teniendo dificultad para responder en este momento. ';

            if (error.message.includes('Insufficient Balance') || error.message.includes('402')) {
                errorMessage += 'El servicio de IA no está disponible temporalmente. Intenta nuevamente en unos segundos.';
            } else if (error.message.includes('API Key') || error.message.includes('API key')) {
                errorMessage += 'La configuración del servicio no está completa. Intenta nuevamente más tarde.';
            } else if (error.message.includes('429')) {
                errorMessage += 'Hay muchas consultas en este momento. Espera unos segundos y vuelve a intentar.';
            } else {
                errorMessage += 'Intenta nuevamente en unos segundos.';
            }

            setMessages(prev => [...prev, {
                sender: 'bot',
                text: errorMessage,
                botType: 'error',
                advisorUrl: buildAdvisorUrl(nextMessages, 'El chatbot tuvo un error técnico y derivó la conversación a asesor humano.')
            }]);

            toast({
                title: "Error de conexión",
                description: "Estoy teniendo dificultad para responder. Intenta nuevamente",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const buildCustomerContext = () => {
        if (!isEligible) return 'El visitante no ha iniciado sesión.';
        const history = (orders || [])
            .slice(0, 3)
            .flatMap((order) => (order.products || []).map((product) => (
                `${product.name} x${product.quantity}, pedido el ${new Date(order.created_at).toLocaleDateString('es-CL')}`
            )))
            .slice(0, 6)
            .join('; ');
        return `CONTEXTO DEL CLIENTE:
- Nombre: ${customerName || 'Cliente'}
- Progreso de regalo: ${account.progress_products} de 4
- Regalos disponibles: ${account.available_rewards}
- Historial reciente: ${history || 'Sin historial detallado'}
- Si sugieres reposición de cajas de 28 sobres, aclara "si usaste un sobre al día". No presentes la estimación como certeza.`;
    };

    return (
        <>
            {/* Botón flotante — con scroll awareness */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                            scale: isMobileMenuOpen ? 0.8 : (isFloatingHovered ? 1 : scrollStyle.scale),
                            opacity: isMobileMenuOpen ? 0 : (isFloatingHovered ? 1 : scrollStyle.opacity),
                        }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 ${isMobileMenuOpen ? 'pointer-events-none md:pointer-events-auto' : ''}`}
                        onMouseEnter={() => { showQuickWhatsappAction(); setIsFloatingHovered(true); }}
                        onMouseLeave={() => { hideQuickWhatsappAction(); setIsFloatingHovered(false); }}
                        onFocus={() => { showQuickWhatsappAction(); setIsFloatingHovered(true); }}
                        onBlur={() => { hideQuickWhatsappAction(); setIsFloatingHovered(false); }}
                        onTouchStart={() => setIsFloatingHovered(true)}
                        onTouchEnd={() => setIsFloatingHovered(false)}
                    >
                        <AnimatePresence>
                            {showQuickWhatsapp && (
                                <motion.button
                                    type="button"
                                    initial={{ opacity: 0, x: 12, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 12, scale: 0.9 }}
                                    onClick={handleQuickWhatsapp}
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#1fb85a] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40"
                                    aria-label="Hablar por WhatsApp con un asesor"
                                    title="WhatsApp"
                                >
                                    <WhatsAppIcon className="h-7 w-7 text-white" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <button
                            type="button"
                            onClick={handleToggle}
                            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-92 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 group"
                            aria-label="Abrir asistente de IA"
                        >
                            <AiRobotIcon className="h-9 w-9 group-hover:scale-110 transition-transform object-contain" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-lg shadow-emerald-400/50 animate-pulse"></span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ventana del chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatContainerRef}
                        initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' }}
                        animate={{
                            opacity: isMobileMenuOpen ? 0 : 1,
                            y: isMobileMenuOpen ? 10 : 0,
                            scale: isMobileMenuOpen ? 0.96 : 1,
                            filter: isMobileMenuOpen ? 'blur(4px)' : 'blur(0px)'
                        }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`fixed inset-x-3 bottom-3 z-50 h-[min(600px,calc(100dvh-24px))] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[min(600px,calc(100dvh-48px))] ${isMobileMenuOpen ? 'pointer-events-none md:pointer-events-auto' : ''}`}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-4 flex justify-between items-center shadow-emerald-500/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                            <div className="flex items-center gap-2 relative z-10">
                                <div className="bg-white/15 rounded-full p-1.5">
                                    <AiRobotIcon className="h-8 w-8 object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">{bot.name}</h3>
                                    <motion.p
                                        key={isLoading ? 'typing' : 'idle'}
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-white/80 text-[11px]"
                                    >
                                        {isLoading ? bot.typingSubtitle : bot.subtitle}
                                    </motion.p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 relative z-10">
                                <Button
                                    onClick={minimizeChat}
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                                    title="Minimizar chat"
                                    aria-label="Minimizar chat"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={handleToggle}
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                                    title="Cerrar chat"
                                    aria-label="Cerrar chat"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Mensajes */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 ${
                                            message.sender === 'user'
                                                ? 'bg-[#F1FDF8] text-[#064E3B] border border-emerald-200 shadow-sm chat-bubble-user'
                                                : message.botType === 'error'
                                                ? 'bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl'
                                                : message.botType === 'system'
                                                ? 'bg-secondary text-foreground border border-border rounded-2xl'
                                                : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md chat-bubble-bot'
                                        }`}
                                    >
                                        {message.sender === 'bot' && message.botType !== 'system' && message.botType !== 'error' && (
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className="bg-white/20 rounded-full p-0.5">
                                                    <AiRobotIcon className="h-5 w-5 object-contain" />
                                                </div>
                                                <span className="text-[11px] font-semibold text-white/90">{bot.name}</span>
                                            </div>
                                        )}
                                        {message.sender === 'bot' && message.botType !== 'system' && message.botType !== 'error' ? (
                                            <ProductLinkedText
                                                text={message.text}
                                                className="text-sm whitespace-pre-wrap"
                                                onProductClick={minimizeChat}
                                            />
                                        ) : (
                                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                        )}
                                        {/* Business Opportunity buttons */}
                                        {message.isBusinessOpportunity && (
                                            <div className="mt-3 flex flex-col gap-2">
                                                {message.showOpportunityVideo && (
                                                    <a
                                                        href="https://youtu.be/L_AIXB0MI8A?si=nRhoWh3M9Fwd4_oX"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:shadow-lg hover:from-amber-600 hover:to-orange-600"
                                                    >
                                                    <Play className="h-4 w-4" />
                                                        Ver video de oportunidad
                                                    </a>
                                                )}
                                                {message.showOpportunityAdvisor && (
                                                    <button
                                                        type="button"
                                                        onClick={handleOpenWhatsAppContact}
                                                        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1fb85a]"
                                                    >
                                                    <WhatsAppIcon className="h-5 w-5 text-white" />
                                                        <MessageCircle className="h-4 w-4" />
                                                        Hablar con asesor
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {message.advisorUrl && !message.isBusinessOpportunity && (
                                            <div className="mt-3 flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleOpenContactForm}
                                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-xs font-semibold text-white transition hover:shadow-lg hover:from-emerald-600 hover:to-teal-600"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Abrir formulario de contacto
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleOpenWhatsAppContact}
                                                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1fb85a]"
                                                >
                                                    <WhatsAppIcon className="h-5 w-5 text-white" />
                                                    <MessageCircle className="h-4 w-4" />
                                                    Hablar por WhatsApp
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => declineAdvisor(index)}
                                                    className="inline-flex items-center justify-center rounded-full bg-red-500/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                                                >
                                                    No, gracias. Prefiero continuar aquí.
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {/* Timestamp */}
                                    <span className={`mt-1 text-[10px] leading-none text-muted-foreground/60 ${message.sender === 'user' ? 'mr-1' : 'ml-1'}`}>
                                        {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </motion.div>
                            ))}

                            {/* Quick action chips - shown when no messages or only greeting */}
                            {showQuickActions && messages.length <= 1 && !activeProduct && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-wrap gap-2 mt-2 justify-center"
                                >
                                    {quickActions.map((action, idx) => (
                                        <motion.button
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                            onClick={() => handleQuickAction(action.text)}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-card px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 shadow-sm hover:shadow-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 transition-all active:scale-95"
                                            disabled={isLoading}
                                        >
                                            <span>{action.emoji}</span>
                                            <span>{action.label}</span>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChatMessageSkeleton text="Falcon Assistant está escribiendo..." />
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 border-t border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-secondary">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Cuéntame qué quieres mejorar"
                                    className="flex-1 bg-white dark:bg-card border border-emerald-200 dark:border-emerald-800/40 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 placeholder:text-muted-foreground/50 transition-all"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-sm shadow-emerald-500/20 transition-all hover:shadow-md hover:shadow-emerald-500/30 hover:scale-105"
                                    disabled={!input.trim() || isLoading}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground/70 mt-2 text-center">
                                <Leaf className="h-3 w-3 inline-block mr-0.5" aria-hidden="true" />
                                Orientación sobre productos FuXion. No reemplaza una consulta médica.
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FalconBot;
