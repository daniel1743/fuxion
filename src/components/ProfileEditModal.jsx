import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { uploadSiteMedia } from '@/services/siteAdminService';

const ProfileEditModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setAvatarUrl(user.avatar || '');
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFile = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadSiteMedia(file, 'perfiles');
      setAvatarUrl(url);
      toast({
        title: 'Foto cargada',
        description: 'La imagen fue optimizada y lista para guardar.',
      });
    } catch (error) {
      toast({
        title: 'No se pudo subir la foto',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    const result = await updateProfile({ name, avatarUrl });
    setLoading(false);

    if (result.success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>Actualiza tu nombre visible y foto de cuenta.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-4">

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="mx-auto flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-border sm:mx-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name || 'Perfil'} className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <Label className="mb-2 block">Foto de perfil</Label>
            <Input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-name">Nombre</Label>
          <Input
            id="profile-name"
            value={name}
            disabled={loading}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre"
            required
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar
          </Button>
        </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
