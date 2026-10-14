// src/components/dashboard/SidebarNav.jsx
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

export default function SidebarNav({ items, title = 'Dashboard', onClose }) {
  return (
    <aside className="w-full h-full bg-[#031B2A] text-white flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <img src="/logo.png" alt="NCG" className="h-10 w-auto object-contain bg-white/95 rounded p-1" />
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm text-white truncate">NCG Hub</p>
          <p className="text-[10px] text-[#8BCB2A] uppercase tracking-wider truncate">{title}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4">
        {items.map((section, si) => (
          <div key={si} className="mb-5">
            {section.title && (
              <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-[#8BCB2A]/15 text-[#8BCB2A] border-l-2 border-[#8BCB2A]'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`
                      }
                    >
                      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                      <span className="flex-1 truncate">{link.label}</span>
                      {link.badge && (
                        <span className="text-[10px] bg-[#E74C3C] text-white font-bold px-1.5 py-0.5 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <p className="text-[10px] text-white/40 text-center">
          © {new Date().getFullYear()} NEXT Creatures Group
        </p>
      </div>
    </aside>
  );
}