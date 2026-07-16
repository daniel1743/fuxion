
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Leaf, Loader2 } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useAdmin } from '@/context/AdminContext';

const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    register,
    requestPasswordReset,
    updatePassword,
    isPasswordRecovery,
  } = useAuth();
  const { refreshAdminAccess } = useAdmin();
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [showResetRequest, setShowResetRequest] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const resetFeedback = () => {
    setFormError('');
    setFormMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetFeedback();
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const result = await login(cleanEmail, password);

    if (!result.success) {
      setFormError(result.error || 'No se pudo iniciar sesión.');
    } else {
      await refreshAdminAccess(cleanEmail);
      closeAuthModal();
      setEmail('');
      setPassword('');
    }

    setIsSubmitting(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetFeedback();
    setIsSubmitting(true);

    const result = await register(registerData);
    if (!result.success) {
      setFormError(result.error || 'No se pudo crear la cuenta.');
    } else if (result.needsConfirmation) {
      setFormMessage('Cuenta creada. Revisa tu correo para confirmar el acceso.');
    }

    setIsSubmitting(false);
  };

  const handleResetRequest = async () => {
    resetFeedback();
    setIsSubmitting(true);
    const result = await requestPasswordReset(email);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error || 'No se pudo enviar el enlace.');
      return;
    }

    setFormMessage('Revisa tu correo. Abre el enlace recibido para crear una contraseña nueva.');
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    resetFeedback();
    setIsSubmitting(true);
    const result = await updatePassword(newPassword);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error || 'No se pudo cambiar la contraseña.');
      return;
    }

    await refreshAdminAccess();
    setNewPassword('');
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="bg-card border-border p-0 max-w-md">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/hoja-te-transparente.svg"
              alt={settings.site_name}
              className="h-7 w-7 rounded-full object-contain bg-transparent"
            />
            <DialogTitle className="text-2xl font-bold text-foreground">{settings.site_name}</DialogTitle>
          </div>
          <DialogDescription>
            Accede para guardar tu experiencia en este dispositivo. Los pedidos se siguen coordinando por WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          {isPasswordRecovery ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>
              {formError && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar contraseña
              </Button>
            </form>
          ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={resetFeedback}>Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register" onClick={resetFeedback}>Registrarse</TabsTrigger>
            </TabsList>
            {formError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}
            {formMessage && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {formMessage}
              </div>
            )}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => { if (e.target.value && !e.target.checkValidity()) setFormError('El correo ingresado no es válido'); else setFormError(''); }} className="[&:not(:placeholder-shown):invalid]:border-red-500 [&:not(:placeholder-shown):invalid]:ring-red-500 [&:not(:placeholder-shown):valid]:border-emerald-500" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={(e) => { if (e.target.value.length > 0 && e.target.value.length < 6) setFormError('La contraseña debe tener al menos 6 caracteres'); else setFormError(''); }}
                      className="pr-11 [&:not(:placeholder-shown):invalid]:border-red-500 [&:not(:placeholder-shown):valid]:border-emerald-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((current) => !current)}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                      aria-label={showLoginPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowResetRequest((current) => !current)}
                  className="w-full text-sm"
                >
                  ¿Olvidaste o no funciona tu contraseña?
                </Button>
                {showResetRequest && (
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <p className="mb-3 text-sm text-muted-foreground">
                      Enviaremos un enlace de recuperación al email escrito arriba.
                    </p>
                    <Button type="button" variant="outline" className="w-full" disabled={isSubmitting || !email.trim()} onClick={handleResetRequest}>
                      Enviar enlace de recuperación
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="register-first-name">Nombre *</Label>
                    <Input
                      id="register-first-name"
                      autoComplete="given-name"
                      placeholder="Juan"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-last-name">Apellido *</Label>
                    <Input
                      id="register-last-name"
                      autoComplete="family-name"
                      placeholder="Pérez"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@ejemplo.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    onBlur={(e) => { if (e.target.value && !e.target.checkValidity()) setFormError('El correo ingresado no es válido'); else setFormError(''); }}
                    className="[&:not(:placeholder-shown):invalid]:border-red-500 [&:not(:placeholder-shown):valid]:border-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="pr-11"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword((current) => !current)}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                      aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
