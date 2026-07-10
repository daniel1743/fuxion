
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeProvider';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Sun, Moon, Monitor, Shield, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '@/components/admin/AdminPanel';
import ProfileEditModal from '@/components/ProfileEditModal';

const UserMenu = () => {
  const { isAuthenticated, user, logout: logoutUser, openAuthModal } = useAuth();
  const { isAdmin, logout: logoutAdmin } = useAdmin();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [showAdminPanel, setShowAdminPanel] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);

  const openAdminPanel = () => {
    window.setTimeout(() => setShowAdminPanel(true), 0);
  };

  const openProfileModal = () => {
    window.setTimeout(() => setShowProfileModal(true), 0);
  };

  if (!isAuthenticated && !isAdmin) {
    return (
      <Button variant="ghost" size="icon" onClick={openAuthModal} className="text-muted-foreground">
        <User />
      </Button>
    );
  }

  const displayUser = user || {
    name: 'Daniel Falcon',
    email: 'falcondaniel37@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  };

  const avatar = (
    <span className="block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
      <img
        className="block h-full w-full max-w-none object-cover object-center"
        src={displayUser.avatar}
        alt={displayUser.name}
        loading="lazy"
      />
    </span>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 overflow-hidden rounded-full p-0">
          {avatar}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-emerald-100 dark:border-emerald-900/30 p-3" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            {avatar}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-none">{displayUser.name}</p>
              <p className="mt-1 truncate text-xs leading-none text-muted-foreground">
                {displayUser.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        {isAdmin && (
          <DropdownMenuItem onSelect={openAdminPanel} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
              <Shield className="h-4 w-4" />
            </div>
            <span>Panel de administración</span>
          </DropdownMenuItem>
        )}
        {(isAuthenticated || isAdmin) && (
          <DropdownMenuItem onSelect={() => window.setTimeout(() => navigate('/cuenta'), 0)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
              <Gift className="h-4 w-4" />
            </div>
            <span>Mi cuenta y regalos</span>
          </DropdownMenuItem>
        )}
        {isAuthenticated && (
          <DropdownMenuItem onSelect={openProfileModal} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
              <Settings className="h-4 w-4" />
            </div>
            <span>Editar perfil</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
            <span>Cambiar Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-emerald-100 dark:border-emerald-900/30 p-3">
              <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                  <Sun className="h-4 w-4" />
                </div>
                <span>Claro</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                  <Moon className="h-4 w-4" />
                </div>
                <span>Oscuro</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                  <Monitor className="h-4 w-4" />
                </div>
                <span>Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() => {
            if (isAdmin) logoutAdmin();
            if (isAuthenticated) logoutUser();
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      {showAdminPanel && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
      {showProfileModal && (
        <ProfileEditModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </DropdownMenu>
  );
};

export default UserMenu;
