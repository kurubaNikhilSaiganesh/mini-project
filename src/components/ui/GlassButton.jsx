// GlassButton — full-featured button with loading/success/error states

export function GlassButton({
  children,
  variant = 'default',  // default | primary | ghost | danger
  size = 'md',          // sm | md | lg | icon
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  ...props
}) {
  const variantClass = {
    default: 'glass-btn',
    primary: 'glass-btn glass-btn-primary',
    ghost:   'glass-btn glass-btn-ghost',
    danger:  'glass-btn glass-btn-danger',
  }[variant] || 'glass-btn';

  const sizeClass = {
    sm:   'glass-btn-sm',
    md:   '',
    lg:   'glass-btn-lg',
    icon: 'glass-btn-icon',
  }[size] || '';

  return (
    <button
      type={type}
      className={`${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
            strokeDasharray="40" strokeDashoffset="10" />
        </svg>
      ) : icon ? (
        <span className="flex items-center gap-2">
          {icon}
          {children}
        </span>
      ) : children}
    </button>
  );
}

