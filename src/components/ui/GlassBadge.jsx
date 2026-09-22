// GlassBadge — status badges with semantic colors

const VARIANTS = {
  gold:    'badge-gold',
  green:   'badge-green',
  blue:    'badge-blue',
  red:     'badge-red',
  gray:    'badge-gray',
  upcoming:'badge-gold',
  ongoing: 'badge-green',
  completed:'badge-gray',
  mid:     'badge-blue',
  sem:     'badge-gold',
  live:    'badge-red',
};

export function GlassBadge({ children, variant = 'gray', className = '', ...props }) {
  const cls = VARIANTS[variant] || 'badge-gray';
  return (
    <span className={`badge ${cls} ${className}`} {...props}>
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      )}
      {children}
    </span>
  );
}

