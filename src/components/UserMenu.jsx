
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
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserIcon,
  Logout01Icon,
  Settings01Icon,
  Sun01Icon,
  MoonIcon,
  ComputerIcon,
  Shield01Icon,
  GiftIcon,
} from '@hugeicons/core-free-icons';
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
        <HugeiconsIcon icon={UserIcon} />
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
          <DropdownMenuItem onSelect={openAdminPanel} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150 shrink-0">
              <HugeiconsIcon icon={Shield01Icon} className="h-4 w-4" />
            </div>
            <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-150">Panel de administración</span>
          </DropdownMenuItem>
        )}
        {(isAuthenticated || isAdmin) && (
          <DropdownMenuItem onSelect={() => window.setTimeout(() => navigate('/cuenta'), 0)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150 shrink-0">
              <HugeiconsIcon icon={GiftIcon} className="h-4 w-4" />
            </div>
            <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-150">Mi cuenta y regalos</span>
          </DropdownMenuItem>
        )}
        {isAuthenticated && (
          <DropdownMenuItem onSelect={openProfileModal} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150 shrink-0">
              <HugeiconsIcon icon={Settings01Icon} className="h-4 w-4" />
            </div>
            <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-150">Editar perfil</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150 shrink-0 relative">
              <HugeiconsIcon icon={Sun01Icon} className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <HugeiconsIcon icon={MoonIcon} className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
            <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-150">Cambiar Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-emerald-100 dark:border-emerald-900/30 p-3">
              <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150 shrink-0">
                  <HugeiconsIcon icon={Sun01Icon} className="h-4 w-4" />
                </div>
                <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-150">Claro</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150 shrink-0">
                  <HugeiconsIcon icon={MoonIcon} className="h-4 w-4" />
                </div>
                <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-150">Oscuro</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150 shrink-0">
                  <HugeiconsIcon icon={ComputerIcon} className="h-4 w-4" />
                </div>
                <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-150">Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() => {
            if (isAdmin) logoutAdmin();
            if (isAuthenticated) logoutUser();
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/45 text-rose-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-150 shrink-0">
            <HugeiconsIcon icon={Logout01Icon} className="h-4 w-4" />
          </div>
          <span className="group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors duration-150">Cerrar sesión</span>
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
