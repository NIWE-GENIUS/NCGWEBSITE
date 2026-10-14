// frontend/src/pages/admin/AdminLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate, Navigate, Link } from 'react-router-dom';
import { Menu, LogOut, Search as SearchIcon, Bell, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import SidebarNav from '../../components/dashboard/SidebarNav';
import {
  LayoutDashboard, Mail, Users, GraduationCap, FolderKanban,
  Quote, HelpCircle, Settings as SettingsIcon, BarChart3,
  FileText, Megaphone, Send, Puzzle, Activity, ListChecks,
  Wallet, Receipt, CreditCard, RefreshCw, FileBarChart,
  Newspaper, DollarSign, Scale,
} from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F9FB]">
        <div className="w-10 h-10 border-4 border-[#8BCB2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Guard: must be admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const sections = [
    {
      title: 'Main',
      links: [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Communication',
      links: [
        { to: '/admin/messages', label: 'Contact Inbox', icon: Mail },
        { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
        { to: '/admin/broadcast', label: 'Broadcast Email', icon: Send },
        { to: '/admin/newsletter', label: 'Newsletter', icon: Newspaper },
      ],
    },
    {
      title: 'Content',
      links: [
        { to: '/admin/team', label: 'Team Members', icon: Users },
        { to: '/admin/programs', label: 'Programs', icon: GraduationCap },
        { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
        { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
        { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
        { to: '/admin/blog', label: 'Blog Posts', icon: FileText },
        { to: '/admin/legal', label: 'Legal Pages', icon: Scale },
      ],
    },
    {
      title: 'People',
      links: [
        { to: '/admin/users', label: 'Users', icon: Users },
        { to: '/admin/applications', label: 'Applications', icon: ListChecks },
      ],
    },
    {
      title: 'Financials',
      links: [
        { to: '/admin/financials', label: 'Overview', icon: Wallet },
        { to: '/admin/donations', label: 'Donations', icon: DollarSign },
        { to: '/admin/donors', label: 'Donors', icon: Users },
        { to: '/admin/invoices', label: 'Invoices', icon: Receipt },
        { to: '/admin/payments', label: 'Payments', icon: CreditCard },
        { to: '/admin/subscriptions', label: 'Subscriptions', icon: RefreshCw },
        { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
      ],
    },
    {
      title: 'System',
      links: [
        { to: '/admin/integrations', label: 'Integrations', icon: Puzzle },
        { to: '/admin/activity', label: 'Activity Logs', icon: Activity },
        { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 fixed top-0 left-0 h-screen z-30">
        <SidebarNav items={sections} title="Admin Panel" />
      </div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full">
            <SidebarNav
              items={sections}
              title="Admin Panel"
              onClose={() => setSidebarOpen(false)}
            />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-[#EDF2F5] shadow-sm">
          <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-[#F5F9FB]"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-[#064B7A]" />
              </button>

              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="NCG" className="h-9 w-auto" />
                <div className="hidden md:block">
                  <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold leading-tight">
                    Admin Control Center
                  </p>
                  <p className="font-heading font-bold text-sm text-[#031B2A] leading-tight">
                    {user?.firstName || 'Admin'} · NCG
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search shortcut */}
              <button
                onClick={() => {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
                }}
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#EDF2F5] text-sm text-[#6D7E89] hover:border-[#8BCB2A] hover:text-[#064B7A] transition-colors"
                title="Search (Ctrl+K)"
              >
                <SearchIcon className="w-4 h-4" />
                <span className="text-xs">Search</span>
                <kbd className="text-[10px] bg-[#F5F9FB] px-1.5 py-0.5 rounded border border-[#EDF2F5]">
                  ⌘K
                </kbd>
              </button>

              {/* View public site */}
              <Link
                to="/"
                className="hidden md:inline-flex items-center gap-1.5 p-2 rounded-md hover:bg-[#F5F9FB] text-[#064B7A]"
                title="View Public Site"
              >
                <Home className="w-4 h-4" />
              </Link>

              {/* Notifications */}
              <button
                onClick={() => navigate('/admin/activity')}
                className="relative p-2 rounded-md hover:bg-[#F5F9FB]"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-[#064B7A]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-[#E74C3C] text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* User avatar */}
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#EDF2F5]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center text-white font-bold text-sm">
                  {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium text-[#E74C3C] hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-[#EDF2F5] py-4 text-center text-xs text-[#6D7E89]">
          © {new Date().getFullYear()} NEXT Creatures Group Ltd — Admin Panel · v1.0.0
        </footer>
      </div>
    </div>
  );
}