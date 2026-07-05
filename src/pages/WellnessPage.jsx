import React, { useEffect, useMemo, useState } from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Edit3, FileText, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import WellnessArticleEditor from '@/components/WellnessArticleEditor';
import {
  deleteWellnessArticle,
  fetchWellnessArticles,
  WELLNESS_CATEGORIES,
} from '@/services/wellnessArticleService';

const WellnessPage = () => {
  const { isAdmin, adminData } = useAdmin();
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deletingId, setDeletingId] = useState('');
  const adminEmail = (user?.email || adminData?.email || '').toLowerCase();
  const isMainAdmin = isAdmin && adminEmail === 'falcondaniel37@gmail.com';
  const editor = user || (adminData ? { name: adminData.nombre_completo, email: adminData.email } : null);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await fetchWellnessArticles({ includeDrafts: isAdmin });
      setArticles(data);
    } catch (error) {
      console.warn('No se pudieron cargar artículos de Bienestar:', error.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [isAdmin]);

  const visibleArticles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return articles.filter((article) => {
      if (!isAdmin && !article.is_published) return false;
      const categoryMatches = category === 'Todas' || article.category === category;
      const textMatches = !term || [article.title, article.excerpt, article.content, article.editor_name]
        .some((value) => value?.toLowerCase().includes(term));
      return categoryMatches && textMatches;
    });
  }, [articles, category, search, isAdmin]);

  const featured = visibleArticles[0];
  const remaining = visibleArticles.slice(1);
  const canManage = (article) => isMainAdmin || (isAdmin && user?.id && article.owner_user_id === user.id);

  const openCreate = () => {
    setEditingArticle(null);
    setEditorOpen(true);
  };

  const openEdit = (article) => {
    if (!canManage(article)) return;
    setEditingArticle(article);
    setEditorOpen(true);
  };

  const remove = async (article) => {
    if (!canManage(article) || !window.confirm(`¿Eliminar "${article.title}"?`)) return;
    setDeletingId(article.id);
    try {
      await deleteWellnessArticle(article.id);
      setArticles((current) => current.filter((item) => item.id !== article.id));
      toast({ title: 'Artículo eliminado' });
    } catch (error) {
      toast({ title: 'No se pudo eliminar', description: error.message, variant: 'destructive' });
    } finally {
      setDeletingId('');
    }
  };

  return (
    <main className="min-h-screen bg-background pb-20 pt-24">
      <SEO
        title="Bienestar — Artículos y Hábitos Saludables"
        description="Artículos sobre belleza, bienestar, nutrición, ejercicio, salud digestiva, hepática y hábitos saludables."
        canonical="/opiniones"
      />

      <section className="container mx-auto px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4">Editorial de bienestar</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Bienestar para tu día a día</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Información práctica sobre nutrición, ejercicio, belleza, salud digestiva y hábitos que aportan valor más allá de los productos.
          </p>
          {isAdmin && user?.id && (
            <Button className="mt-6" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Publicar artículo
            </Button>
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título, tema o editor..." className="pl-9" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:min-w-52">
            <option>Todas</option>
            {WELLNESS_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>
        ) : !featured ? (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-border p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold">No hay artículos para este filtro</h2>
          </div>
        ) : (
          <>
            <ArticleFeatured article={featured} canManage={canManage(featured)} onEdit={openEdit} onDelete={remove} deleting={deletingId === featured.id} />
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {remaining.map((article) => (
                <ArticleCard key={article.id} article={article} canManage={canManage(article)} onEdit={openEdit} onDelete={remove} deleting={deletingId === article.id} />
              ))}
            </div>
          </>
        )}
      </section>

      <WellnessArticleEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        article={editingArticle}
        editor={editor}
        onSaved={loadArticles}
      />
    </main>
  );
};

const ManageButtons = ({ article, canManage, onEdit, onDelete, deleting }) => canManage ? (
  <div className="flex gap-2">
    <Button size="icon" variant="secondary" className="h-9 w-9 shadow" onClick={() => onEdit(article)} aria-label="Editar artículo">
      <Edit3 className="h-4 w-4" />
    </Button>
    <Button size="icon" variant="destructive" className="h-9 w-9 shadow" onClick={() => onDelete(article)} disabled={deleting} aria-label="Eliminar artículo">
      {deleting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  </div>
) : null;

const ArticleFeatured = ({ article, ...actions }) => (
  <article className="relative mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-2">
    <div className="min-h-64 bg-muted">
      {article.image_url
        ? <img src={article.image_url} alt={article.title} className="h-full max-h-[440px] w-full object-cover" />
        : <div className="flex h-full min-h-64 items-center justify-center"><FileText className="h-14 w-14 text-muted-foreground" /></div>}
    </div>
    <div className="flex flex-col justify-center p-6 sm:p-10">
      <div className="flex items-start justify-between gap-3">
        <Badge>{article.category}</Badge>
        <ManageButtons article={article} {...actions} />
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-emerald-700">Última publicación</p>
      <h2 className="mt-2 text-3xl font-bold leading-tight">{article.title}</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">{article.excerpt}</p>
      <p className="mt-5 text-sm text-muted-foreground">Por {article.editor_name} · {formatDate(article.published_at || article.created_at)}</p>
      <Link to={`/bienestar/${article.slug}`} className="mt-6"><Button>Leer artículo</Button></Link>
    </div>
  </article>
);

const ArticleCard = ({ article, ...actions }) => (
  <article className="overflow-hidden rounded-2xl border border-border bg-card">
    <div className="relative aspect-[16/10] bg-muted">
      {article.image_url
        ? <img src={article.image_url} alt={article.title} className="h-full w-full object-cover" loading="lazy" />
        : <div className="flex h-full items-center justify-center"><FileText className="h-10 w-10 text-muted-foreground" /></div>}
      <div className="absolute right-3 top-3"><ManageButtons article={article} {...actions} /></div>
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline">{article.category}</Badge>
        {!article.is_published && <Badge variant="secondary">Borrador</Badge>}
      </div>
      <h2 className="mt-4 text-xl font-bold leading-snug">{article.title}</h2>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      <p className="mt-4 text-xs text-muted-foreground">Por {article.editor_name}</p>
      <Link to={`/bienestar/${article.slug}`} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Leer artículo</Link>
    </div>
  </article>
);

const formatDate = (value) => new Date(value).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

export default WellnessPage;

