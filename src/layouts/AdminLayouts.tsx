import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import {
  HeartPulse as Heart, LayoutDashboard, Users, UserCheck, FileText, Building2,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const adminNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Patients', icon: Users, path: '/admin/patients' },
  { label: 'Doctors', icon: UserCheck, path: '/admin/doctors' },
  { label: 'Medical Records', icon: FileText, path: '/admin/medical-records' },
  { label: 'Departments', icon: Building2, path: '/admin/departments' },
];

const adminReports = [
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Reports', icon: FileText, path: '/admin/reports' },
];

const adminSystem = [
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

/**
 * AdminLayout
 * Used for administrative panel pages.
 * Includes specialized Header and Sidebar for admin-specific features.
 */
const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <DashboardHeader title="Admin Panel" />
      <div className="flex flex-1">
        <AdminSidebar
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6 mx-auto max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * AdminSidebar
 * Admin-specific sidebar navigation matching DashboardSidebar style
 */
const AdminSidebar: React.FC<{ collapsed?: boolean; onToggle: () => void }> = ({ collapsed = false, onToggle }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  const NavItem = ({ item }: { item: typeof adminNav[0] }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          isActive(item.path)
            ? 'bg-sidebar-muted text-sidebar-foreground nav-active'
            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-muted/50'
        )}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const SectionLabel = ({ label }: { label: string }) =>
    !collapsed ? (
      <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-3 mt-6 mb-2">
        {label}
      </p>
    ) : (
      <div className="mt-6 mb-2" />
    );

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 flex flex-col border-r border-sidebar-border transition-all duration-300 overflow-hidden',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
      style={{ background: 'var(--gradient-sidebar)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <Heart className="h-7 w-7 text-primary-light shrink-0" fill="currentColor" />
        {!collapsed && <span className="font-display text-lg font-bold text-sidebar-foreground">Admin</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <SectionLabel label="Main" />
        {adminNav.map((item) => <NavItem key={item.path} item={item} />)}

        <SectionLabel label="Reports" />
        {adminReports.map((item) => <NavItem key={item.path} item={item} />)}

        <SectionLabel label="System" />
        {adminSystem.map((item) => <NavItem key={item.path} item={item} />)}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all w-full"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
};

export default AdminLayout;
