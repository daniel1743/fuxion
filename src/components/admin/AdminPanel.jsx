import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  CheckCircle2,
  Edit2,
  Eye,
  FileText,
  Image,
  MessageCircle,
  Mic,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Store,
  Trash2,
  Upload,
  User,
  Users,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import {
  deleteAdvisor,
  fetchAdvisorMetrics,
  fetchAdvisors,
  normalizeAdvisorId,
  updateAdvisorStatus,
  upsertAdvisor
} from '@/services/advisorService';
import {
  deleteAdminUser,
  deleteEvidencePost,
  fetchAdminUsers,
  fetchEvidencePosts,
  saveEvidencePost,
  saveSiteSettings,
  updateAdminStatus,
  uploadSiteMedia,
  upsertAdminUser
} from '@/services/siteAdminService';

const emptyAdvisor = {
  id: '',
  name: '',
  whatsapp_url: '',
  whatsapp_number: '',
  photo_url: '',
  instagram_url: '',
  facebook_url: '',
  is_active: true,
  is_default: false,
  notes: ''
};

const AdminPanel = ({ isOpen, onClose }) => {
  const { isAdmin, adminData, refreshAdminAccess } = useAdmin();
  const { user } = useAuth();
  const { settings, setSettings, refreshSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState('advisors');
  const [loading, setLoading] = useState(false);
  const [advisors, setAdvisors] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [evidencePosts, setEvidencePosts] = useState([]);
  const [form, setForm] = useState(emptyAdvisor);
  const [adminForm, setAdminForm] = useState({ email: '', name: '' });
  const [brandingForm, setBrandingForm] = useState(settings);
  const [evidenceForm, setEvidenceForm] = useState({
    id: '',
    title: '',
    description: '',
    image_url: '',
    audio_url: '',
    is_published: true
  });
  const [editingId, setEditingId] = useState(null);
  const currentAdminEmail = (user?.email || adminData?.email || '').toLowerCase();
  const isMainAdmin = currentAdminEmail === 'falcondaniel37@gmail.com';

  const activeCount = useMemo(() => advisors.filter(item => item.is_active).length, [advisors]);
  const totalEvents = useMemo(() => metrics.reduce((sum, item) => sum + item.total, 0), [metrics]);
  const whatsappClicks = useMemo(() => metrics.reduce((sum, item) => sum + item.whatsapp + item.cart, 0), [metrics]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [advisorData, metricData, adminData, evidenceData] = await Promise.all([
        fetchAdvisors(),
        fetchAdvisorMetrics(),
        fetchAdminUsers(),
        fetchEvidencePosts(false)
      ]);
      setAdvisors(advisorData);
      setMetrics(metricData);
      setAdminUsers(adminData);
      setEvidencePosts(
        isMainAdmin
          ? evidenceData
          : evidenceData.filter((post) => user?.id && post.owner_user_id === user.id)
      );
    } catch (error) {
      toast({
        title: 'No se pudo cargar el panel',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadData();
      setBrandingForm(settings);
    }
  }, [isOpen, isAdmin]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setBrandingForm(settings);
  }, [settings]);

  if (!isOpen || !isAdmin) return null;

  const resetForm = () => {
    setForm(emptyAdvisor);
    setEditingId(null);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: field === 'id' ? normalizeAdvisorId(value) : value
    }));
  };

  const handleEdit = (advisor) => {
    setEditingId(advisor.id);
    setForm({
      id: advisor.id || '',
      name: advisor.name || '',
      whatsapp_url: advisor.whatsapp_url || '',
      whatsapp_number: advisor.whatsapp_number || '',
      photo_url: advisor.photo_url || '',
      instagram_url: advisor.instagram_url || '',
      facebook_url: advisor.facebook_url || '',
      is_active: advisor.is_active !== false,
      is_default: Boolean(advisor.is_default),
      notes: advisor.notes || ''
    });
    setActiveTab('advisors');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.id || !form.name) {
      toast({
        title: 'Faltan datos',
        description: 'El ID y el nombre del asesor son obligatorios.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await upsertAdvisor(form);
      toast({
        title: editingId ? 'Asesor actualizado' : 'Asesor creado',
        description: `El ID ${form.id} quedó guardado correctamente.`
      });
      resetForm();
      await loadData();
    } catch (error) {
      toast({
        title: 'No se pudo guardar',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (advisor) => {
    if (advisor.id === 'daniel' && advisor.is_active) {
      toast({
        title: 'Daniel no se puede desactivar',
        description: 'Daniel es el asesor principal por defecto.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await updateAdvisorStatus(advisor.id, !advisor.is_active);
      toast({
        title: advisor.is_active ? 'ID desactivado' : 'ID activado',
        description: `${advisor.name} fue actualizado.`
      });
      await loadData();
    } catch (error) {
      toast({
        title: 'No se pudo actualizar',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (advisor) => {
    if (!window.confirm(`¿Eliminar el ID "${advisor.id}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteAdvisor(advisor.id);
      toast({
        title: 'ID eliminado',
        description: `${advisor.name} fue eliminado de la organización.`
      });
      await loadData();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      await upsertAdminUser(adminForm, user?.email || 'legacy-admin');
      toast({
        title: 'Admin actualizado',
        description: `${adminForm.email} quedó habilitado para acceder al panel.`
      });
      setAdminForm({ email: '', name: '' });
      await loadData();
      await refreshAdminAccess?.();
    } catch (error) {
      toast({
        title: 'No se pudo guardar el admin',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (adminUser) => {
    if (adminUser.email === 'falcondaniel37@gmail.com' && adminUser.is_active) {
      toast({
        title: 'Admin principal protegido',
        description: 'El correo principal no se puede desactivar.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await updateAdminStatus(adminUser.email, !adminUser.is_active);
      await loadData();
      await refreshAdminAccess?.();
    } catch (error) {
      toast({
        title: 'No se pudo actualizar el admin',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminUser) => {
    if (!window.confirm(`¿Quitar el acceso admin a ${adminUser.email}?`)) return;

    setLoading(true);
    try {
      await deleteAdminUser(adminUser.email);
      await loadData();
      await refreshAdminAccess?.();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingFile = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadSiteMedia(file, 'branding');
      setBrandingForm(prev => ({ ...prev, logo_url: url }));
      toast({
        title: 'Logo cargado',
        description: 'La imagen fue optimizada y subida correctamente.'
      });
    } catch (error) {
      toast({
        title: 'No se pudo subir la imagen',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBranding = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      const saved = await saveSiteSettings(brandingForm, user?.email || adminData?.email || 'legacy-admin');
      setSettings(saved);
      await refreshSettings();
      toast({
        title: 'Branding actualizado',
        description: 'El nombre y logo del sitio quedaron guardados.'
      });
    } catch (error) {
      toast({
        title: 'No se pudo guardar branding',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEvidenceFile = async (field, file) => {
    if (!file) return;

    setLoading(true);
    try {
      const folder = field === 'image_url' ? 'evidencias/imagenes' : 'evidencias/audios';
      const url = await uploadSiteMedia(file, folder);
      setEvidenceForm(prev => ({ ...prev, [field]: url }));
      toast({
        title: field === 'image_url' ? 'Imagen cargada' : 'Audio cargado',
        description: 'El archivo quedó disponible para publicar.'
      });
    } catch (error) {
      toast({
        title: 'No se pudo subir el archivo',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetEvidenceForm = () => {
    setEvidenceForm({
      id: '',
      title: '',
      description: '',
      image_url: '',
      audio_url: '',
      is_published: true
    });
  };

  const handleEvidenceEdit = (post) => {
    setEvidenceForm({
      id: post.id,
      title: post.title || '',
      description: post.description || '',
      image_url: post.image_url || '',
      audio_url: post.audio_url || '',
      is_published: post.is_published !== false
    });
    setActiveTab('evidence');
  };

  const handleEvidenceSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      await saveEvidencePost(evidenceForm, user || adminData);
      toast({
        title: evidenceForm.id ? 'Evidencia actualizada' : 'Evidencia publicada',
        description: 'El contenido quedó guardado correctamente.'
      });
      resetEvidenceForm();
      await loadData();
    } catch (error) {
      toast({
        title: 'No se pudo guardar evidencia',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEvidenceDelete = async (post) => {
    if (!window.confirm(`¿Eliminar "${post.title}"?`)) return;

    setLoading(true);
    try {
      await deleteEvidencePost(post.id);
      await loadData();
    } catch (error) {
      toast({
        title: 'No se pudo eliminar evidencia',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const linkFor = (advisorId) => `${window.location.origin}/?asesor=${advisorId}`;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-black/75 p-2 backdrop-blur-sm sm:p-4"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onMouseDown={(event) => event.stopPropagation()}
        className="flex h-[calc(100dvh-16px)] min-h-0 w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:h-[92dvh]"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-3 sm:p-5">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground sm:text-2xl">
              <User className="h-6 w-6 text-primary" />
              Panel de administración
            </h2>
            <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
              Admin principal: falcondaniel37@gmail.com. Gestiona IDs, asesores y métricas esenciales.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="px-2 sm:px-3">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar panel de administración" title="Cerrar">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-2 border-b border-border p-3 sm:gap-3 sm:p-5">
          <div className="min-w-0 rounded-lg border border-border bg-background/60 p-2 sm:p-4">
            <p className="text-xs text-muted-foreground">Asesores activos</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{activeCount}</p>
          </div>
          <div className="min-w-0 rounded-lg border border-border bg-background/60 p-2 sm:p-4">
            <p className="text-xs text-muted-foreground">Eventos registrados</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{totalEvents}</p>
          </div>
          <div className="min-w-0 rounded-lg border border-border bg-background/60 p-2 sm:p-4">
            <p className="text-xs text-muted-foreground">Clicks/pedidos WhatsApp</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{whatsappClicks}</p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-border px-3 py-3 [scrollbar-width:thin] sm:px-5">
          <Button
            variant={activeTab === 'advisors' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('advisors')}
          >
            Asesores e IDs
          </Button>
          <Button
            variant={activeTab === 'admins' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('admins')}
          >
            <Users className="mr-2 h-4 w-4" />
            Admins
          </Button>
          <Button
            variant={activeTab === 'branding' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('branding')}
          >
            <Store className="mr-2 h-4 w-4" />
            Tienda
          </Button>
          <Button
            variant={activeTab === 'evidence' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('evidence')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Evidencias
          </Button>
          <Button
            variant={activeTab === 'metrics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('metrics')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Métricas
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-3 [scrollbar-gutter:stable] sm:p-5">
          {activeTab === 'advisors' ? (
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
              <form onSubmit={handleSubmit} className="min-w-0 space-y-4 rounded-lg border border-border bg-background/50 p-4">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold">
                    {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {editingId ? 'Editar asesor' : 'Agregar nuevo ID'}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    El ID se usa en enlaces como ?asesor=david.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>ID del enlace</Label>
                  <Input
                    value={form.id}
                    onChange={(event) => handleChange('id', event.target.value)}
                    placeholder="david"
                    disabled={Boolean(editingId)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nombre visible</Label>
                  <Input
                    value={form.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    placeholder="David"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>WhatsApp Business URL</Label>
                  <Input
                    value={form.whatsapp_url}
                    onChange={(event) => handleChange('whatsapp_url', event.target.value)}
                    placeholder="https://wa.me/message/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Número WhatsApp</Label>
                  <Input
                    value={form.whatsapp_number}
                    onChange={(event) => handleChange('whatsapp_number', event.target.value)}
                    placeholder="569..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Foto de perfil / logo</Label>
                  <Input
                    value={form.photo_url}
                    onChange={(event) => handleChange('photo_url', event.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={form.instagram_url}
                      onChange={(event) => handleChange('instagram_url', event.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input
                      value={form.facebook_url}
                      onChange={(event) => handleChange('facebook_url', event.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notas internas</Label>
                  <textarea
                    value={form.notes}
                    onChange={(event) => handleChange('notes', event.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    placeholder="Notas para administración"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) => handleChange('is_active', event.target.checked)}
                  />
                  ID activo
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>

              <div className="min-w-0 space-y-3">
                {advisors.map((advisor) => (
                  <div key={advisor.id} className="rounded-lg border border-border bg-background/50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted">
                          {advisor.photo_url ? (
                            <img src={advisor.photo_url} alt={advisor.name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold">{advisor.name}</h4>
                            <Badge variant={advisor.is_active ? 'default' : 'outline'}>
                              {advisor.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
                            {advisor.is_default && <Badge variant="secondary">Principal</Badge>}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">ID: {advisor.id}</p>
                          <p className="mt-1 break-all text-xs text-muted-foreground">{linkFor(advisor.id)}</p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>WhatsApp: {advisor.whatsapp_url || advisor.whatsapp_number || 'No configurado'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => navigator.clipboard.writeText(linkFor(advisor.id))}>
                          Copiar enlace
                        </Button>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => handleEdit(advisor)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => handleToggleStatus(advisor)} disabled={advisor.id === 'daniel' && advisor.is_active}>
                          {advisor.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => handleDelete(advisor)} disabled={advisor.id === 'daniel'}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'admins' ? (
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
              <form onSubmit={handleAdminSubmit} className="min-w-0 space-y-4 rounded-lg border border-border bg-background/50 p-4">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Shield className="h-4 w-4" />
                    Dar acceso admin
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    El usuario debe registrarse primero con ese correo.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Correo</Label>
                  <Input
                    type="email"
                    value={adminForm.email}
                    onChange={(event) => setAdminForm(prev => ({ ...prev, email: event.target.value }))}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={adminForm.name}
                    onChange={(event) => setAdminForm(prev => ({ ...prev, name: event.target.value }))}
                    placeholder="Nombre visible"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Hacer admin
                </Button>
              </form>

              <div className="min-w-0 space-y-3">
                {adminUsers.map((adminUser) => (
                  <div key={adminUser.email} className="rounded-lg border border-border bg-background/50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold">{adminUser.name || adminUser.email}</h4>
                          <Badge variant={adminUser.is_active ? 'default' : 'outline'}>
                            {adminUser.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                          {adminUser.email === 'falcondaniel37@gmail.com' && <Badge variant="secondary">Principal</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{adminUser.email}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          disabled={adminUser.email === 'falcondaniel37@gmail.com' && adminUser.is_active}
                          onClick={() => handleToggleAdmin(adminUser)}
                        >
                          {adminUser.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full sm:w-auto"
                          disabled={adminUser.email === 'falcondaniel37@gmail.com'}
                          onClick={() => handleDeleteAdmin(adminUser)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'branding' ? (
            <form onSubmit={handleSaveBranding} className="mx-auto w-full max-w-2xl space-y-5 rounded-lg border border-border bg-background/50 p-4 sm:p-5">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Store className="h-5 w-5" />
                  Identidad de la tienda
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cambia el nombre visible y el logo redondo del sitio.
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-border">
                  {brandingForm.logo_url ? (
                    <img src={brandingForm.logo_url} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Label className="mb-2 block">Subir logo/foto</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="max-w-full text-xs sm:text-sm"
                    onChange={(event) => handleBrandingFile(event.target.files?.[0])}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Se reduce automáticamente antes de subirla.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nombre del sitio</Label>
                <Input
                  value={brandingForm.site_name || ''}
                  onChange={(event) => setBrandingForm(prev => ({ ...prev, site_name: event.target.value }))}
                  placeholder="Tienda Fuxion"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre del asesor/dueño</Label>
                <Input
                  value={brandingForm.owner_name || ''}
                  onChange={(event) => setBrandingForm(prev => ({ ...prev, owner_name: event.target.value }))}
                  placeholder="Daniel Falcon"
                />
              </div>
              <div className="space-y-2">
                <Label>Frase corta</Label>
                <Input
                  value={brandingForm.tagline || ''}
                  onChange={(event) => setBrandingForm(prev => ({ ...prev, tagline: event.target.value }))}
                  placeholder="Asesoría personalizada en productos Fuxion"
                />
              </div>
              <div className="space-y-2">
                <Label>URL del logo</Label>
                <Input
                  value={brandingForm.logo_url || ''}
                  onChange={(event) => setBrandingForm(prev => ({ ...prev, logo_url: event.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Guardar identidad
              </Button>
            </form>
          ) : activeTab === 'evidence' ? (
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
              <form onSubmit={handleEvidenceSubmit} className="min-w-0 space-y-4 rounded-lg border border-border bg-background/50 p-4">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4" />
                    Publicar evidencia
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Puedes agregar imagen y audio. Todo se publica en la sección Evidencias.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={evidenceForm.title}
                    onChange={(event) => setEvidenceForm(prev => ({ ...prev, title: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <textarea
                    value={evidenceForm.description}
                    onChange={(event) => setEvidenceForm(prev => ({ ...prev, description: event.target.value }))}
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imagen</Label>
                  <Input className="max-w-full text-xs sm:text-sm" type="file" accept="image/*" onChange={(event) => handleEvidenceFile('image_url', event.target.files?.[0])} />
                  {evidenceForm.image_url && <img src={evidenceForm.image_url} alt="Evidencia" className="h-24 w-full rounded-md object-cover" />}
                </div>
                <div className="space-y-2">
                  <Label>Audio</Label>
                  <Input className="max-w-full text-xs sm:text-sm" type="file" accept="audio/*" onChange={(event) => handleEvidenceFile('audio_url', event.target.files?.[0])} />
                  {evidenceForm.audio_url && <audio src={evidenceForm.audio_url} controls className="w-full" />}
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={evidenceForm.is_published}
                    onChange={(event) => setEvidenceForm(prev => ({ ...prev, is_published: event.target.checked }))}
                  />
                  Publicar visible
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Upload className="mr-2 h-4 w-4" />
                    {evidenceForm.id ? 'Actualizar' : 'Publicar'}
                  </Button>
                  {evidenceForm.id && (
                    <Button type="button" variant="outline" onClick={resetEvidenceForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>

              <div className="min-w-0 space-y-3">
                {evidencePosts.map((post) => (
                  <div key={post.id} className="rounded-lg border border-border bg-background/50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                          {post.image_url ? (
                            <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" />
                          ) : (
                            <FileText className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold">{post.title}</h4>
                            <Badge variant={post.is_published ? 'default' : 'outline'}>
                              {post.is_published ? 'Publicado' : 'Borrador'}
                            </Badge>
                            {post.audio_url && <Badge variant="secondary"><Mic className="mr-1 h-3 w-3" /> Audio</Badge>}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => handleEvidenceEdit(post)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => handleEvidenceDelete(post)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.map((item) => (
                <div key={item.advisor.id} className="rounded-lg border border-border bg-background/50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{item.advisor.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {item.advisor.id}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      <Metric label="Visitas" value={item.visits} icon={Eye} />
                      <Metric label="WhatsApp" value={item.whatsapp} icon={MessageCircle} />
                      <Metric label="Pedidos" value={item.cart} icon={CheckCircle2} />
                      <Metric label="IA producto" value={item.products} icon={BarChart3} />
                      <Metric label="Total" value={item.total} icon={BarChart3} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Telegram Test Button */}
              <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">Telegram</h3>
                    <p className="text-sm text-muted-foreground">Probar conexión con Telegram</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/test-telegram', { method: 'POST' });
                        const data = await res.json();
                        if (data.status === 'connected') {
                          toast({
                            title: '✅ Telegram conectado',
                            description: 'Revisa tu Telegram, deberías recibir un mensaje de prueba.'
                          });
                        } else {
                          toast({
                            title: '⚠️ Revisar configuración Telegram',
                            description: data.reason || 'Error desconocido',
                            variant: 'destructive'
                          });
                        }
                      } catch (error) {
                        toast({
                          title: '⚠️ Revisar configuración Telegram',
                          description: error.message,
                          variant: 'destructive'
                        });
                      }
                    }}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Enviar prueba Telegram
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

const Metric = ({ label, value, icon: Icon }) => (
  <div className="rounded-md border border-border bg-card px-3 py-2">
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
    <p className="mt-1 text-lg font-bold">{value}</p>
  </div>
);

export default AdminPanel;
