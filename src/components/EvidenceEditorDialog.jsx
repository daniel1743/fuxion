import React, { useEffect, useState } from 'react';
import { Image, Loader2, Mic, Save, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { saveEvidencePost, uploadSiteMedia } from '@/services/siteAdminService';

const emptyForm = {
  id: '',
  title: '',
  description: '',
  image_url: '',
  audio_url: '',
  is_published: true,
};

const EvidenceEditorDialog = ({ open, onOpenChange, post, user, isAdmin, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(post ? {
      id: post.id,
      title: post.title || '',
      description: post.description || '',
      image_url: post.image_url || '',
      audio_url: post.audio_url || '',
      is_published: post.is_published !== false,
    } : emptyForm);
  }, [open, post]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleFile = async (field, file) => {
    if (!file) return;
    setUploading(field);

    try {
      const folder = field === 'image_url' ? 'evidencias/imagenes' : 'evidencias/audios';
      const url = await uploadSiteMedia(file, folder);
      updateField(field, url);
      toast({ title: field === 'image_url' ? 'Imagen cargada' : 'Audio cargado' });
    } catch (error) {
      toast({
        title: 'No se pudo subir el archivo',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id) {
      toast({
        title: 'Debes iniciar sesión',
        description: 'La propiedad de una evidencia requiere una cuenta autenticada.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      await saveEvidencePost(form, user);
      toast({
        title: form.id ? 'Evidencia actualizada' : 'Evidencia publicada',
        description: form.id ? 'Tus cambios quedaron guardados.' : 'Ahora puedes editarla o eliminarla desde esta página.',
      });
      onOpenChange(false);
      await onSaved?.();
    } catch (error) {
      toast({
        title: 'No se pudo guardar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? 'Editar evidencia' : 'Compartir evidencia'}</DialogTitle>
          <DialogDescription>
            {form.id
              ? 'Puedes cambiar el texto, reemplazar archivos o retirar los actuales.'
              : 'La publicación quedará vinculada a tu cuenta y solo tú o el administrador podrán modificarla.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="evidence-title">Título</Label>
            <Input
              id="evidence-title"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="evidence-description">Texto de la evidencia</Label>
              <span className="text-xs text-muted-foreground">{form.description.length}/3000</span>
            </div>
            <Textarea
              id="evidence-description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              maxLength={3000}
              rows={9}
              className="min-h-[190px] resize-y"
              placeholder="Cuenta la experiencia con el detalle que consideres necesario..."
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <MediaField
              label="Imagen"
              icon={Image}
              accept="image/*"
              value={form.image_url}
              loading={uploading === 'image_url'}
              onFile={(file) => handleFile('image_url', file)}
              onRemove={() => updateField('image_url', '')}
            />
            <MediaField
              label="Audio"
              icon={Mic}
              accept="audio/*"
              value={form.audio_url}
              loading={uploading === 'audio_url'}
              onFile={(file) => handleFile('audio_url', file)}
              onRemove={() => updateField('audio_url', '')}
            />
          </div>

          {isAdmin && (
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(event) => updateField('is_published', event.target.checked)}
              />
              Publicación visible para todos
            </label>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || Boolean(uploading)}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const MediaField = ({ label, icon: Icon, accept, value, loading, onFile, onRemove }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="rounded-lg border border-border p-3">
      <div className="mb-3 flex min-h-20 items-center justify-center overflow-hidden rounded-md bg-muted">
        {value && accept.startsWith('image') ? (
          <img src={value} alt="" className="h-28 w-full object-cover" />
        ) : value && accept.startsWith('audio') ? (
          <audio src={value} controls className="w-full" />
        ) : (
          <Icon className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <Input type="file" accept={accept} disabled={loading} onChange={(event) => onFile(event.target.files?.[0])} />
      {loading && <p className="mt-2 text-xs text-muted-foreground">Subiendo archivo...</p>}
      {value && (
        <Button type="button" variant="ghost" size="sm" className="mt-2 text-destructive" onClick={onRemove}>
          <Trash2 className="mr-2 h-4 w-4" /> Quitar {label.toLowerCase()}
        </Button>
      )}
    </div>
  </div>
);

export default EvidenceEditorDialog;

