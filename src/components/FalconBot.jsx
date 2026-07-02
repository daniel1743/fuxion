
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { sendMessageToDeepSeek } from '@/services/deepseekService';
import { buildWhatsappUrl, confirmAndOpenWhatsapp, getActiveAdvisor } from '@/lib/whatsapp';
import { recordAdvisorEvent } from '@/services/advisorService';
import { AiRobotIcon, WhatsAppIcon } from '@/components/icons/BrandIcons';
import ProductLinkedText from '@/components/ProductLinkedText';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import { useLoyalty } from '@/context/LoyaltyContext';

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
    const messagesEndRef = useRef(null);
    const quickWhatsappTimerRef = useRef(null);
    const customerName = user?.name || adminData?.nombre_completo || '';
    const firstName = customerName.trim().split(/\s+/)[0] || '';
    const buildPersonalizedGreeting = () => {
        if (!isEligible) {
            return 'Hola. ¿En qué puedo ayudarte hoy?';
        }

        return firstName
            ? `Hola, ${firstName}. ¿En qué puedo ayudarte hoy?`
            : 'Hola. ¿En qué puedo ayudarte hoy?';
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

    const makeConversationNatural = (text) => {
        if (!messages.length) return text;

        const escapedName = firstName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const repeatedGreeting = escapedName
            ? new RegExp(`^\\s*Hola(?:\\s+de\\s+nuevo)?,?\\s+${escapedName}[.!,:;]?\\s*`, 'i')
            : /^\s*Hola(?:\s+de\s+nuevo)?[.!,:;]?\s*/i;

        return String(text)
            .replace(repeatedGreeting, '')
            .replace(/^\s*Gracias por (?:consultarme|tu consulta|tu pregunta|preguntar)[.!,:;]?\s*/i, '')
            .replace(/^\s*Bienvenido(?: de nuevo)?[.!,:;]?\s*/i, '')
            .replace(/^([a-záéíóúñ])/, (letter) => letter.toUpperCase())
            .trim();
    };

    const bot = {
        name: 'Fuxion Assistant',
        subtitle: 'Asesor integral',
        color: 'bg-emerald-600',
        greeting: buildPersonalizedGreeting()
    };

    const shouldEscalateToAdvisor = (text) => {
        const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return [
            'asesor',
            'humano',
            'persona',
            'whatsapp',
            'contactar',
            'hablar con alguien',
            'tratamiento',
            'medicamento',
            'medicacion',
            'medicado',
            'receta',
            'embarazo',
            'lactancia',
            'diabetes',
            'hipertension',
            'cancer',
            'enfermedad',
            'diagnostico'
        ].some(keyword => normalized.includes(keyword));
    };

    const isHealthConditionMessage = (text) => {
        const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return [
            'higado graso',
            'diabetes',
            'hipertension',
            'cancer',
            'enfermedad',
            'diagnostico',
            'embarazo',
            'lactancia',
            'medicamento',
            'medicacion',
            'medicado',
            'receta'
        ].some(keyword => normalized.includes(keyword));
    };

    const buildHealthSupportResponse = () => {
        const personalGreeting = firstName
            ? `Entiendo, ${firstName}. Gracias por contármelo.`
            : 'Entiendo. Gracias por contármelo.';

        return `${personalGreeting} Como se trata de una condición de salud, es importante que cualquier elección respete la evaluación y las indicaciones de tu profesional.\n\nPuedo explicarte información general de productos Fuxion o ayudarte a conversar con un asesor humano antes de decidir, sin reemplazar esa orientación.`;
    };

    const isGiftProgramQuestion = (text) => {
        const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return [
            'regalo',
            'gratis',
            'promocion',
            'beneficio 4',
            '4 + 1',
            '4+1',
            'cuatro productos'
        ].some(keyword => normalized.includes(keyword));
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
    }, [
        isOpen,
        activeProduct,
        firstName,
        isEligible,
    ]);

    useEffect(() => {
        return () => {
            if (quickWhatsappTimerRef.current) {
                clearTimeout(quickWhatsappTimerRef.current);
            }
        };
    }, []);

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
            setMessages([{
                sender: 'bot',
                text: buildProductIntro(product),
                botType: 'assistant'
            }]);
        };

        window.addEventListener('fuxion:open-product-ai', handleProductConsultation);
        return () => window.removeEventListener('fuxion:open-product-ai', handleProductConsultation);
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && messages.length === 0) {
            setMessages([{
                sender: 'bot',
                text: bot.greeting,
                botType: 'assistant'
            }]);
        }
    };

    const minimizeChat = () => {
        setIsOpen(false);
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

        if (isGiftProgramQuestion(userMessage)) {
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: 'Con tu sesión iniciada, cada 4 productos acumulados en pedidos obtienes 1 regalo. No necesitas comprar los cuatro de una sola vez: el avance se conserva aunque compres en meses distintos.\n\nPuedes elegir Passion, Liquid Fiber, Golden FLX o NoCarb-T. Verás tu contador en el carrito y en Mi cuenta y regalos. ¿Quieres que te ayude a elegir cuatro productos según tu objetivo?',
                botType: 'assistant'
            }]);
            return;
        }

        if (isHealthConditionMessage(userMessage)) {
            const responseText = buildHealthSupportResponse();
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: responseText,
                botType: 'assistant',
                advisorUrl: buildAdvisorUrl(
                    [...nextMessages, { sender: 'bot', text: responseText }],
                    'El cliente mencionó una condición de salud y requiere orientación personalizada antes de elegir.'
                )
            }]);
            return;
        }

        if (shouldEscalateToAdvisor(userMessage)) {
            const reason = 'El cliente solicitó asesor humano o mencionó una condición que requiere orientación personalizada.';
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: 'Te dejaré la vía para continuar con un asesor humano por WhatsApp. Así puede revisar tu caso con más detalle y orientarte mejor.',
                botType: 'assistant',
                advisorUrl: buildAdvisorUrl(nextMessages, reason)
            }]);
            return;
        }

        setIsLoading(true);

        try {
            const conversationHistory = messages
                .filter(m => m.sender && m.botType !== 'system')
                .slice(-8);

            const response = await sendMessageToDeepSeek(
                activeProduct
                    ? `${buildCustomerContext()}

Producto en consulta: ${activeProduct.name}
Precio: ${activeProduct.price ? `$${activeProduct.price.toLocaleString('es-CL')}` : 'Consultar'}
Categoría: ${activeProduct.categoria || activeProduct.category || 'Fuxion'}
Presentación: ${activeProduct.presentation || getSpecValue(activeProduct, 'presentacion') || 'Consultar'}
Modo de uso: ${activeProduct.usage || getSpecValue(activeProduct, 'modo de uso') || 'Consultar'}
Horario: ${activeProduct.schedule || getSpecValue(activeProduct, 'horario') || 'Consultar'}
Beneficios: ${(activeProduct.beneficios || activeProduct.benefits || []).join(', ')}
Ingredientes: ${(activeProduct.ingredientes || activeProduct.ingredients || []).join(', ')}

Pregunta del usuario: ${userMessage}`
                    : `${buildCustomerContext()}

Pregunta del usuario: ${userMessage}`,
                'unificado',
                conversationHistory
            );

            setMessages(prev => [...prev, {
                sender: 'bot',
                text: makeConversationNatural(response.text),
                botType: 'assistant',
                apiUsed: response.apiUsed,
                advisorUrl: response.text?.toLowerCase().includes('asesor humano') || response.text?.toLowerCase().includes('whatsapp')
                    ? buildAdvisorUrl([...nextMessages, { sender: 'bot', text: response.text }], 'El chatbot sugirió derivar la conversación a un asesor humano.')
                    : null
            }]);

            // Log para debug: mostrar qué API se usó
            console.log(`💬 Respuesta generada por: ${response.apiUsed}`);

        } catch (error) {
            console.error('Error al enviar mensaje:', error);

            let errorMessage = '❌ Lo siento, tuve un problema al procesar tu mensaje. ';

            if (error.message.includes('Insufficient Balance') || error.message.includes('402')) {
                errorMessage += 'DeepSeek no tiene saldo disponible. Por favor revisa el saldo de la cuenta o configura una API de respaldo válida.';
            } else if (error.message.includes('API Key') || error.message.includes('API key')) {
                errorMessage += 'La configuración de la API no está completa.';
            } else if (error.message.includes('429')) {
                errorMessage += 'Se excedió el límite de solicitudes. Intenta en unos momentos.';
            } else {
                errorMessage += 'Por favor, intenta de nuevo o contacta por WhatsApp.';
            }

            setMessages(prev => [...prev, {
                sender: 'bot',
                text: errorMessage,
                botType: 'error',
                advisorUrl: buildAdvisorUrl(nextMessages, 'El chatbot tuvo un error técnico y derivó la conversación a asesor humano.')
            }]);

            toast({
                title: "Error de conexión",
                description: "No pude conectar con el servicio de IA.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Botón flotante */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
                        onMouseEnter={showQuickWhatsappAction}
                        onMouseLeave={hideQuickWhatsappAction}
                        onFocus={showQuickWhatsappAction}
                        onBlur={hideQuickWhatsappAction}
                        onTouchStart={showQuickWhatsappAction}
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
                                    <WhatsAppIcon className="h-6 w-6" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <button
                            type="button"
                            onClick={handleToggle}
                            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-shadow hover:bg-emerald-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 group"
                            aria-label="Abrir asistente de IA"
                        >
                            <AiRobotIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ventana del chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-3 bottom-3 z-50 h-[min(600px,calc(100dvh-24px))] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[min(600px,calc(100dvh-48px))]"
                    >
                        {/* Header */}
                        <div className="bg-emerald-700 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <AiRobotIcon className="h-6 w-6 text-white" />
                                <div>
                                    <h3 className="text-white font-bold">{bot.name}</h3>
                                    <p className="text-white/80 text-xs">{bot.subtitle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    onClick={minimizeChat}
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20 rounded-full"
                                    title="Minimizar chat"
                                    aria-label="Minimizar chat"
                                >
                                    <Minus className="h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={handleToggle}
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20 rounded-full"
                                    title="Cerrar chat"
                                    aria-label="Cerrar chat"
                                >
                                    <X className="h-5 w-5" />
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
                                        className={`max-w-[80%] p-3 rounded-2xl ${
                                            message.sender === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : message.botType === 'error'
                                                ? 'bg-destructive/10 text-destructive border border-destructive/20'
                                                : message.botType === 'system'
                                                ? 'bg-secondary text-foreground border border-border'
                                                : `${bot.color} text-white`
                                        }`}
                                    >
                                        {message.sender === 'bot' && message.botType !== 'system' && message.botType !== 'error' && (
                                            <div className="flex items-center gap-2 mb-1 opacity-80">
                                                <AiRobotIcon className="h-4 w-4" />
                                                <span className="text-xs font-semibold">{bot.name}</span>
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
                                        {message.advisorUrl && (
                                            <a
                                                href={message.advisorUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                                            >
                                                <WhatsAppIcon className="h-4 w-4" />
                                                Hablar con asesor por WhatsApp
                                            </a>
                                        )}
                                    </div>
                                    {message.sender === 'user' && (
                                        <span className="mt-1 mr-2 text-[10px] leading-none text-muted-foreground/70">
                                            Entregado
                                        </span>
                                    )}
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className={`${bot.color} text-white px-4 py-3 rounded-2xl flex items-center gap-1.5`} aria-label="El asistente está escribiendo">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.24s]" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.12s]" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-bounce" />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-border bg-secondary">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={`Pregunta sobre productos Fuxion...`}
                                    className="flex-1 bg-card border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="rounded-full"
                                    disabled={!input.trim() || isLoading}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                ⚠️ No soy médico. Solo proporciono información de productos Fuxion.
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FalconBot;
