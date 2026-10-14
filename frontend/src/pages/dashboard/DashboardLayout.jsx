// src/pages/dashboard/DashboardLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SidebarNav from '../../components/dashboard/SidebarNav';
import {
  LayoutDashboard, User, FileText, MessageSquare, Bell as BellIcon,
  Settings as SettingsIcon, Folder, Award, Briefcase, GraduationCap,
} from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'guest';

  // Role-filtered sidebar sections
  const sections = [
    {
      title: 'Main',
      links: [
        { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
        { to: '/dashboard/profile', label: 'My Profile', icon: User },
      ],
    },
    {
      title: 'Activity',
      links: [
        { to: '/dashboard/applications', label: 'Applications', icon: FileText },
        { to: '/dashboard/documents', label: 'Documents', icon: Folder },
        { to: '/dashboard/certificates', label: 'Certificates', icon: Award },
      ],
    },
    {
      title: 'Learning',
      links: [
        { to: '/dashboard/programs', label: 'My Programs', icon: GraduationCap },
        { to: '/dashboard/opportunities', label: 'Opportunities', icon: Briefcase },
      ],
    },
    {
      title: 'Communication',
      links: [
        { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
        { to: '/dashboard/notifications', label: 'Notifications', icon: BellIcon },
      ],
    },
    {
      title: 'Account',
      links: [
        { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex">
      {/* Sidebar — desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0 fixed top-0 left-0 h-screen z-30">
        <SidebarNav items={sections} title={`${role.charAt(0).toUpperCase() + role.slice(1)} Panel`} />
      </div>

      {/* Sidebar — mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full">
            <SidebarNav
              items={sections}
              title={`${role.charAt(0).toUpperCase() + role.slice(1)} Panel`}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#EDF2F5] shadow-sm">
          <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-[#F5F9FB]"
              >
                <Menu className="w-5 h-5 text-[#064B7A]" />
              </button>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#6D7E89] font-bold">
                  {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                </p>
                <p className="font-heading font-bold text-[15px] text-[#031B2A]">
                  Welcome, {user?.firstName || 'User'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-md hover:bg-[#F5F9FB]">
                <Bell className="w-5 h-5 text-[#064B7A]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E74C3C]" />
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium text-[#E74C3C] hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-[#EDF2F5] py-4 text-center text-xs text-[#6D7E89]">
          © {new Date().getFullYear()} NEXT Creatures Group Ltd
        </footer>
      </div>
    </div>
  );
}