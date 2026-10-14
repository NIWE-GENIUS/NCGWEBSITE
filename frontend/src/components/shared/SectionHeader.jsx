// src/components/shared/SectionHeader.jsx
export default function SectionHeader({ tag, title, highlight, subtitle, center = true, light = false }) {
  const align = center ? 'text-center mx-auto' : '';
  const tagColor = light ? 'text-[#8BCB2A]' : 'text-[#8BCB2A]';
  const titleColor = light ? 'text-white' : 'text-[#031B2A]';
  const subtitleColor = light ? 'text-white/60' : 'text-[#6D7E89]';

  return (
    <div className={`max-w-3xl mb-14 ${align}`}>
      {tag && (
        <span className={`text-xs uppercase tracking-[0.25em] font-bold ${tagColor} block mb-3`}>
          {tag}
        </span>
      )}
      <h2 className={`text-3xl md:text-5xl font-heading font-bold ${titleColor} mb-4`}>
        {title} {highlight && <span className="text-[#8BCB2A]">{highlight}</span>}
      </h2>
      {subtitle && <p className={`text-lg ${subtitleColor} leading-relaxed`}>{subtitle}</p>}
    </div>
  );
}