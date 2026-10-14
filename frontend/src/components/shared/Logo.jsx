// src/components/shared/Logo.jsx
import { Link } from 'react-router-dom';

export default function Logo({ variant = 'dark', size = 'md', withText = true, to = '/' }) {
  const heights = { sm: 'h-8', md: 'h-12', lg: 'h-16', xl: 'h-24' };
  const textColor = variant === 'light' ? 'text-white' : 'text-[#031B2A]';
  const subColor = variant === 'light' ? 'text-[#8BCB2A]' : 'text-[#8BCB2A]';

  const content = (
    <div className="flex items-center gap-2.5 group">
      <img
        src="/logo.png"
        alt="NEXT Creatures Group"
        className={`${heights[size]} w-auto object-contain group-hover:scale-105 transition-transform duration-300`}
      />
      {withText && (
        <div className="hidden md:block">
          <p className={`font-heading font-bold text-sm ${textColor} leading-tight`}>
            NEXT CREATURES GROUP
          </p>
          <p className={`text-[9px] ${subColor} uppercase tracking-[0.2em] font-bold`}>
            Smart Solutions For Digital Future
          </p>
        </div>
      )}
    </div>
  );

  if (to) return <Link to={to} aria-label="NEXT Creatures Group Home">{content}</Link>;
  return content;
}