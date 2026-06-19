import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Gift, PackageCheck, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { GIFT_PRODUCTS } from '@/services/loyaltyService';

const AccountPage = () => {
  const { isAuthenticated, isAuthLoading, user } = useAuth();
  const { account, productsNeeded } = useLoyalty();

  if (isAuthLoading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-24">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-8">
          <p className="text-sm text-muted-foreground">Mi cuenta</p>
          <h1 className="mt-1 text-3xl font-bold">{user.name}</h1>
          <p className="mt-1 text-muted-foreground">{user.email}</p>

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

          <Link to="/explorar" className="mt-8 inline-block">
            <Button>Ver productos</Button>
          </Link>
        </div>
      </div>
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
