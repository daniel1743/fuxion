import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

// Iconos por defecto (puedes reemplazar con los de tu librería)
const DefaultIcons = {
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  ),
  password: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  phone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  eye: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  spinner: (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  ),
};

const PremiumInput = forwardRef(
  (
    {
      // Tipo de input
      type = 'text',
      // Elemento HTML: 'input' | 'textarea'
      as = 'input',
      // Valor
      value,
      onChange,
      // Labels y placeholders
      label,
      placeholder,
      floatingLabel = true,
      // Estados
      error,
      success,
      loading,
      disabled,
      // Iconos
      icon,
      iconPosition = 'left',
      // Botón de limpiar
      clearable = false,
      onClear,
      // Botón de mostrar/ocultar contraseña
      showPasswordToggle = true,
      // Clases personalizadas
      className,
      inputClassName,
      labelClassName,
      errorClassName,
      // Mensajes personalizados
      loadingMessage = 'Cargando...',
      successMessage,
      // Ref
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);
    const typingTimeout = useRef(null);

    // Determinar el tipo real del input
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Actualizar hasValue cuando cambie value
    useEffect(() => {
      setHasValue(!!value && value.length > 0);
    }, [value]);

    // Manejar foco
    const handleFocus = (e) => {
      setIsFocused(true);
      if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      if (props.onBlur) props.onBlur(e);
    };

    // Manejar escritura para microinteracción
    const handleChange = (e) => {
      if (onChange) onChange(e);
      setHasValue(!!e.target.value && e.target.value.length > 0);

      // Microinteracción de typing
      setIsTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setIsTyping(false);
      }, 300);
    };

    // Limpiar input
    const handleClear = () => {
      if (onClear) {
        onClear();
      } else {
        // Simular evento de cambio con valor vacío
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(inputRef.current, '');
        const ev = new Event('input', { bubbles: true });
        inputRef.current.dispatchEvent(ev);
        if (onChange) {
          onChange({ target: { value: '' } });
        }
      }
      setHasValue(false);
      inputRef.current?.focus();
    };

    // Determinar icono por defecto según tipo
    const getDefaultIcon = () => {
      if (icon) return icon;
      switch (type) {
        case 'search':
          return DefaultIcons.search;
        case 'email':
          return DefaultIcons.email;
        case 'password':
          return DefaultIcons.password;
        case 'tel':
          return DefaultIcons.phone;
        default:
          return null;
      }
    };

    const currentIcon = getDefaultIcon();

    // Clases dinámicas
    const containerClasses = cn(
      'relative w-full group',
      className
    );

    const inputClasses = cn(
      // Base
      'w-full px-4 py-3.5 md:py-4',
      'text-base md:text-sm text-gray-800',
      'bg-white/75 backdrop-blur-sm',
      'border border-white/30',
      'rounded-[20px]',
      'shadow-sm',
      'transition-all duration-200 ease-out',
      'outline-none',
      // Placeholder
      'placeholder:text-gray-400/70 placeholder:font-light',
      // Focus
      'focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:shadow-lg focus:shadow-emerald-400/10',
      // Disabled
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/50',
      // Error
      error && 'border-red-300 focus:border-red-400 focus:ring-red-400/20',
      // Success
      success && 'border-emerald-400',
      // Iconos
      iconPosition === 'left' && currentIcon && 'pl-12',
      iconPosition === 'right' && currentIcon && 'pr-12',
      // Botón de limpiar
      clearable && hasValue && 'pr-12',
      // Botón de contraseña
      type === 'password' && showPasswordToggle && 'pr-12',
      // Floating label
      floatingLabel && label && (isFocused || hasValue) && 'pt-6 pb-2',
      // Clases personalizadas
      inputClassName
    );

    const labelClasses = cn(
      'absolute left-4 transition-all duration-200 pointer-events-none select-none',
      'text-gray-500 font-light',
      // Posición flotante
      floatingLabel
        ? isFocused || hasValue
          ? 'top-2 text-xs text-emerald-600'
          : 'top-1/2 -translate-y-1/2 text-base'
        : 'top-1/2 -translate-y-1/2 text-base',
      // Error
      error && (isFocused || hasValue) && 'text-red-500',
      // Clases personalizadas
      labelClassName
    );

    const iconContainerClasses = cn(
      'absolute top-1/2 -translate-y-1/2 transition-all duration-200',
      iconPosition === 'left' ? 'left-4' : 'right-4',
      isFocused ? 'text-emerald-500' : 'text-gray-400',
      error && 'text-red-400',
      success && 'text-emerald-500'
    );

    const clearButtonClasses = cn(
      'absolute right-4 top-1/2 -translate-y-1/2',
      'p-1 rounded-full',
      'text-gray-400 hover:text-gray-600',
      'transition-all duration-150',
      'hover:bg-gray-100/50',
      'focus:outline-none focus:ring-2 focus:ring-emerald-400/30'
    );

    const passwordToggleClasses = cn(
      'absolute right-4 top-1/2 -translate-y-1/2',
      'p-1 rounded-full',
      'text-gray-400 hover:text-gray-600',
      'transition-all duration-150',
      'hover:bg-gray-100/50',
      'focus:outline-none focus:ring-2 focus:ring-emerald-400/30'
    );

    // Animaciones
    const typingAnimation = isTyping
      ? { scale: [1, 1.01, 1], transition: { duration: 0.3 } }
      : {};

    const errorAnimation = {
      initial: { opacity: 0, y: -5 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -5 },
      transition: { duration: 0.2 },
    };

    const successAnimation = {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
      transition: { type: 'spring', stiffness: 500, damping: 30 },
    };

    return (
      <div className={containerClasses}>
        {/* Label flotante */}
        {label && floatingLabel && (
          <label
            htmlFor={props.id || props.name}
            className={labelClasses}
          >
            {label}
          </label>
        )}

        {/* Icono izquierdo */}
        {currentIcon && iconPosition === 'left' && (
          <div className={iconContainerClasses}>
            {currentIcon}
          </div>
        )}

        {/* Input / Textarea */}
        <motion.div
          animate={typingAnimation}
          className="relative"
        >
          {as === 'textarea' ? (
            <textarea
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
              }}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled || loading}
              placeholder={
                floatingLabel && label
                  ? isFocused || hasValue
                    ? ''
                    : placeholder || ''
                  : placeholder
              }
              className={cn(inputClasses, 'resize-none min-h-[100px]')}
              aria-invalid={!!error}
              aria-describedby={error ? `${props.id || props.name}-error` : undefined}
              {...props}
            />
          ) : (
            <input
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
              }}
              type={inputType}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled || loading}
              placeholder={
                floatingLabel && label
                  ? isFocused || hasValue
                    ? ''
                    : placeholder || ''
                  : placeholder
              }
              className={inputClasses}
              aria-invalid={!!error}
              aria-describedby={error ? `${props.id || props.name}-error` : undefined}
              {...props}
            />
          )}
        </motion.div>

        {/* Icono derecho (search, email, etc.) */}
        {currentIcon && iconPosition === 'right' && (
          <div className={iconContainerClasses}>
            {currentIcon}
          </div>
        )}

        {/* Botón de limpiar */}
        {clearable && hasValue && !disabled && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className={clearButtonClasses}
            aria-label="Limpiar campo"
            tabIndex={-1}
          >
            {DefaultIcons.close}
          </button>
        )}

        {/* Botón de mostrar/ocultar contraseña */}
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={passwordToggleClasses}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
          >
            {showPassword ? DefaultIcons.eyeOff : DefaultIcons.eye}
          </button>
        )}

        {/* Indicador de carga */}
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
            {DefaultIcons.spinner}
          </div>
        )}

        {/* Indicador de éxito */}
        <AnimatePresence>
          {success && !loading && (
            <motion.div
              key="success-icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"
              {...successAnimation}
            >
              {DefaultIcons.check}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mensaje de error premium */}
        <AnimatePresence>
          {error && (
            <motion.p
              key="error-message"
              id={`${props.id || props.name}-error`}
              className={cn(
                'mt-2 text-sm text-red-500/80 font-light flex items-center gap-1.5',
                errorClassName
              )}
              {...errorAnimation}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Mensaje de éxito premium */}
        <AnimatePresence>
          {successMessage && success && !error && (
            <motion.p
              key="success-message"
              className="mt-2 text-sm text-emerald-600/80 font-light flex items-center gap-1.5"
              {...errorAnimation}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {successMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Mensaje de carga */}
        {loading && loadingMessage && (
          <p className="mt-2 text-sm text-gray-400 font-light flex items-center gap-1.5">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            {loadingMessage}
          </p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';

export default PremiumInput;
