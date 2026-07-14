import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Image, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useBlog } from '@/context/BlogContext';

const BlogAdminPanel = ({ isOpen, onClose }) => {
  const { categories, createPost, updatePost, deletePost, fetchAllPosts } = useBlog();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: categories[0]?.name || 'Bienestar',
    image_url: '',
    author: 'Equipo Fuxion',
    is_published: false,
  });

  // Cargar posts al abrir
  useEffect(() => {
    if (isOpen) {
      loadPosts();
    }
  }, [isOpen]);

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchAllPosts();
    setPosts(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: categories[0]?.name || 'Bienestar',
      image_url: '',
      author: 'Equipo Fuxion',
      is_published: false,
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image_url: post.image_url || '',
      author: post.author || 'Equipo Fuxion',
      is_published: post.is_published,
    });
    setEditingPost(post);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (editingPost) {
        result = await updatePost(editingPost.id, formData);
      } else {
        result = await createPost(formData);
      }

      if (result.success) {
        toast({
          title: editingPost ? 'Artículo actualizado' : 'Artículo creado',
          description: editingPost
            ? 'El artículo ha sido actualizado correctamente.'
            : 'El artículo ha sido creado correctamente.',
        });
        resetForm();
        await loadPosts();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'No se pudo guardar el artículo.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al guardar el artículo.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    const result = await deletePost(post.id);

    if (result.success) {
      toast({
        title: 'Artículo eliminado',
        description: 'El artículo ha sido eliminado correctamente.',
      });
      await loadPosts();
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el artículo.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  const togglePublish = async (post) => {
    setLoading(true);
    const result = await updatePost(post.id, { is_published: !post.is_published });

    if (result.success) {
      toast({
        title: post.is_published ? 'Artículo despublicado' : 'Artículo publicado',
        description: post.is_published
          ? 'El artículo ya no es visible públicamente.'
          : 'El artículo ahora es visible en el blog.',
      });
      await loadPosts();
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-modal flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Administrar Blog
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Crea y gestiona artículos del blog
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={showForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo artículo
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {showForm ? (
              /* Formulario de creación/edición */
              <motion.form
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingPost ? 'Editar artículo' : 'Nuevo artículo'}
                  </h3>
                  <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Título */}
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Título del artículo</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: 5 Consejos para perder peso de forma saludable"
                      required
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Autor */}
                  <div>
                    <Label htmlFor="author">Autor</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Equipo Fuxion"
                    />
                  </div>

                  {/* URL de imagen */}
                  <div className="md:col-span-2">
                    <Label htmlFor="image_url">URL de imagen (opcional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      {formData.image_url && (
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Usa imágenes de Unsplash o sube tu propia imagen
                    </p>
                  </div>

                  {/* Extracto */}
                  <div className="md:col-span-2">
                    <Label htmlFor="excerpt">Extracto (resumen corto)</Label>
                    <textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Un breve resumen del artículo que aparecerá en la lista del blog..."
                      rows={2}
                      required
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground resize-none"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="md:col-span-2">
                    <Label htmlFor="content">Contenido del artículo</Label>
                    <textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Escribe el contenido del artículo. Puedes usar formato Markdown:&#10;## Subtítulo&#10;**texto en negrita**&#10;- lista&#10;---"
                      rows={12}
                      required
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Soporta Markdown: ## para títulos, **negrita**, - para listas, --- para separadores
                    </p>
                  </div>

                  {/* Publicar */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="w-5 h-5 rounded border-input"
                      />
                      <span className="text-foreground">Publicar inmediatamente</span>
                    </label>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingPost ? 'Guardar cambios' : 'Crear artículo'}
                  </Button>
                </div>
              </motion.form>
            ) : (
              /* Lista de artículos */
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {loading ? (
                  <div className="flex justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No hay artículos
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Crea tu primer artículo para el blog
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear artículo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-background/50 border border-border rounded-lg p-4 flex items-center gap-4"
                      >
                        {/* Imagen */}
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {post.category}
                            </span>
                            <span>{post.views || 0} vistas</span>
                            <span className={post.is_published ? 'text-green-500' : 'text-yellow-500'}>
                              {post.is_published ? 'Publicado' : 'Borrador'}
                            </span>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublish(post)}
                            title={post.is_published ? 'Despublicar' : 'Publicar'}
                          >
                            {post.is_published ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post)}
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(post)}
                            title="Eliminar"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogAdminPanel;
