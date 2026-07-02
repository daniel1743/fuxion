import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { CalendarCheck, Gift, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { GIFT_PRODUCTS } from '@/services/loyaltyService';
import { useAdmin } from '@/context/AdminContext';
import WellnessPlanDialog from '@/components/WellnessPlanDialog';
import { loadWellnessPlan } from '@/services/wellnessPlanService';

const AccountPage = () => {
  const { isAuthLoading, user } = useAuth();
  const { adminData } = useAdmin();
  const { account, orders, productsNeeded, isEligible } = useLoyalty();
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [wellnessPlan, setWellnessPlan] = useState(null);
  const displayName = user?.name || adminData?.nombre_completo || 'Daniel Falcon';
  const displayEmail = user?.email || adminData?.email || 'falcondaniel37@gmail.com';
  const planIdentity = user?.id || adminData?.email || displayEmail;

  useEffect(() => {
    setWellnessPlan(loadWellnessPlan(planIdentity));
  }, [planIdentity]);

  if (isAuthLoading) return null;
  if (!isEligible) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-24">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-8">
          <p className="text-sm text-muted-foreground">Mi cuenta</p>
          <h1 className="mt-1 text-3xl font-bold">{displayName}</h1>
          <p className="mt-1 text-muted-foreground">{displayEmail}</p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900 dark:from-emerald-950/40 dark:to-card sm:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="h-4 w-4" /> Orientación personalizada
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {wellnessPlan ? 'Tu plan de bienestar está listo' : 'Crea tu plan de bienestar de 4 semanas'}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Rutina, alimentación general, hidratación y seguimiento semanal según tu objetivo. Los productos aparecen únicamente como apoyo opcional.
                </p>
              </div>
              <Button className="shrink-0" onClick={() => setIsPlanOpen(true)}>
                <CalendarCheck className="mr-2 h-4 w-4" />
                {wellnessPlan ? 'Ver mi plan' : 'Crear mi plan'}
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat icon={PackageCheck} label="Productos acumulados" value={account.total_products} />
            <Stat icon={Gift} label="Regalos disponibles" value={account.available_rewards} />
            <Stat icon={ShoppingBag} label="Regalos elegidos" value={account.redeemed_rewards} />
          </div>

          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-emerald-900 dark:text-emerald-100">Camino a tu próximo regalo</h2>
                <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                  Llevas {account.progress_products} de 4 productos.
                  {account.available_rewards > 0
                    ? ` Tienes ${account.available_rewards} regalo${account.available_rewards === 1 ? '' : 's'} disponible${account.available_rewards === 1 ? '' : 's'}.`
                    : ` Compra ${productsNeeded} más para obtener uno gratis.`}
                </p>
              </div>
              <Gift className="h-9 w-9 shrink-0 text-emerald-700" />
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-emerald-200">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{ width: `${(account.progress_products / 4) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="mt-8 text-xl font-bold">Regalos disponibles para elegir</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {GIFT_PRODUCTS.map((gift) => (
              <div key={gift.id} className="rounded-xl border border-border bg-background p-3 text-center">
                <img src={gift.image} alt={gift.name} className="mx-auto h-24 w-24 object-contain" />
                <p className="mt-2 text-sm font-semibold">{gift.name}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-bold">Compras recientes</h2>
          <div className="mt-4 space-y-3">
            {orders.length > 0 ? orders.slice(0, 5).map((order) => (
              <div key={order.id} className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString('es-CL')}
                </p>
                <p className="mt-1 font-semibold">
                  {(order.products || []).map((product) => `${product.name} x${product.quantity}`).join(', ') || `${order.product_quantity} productos`}
                </p>
                {order.gift_product && (
                  <p className="mt-1 text-sm text-amber-700">Regalo: {order.gift_product}</p>
                )}
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Tu historial aparecerá aquí después de enviar un pedido.
              </p>
            )}
          </div>

          <Link to="/explorar" className="mt-8 inline-block">
            <Button>Ver productos</Button>
          </Link>
        </div>
      </div>

      <WellnessPlanDialog
        open={isPlanOpen}
        onOpenChange={setIsPlanOpen}
        identity={planIdentity}
        name={displayName}
        onPlanChange={setWellnessPlan}
      />
    </main>
  );
};

const Stat = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-border bg-background p-4">
    <Icon className="h-5 w-5 text-primary" />
    <p className="mt-3 text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default AccountPage;
