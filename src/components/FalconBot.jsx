
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { sendMessageToDeepSeek } from '@/services/deepseekService';

const FalconBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const bot = {
        name: 'Fuxion Assistant',
        subtitle: 'Asesor integral',
        color: 'bg-purple-500',
        greeting: '¡Hola! Soy tu Fuxion Assistant. Puedo ayudarte a elegir productos, resolver dudas de uso y recomendar opciones según tu objetivo. ¿Qué estás buscando mejorar hoy?'
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        setMessages(prev => [...prev, {
            sender: 'user',
            text: userMessage
        }]);

        setIsLoading(true);

        try {
            const conversationHistory = messages
                .filter(m => m.sender && m.botType !== 'system')
                .slice(-5);

            const response = await sendMessageToDeepSeek(
                userMessage,
                'unificado',
                conversationHistory
            );

            setMessages(prev => [...prev, {
                sender: 'bot',
                text: response.text,
                botType: 'assistant',
                apiUsed: response.apiUsed
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
                botType: 'error'
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
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={handleToggle}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow group"
                    >
                        <Bot className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                    </motion.button>
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
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bot className="h-6 w-6 text-white" />
                                <div>
                                    <h3 className="text-white font-bold">{bot.name}</h3>
                                    <p className="text-white/80 text-xs">{bot.subtitle}</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleToggle}
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Mensajes */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
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
                                                <Bot className="h-4 w-4" />
                                                <span className="text-xs font-semibold">{bot.name}</span>
                                            </div>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className={`${bot.color} text-white p-3 rounded-2xl flex items-center gap-2`}>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm">Pensando...</span>
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
                            <p className="text-xs text-muted-foreground text-center opacity-70">
                                Powered by DeepSeek AI
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FalconBot;
