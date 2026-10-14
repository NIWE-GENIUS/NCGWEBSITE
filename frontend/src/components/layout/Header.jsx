// src/components/layout/Header.jsx
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../shared/SearchBar';
import NotificationBell from '../shared/NotificationBell';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/programs', label: 'Programs' },
  { to: '/innovation', label: 'Innovation' },
  { to: '/collaboration', label: 'Collaborate' },
  { to: '/team', label: 'Team' },
  { to: '/donate', label: 'Donate' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EDF2F5] shadow-sm">
      <div className="container-ncg">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="NEXT Creatures Group Home">
            <img
              src="/logo.png"
              alt="NEXT Creatures Group"
              className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="hidden md:block">
              <p className="font-heading font-bold text-[15px] text-[#031B2A] leading-tight">
                NEXT CREATURES GROUP
              </p>
              <p className="text-[9px] text-[#8BCB2A] uppercase tracking-[0.2em] font-bold">
                Smart Solutions For Digital Future
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'text-[#064B7A] bg-[#F5F9FB]'
                      : 'text-[#163247] hover:text-[#064B7A] hover:bg-[#F5F9FB]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            <SearchBar />
            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium text-[#163247] hover:bg-[#F5F9FB]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium text-[#163247] hover:bg-[#F5F9FB]"
                >
                  <UserIcon className="w-4 h-4" />
                  {user?.firstName || 'Account'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium text-[#E74C3C] hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-semibold text-[#064B7A] border border-[#064B7A]/20 hover:bg-[#F5F9FB]"
                >
                  <i className="ri-login-circle-line text-base" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 bg-[#8BCB2A] text-[#031B2A] font-semibold px-4 py-2 rounded-md text-[13px] hover:bg-[#A8D94A]"
                >
                  <i className="ri-user-add-line text-base" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-[#F5F9FB]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-[#064B7A]" />
            ) : (
              <Menu className="w-6 h-6 text-[#064B7A]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#EDF2F5] bg-white fade-in">
          <nav className="container-ncg py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-md text-sm font-medium ${
                    isActive
                      ? 'text-[#064B7A] bg-[#F5F9FB]'
                      : 'text-[#163247] hover:bg-[#F5F9FB]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="border-t border-[#EDF2F5] mt-2 pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="text-center border-2 border-[#064B7A] text-[#064B7A] font-semibold py-2.5 rounded-md text-sm"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="text-center border-2 border-[#064B7A] text-[#064B7A] font-semibold py-2.5 rounded-md text-sm"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="text-center py-2.5 rounded-md text-[#E74C3C] font-medium text-sm hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center border-2 border-[#064B7A] text-[#064B7A] font-semibold py-2.5 rounded-md text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-center bg-[#8BCB2A] text-[#031B2A] font-semibold py-2.5 rounded-md text-sm"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}