// GlassInput — glass-styled text input with label and error support

export function GlassInput({
  label,
  error,
  icon,
  id,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`glass-input ${icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:border-red-400' : ''} ${inputClassName}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-red-500 flex items-center gap-1"
          role="alert"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export function GlassTextarea({ label, error, id, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`glass-input resize-none ${error ? 'border-red-400' : ''}`}
        rows={4}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500" role="alert">{error}</p>
      )}
    </div>
  );
}

export function GlassSelect({ label, error, id, children, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`glass-select ${error ? 'border-red-400' : ''}`}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </span>
      </div>
      {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
    </div>
  );
}

