import React, { useEffect, useState } from 'react';
import { Image, Loader2, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { uploadSiteMedia } from '@/services/siteAdminService';
import { saveWellnessArticle, WELLNESS_CATEGORIES } from '@/services/wellnessArticleService';

const emptyArticle = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  category: 'Bienestar',
  image_url: '',
  is_published: true,
};

const WellnessArticleEditor = ({ open, onOpenChange, article, editor, onSaved }) => {
  const [form, setForm] = useState(emptyArticle);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(article ? {
      id: article.id,
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'Bienestar',
      image_url: article.image_url || '',
      is_published: article.is_published !== false,
    } : emptyArticle);
  }, [open, article]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadSiteMedia(file, 'bienestar/articulos');
      setField('image_url', url);
      toast({ title: 'Imagen cargada' });
    } catch (error) {
      toast({ title: 'No se pudo subir la imagen', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveWellnessArticle(form, editor);
      toast({ title: form.id ? 'Artículo actualizado' : 'Artículo publicado' });
      onOpenChange(false);
      await onSaved?.();
    } catch (error) {
      toast({ title: 'No se pudo guardar', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? 'Editar artículo' : 'Nuevo artículo de Bienestar'}</DialogTitle>
          <DialogDescription>
            El editor se asigna automáticamente al administrador que publica.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-3 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="wellness-title">Título</Label>
            <Input id="wellness-title" value={form.title} onChange={(e) => setField('title', e.target.value)} maxLength={160} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <select
                value={form.category}
                onChange={(e) => setField('category', e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {WELLNESS_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Editor</Label>
              <Input value={article?.editor_name || editor?.name || editor?.email || 'Administrador'} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between gap-3">
              <Label htmlFor="wellness-excerpt">Bajada editorial</Label>
              <span className="text-xs text-muted-foreground">{form.excerpt.length}/500</span>
            </div>
            <Textarea
              id="wellness-excerpt"
              value={form.excerpt}
              onChange={(e) => setField('excerpt', e.target.value)}
              maxLength={500}
              placeholder="Resumen breve que aparecerá en la portada..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Imagen principal</Label>
            {form.image_url ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img src={form.image_url} alt="" className="h-52 w-full object-cover" />
                <Button type="button" variant="destructive" size="sm" className="absolute right-3 top-3" onClick={() => setField('image_url', '')}>
                  <Trash2 className="mr-2 h-4 w-4" /> Quitar
                </Button>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted">
                <Image className="h-9 w-9 text-muted-foreground" />
              </div>
            )}
            <Input type="file" accept="image/*" disabled={uploading} onChange={(e) => uploadImage(e.target.files?.[0])} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between gap-3">
              <Label htmlFor="wellness-content">Artículo</Label>
              <span className="text-xs text-muted-foreground">{form.content.length}/20000</span>
            </div>
            <Textarea
              id="wellness-content"
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
              maxLength={20000}
              rows={16}
              className="min-h-[320px] resize-y"
              placeholder="Escribe el artículo completo. Puedes separar los párrafos con líneas en blanco."
              required
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setField('is_published', e.target.checked)} />
            Publicar inmediatamente
          </label>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar artículo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WellnessArticleEditor;

