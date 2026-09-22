// GlassCard — Level 1/2/3 glass surface card

export function GlassCard({
  children,
  variant = 'subtle',   // subtle | floating | elevated
  hover = true,
  onClick,
  className = '',
  as: Tag = 'div',
  style,
  ...props
}) {
  const variantClass = {
    subtle:   'glass-card',
    floating: 'glass-2',
    elevated: 'glass-3',
  }[variant] || 'glass-card';

  return (
    <Tag
      className={`${variantClass} ${hover ? 'glass-card' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  );
}

