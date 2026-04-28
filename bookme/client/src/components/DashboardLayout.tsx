import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { usePlan } from '@/hooks/usePlan';
import {
  Menu, X, LogOut, Settings, Home, Calendar, Users, Briefcase,
  CreditCard, TrendingUp, Search, Bell, Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Calendário', href: '/dashboard/calendar', icon: Calendar },
  { label: 'Clientes', href: '/dashboard/clients', icon: Users },
  { label: 'Serviços', href: '/dashboard/services', icon: Briefcase },
  { label: 'Staff', href: '/dashboard/staff', icon: Users },
  { label: 'Relatórios', href: '/dashboard/reports', icon: TrendingUp },
  { label: 'Faturação', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Configurações', href: '/dashboard/settings', icon: Settings },
];

const PLAN_BADGES: Record<string, { label: string; cls: string }> = {
  free: { label: 'Grátis', cls: 'bg-card border border-border text-foreground/60' },
  pro: { label: 'Pro', cls: 'bg-blue-500/20 border border-blue-500/30 text-blue-400' },
  business: { label: 'Business', cls: 'bg-purple-500/20 border border-purple-500/30 text-purple-400' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, business, signOut } = useAuth() as any;
  const { plan } = usePlan();
  const [location, navigate] = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const badge = PLAN_BADGES[plan] || PLAN_BADGES.free;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-card border-r border-border transition-all duration-300 flex flex-col flex-shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4 gap-2">
          {sidebarOpen && (
            <a href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                BookMe
              </span>
            </a>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-background rounded-lg transition-colors text-foreground/60 hover:text-foreground ml-auto"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Plan Badge */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
                {badge.label}
              </span>
              {plan === 'free' && (
                <a href="/dashboard/billing" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <Zap size={10} />
                  Upgrade
                </a>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== '/dashboard' && location.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                    : 'text-foreground/60 hover:text-foreground hover:bg-background'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-border">
          {sidebarOpen && (
            <div className="px-2 py-1.5 mb-2">
              <p className="text-xs text-foreground/50 truncate">{user?.email}</p>
              <p className="text-sm font-medium text-white truncate">{business?.name || 'Negócio'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Sair' : undefined}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background transition-colors text-foreground/60 hover:text-red-400 text-sm"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border px-6 flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Pesquisar clientes, serviços..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-background border border-border text-sm text-white placeholder-foreground/40 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications placeholder */}
            <button className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors">
              <Bell size={18} />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
              {(user?.email || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
