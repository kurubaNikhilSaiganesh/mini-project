// GlassModal — accessible modal dialog with glass Level 4 surface

import { useEffect, useRef } from 'react';

export function GlassModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '520px',
  className = '',
}) {
  const dialogRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus trap — focus modal on open
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      <div
        ref={dialogRef}
        className={`modal-content glass-modal w-full ${className}`}
        style={{ maxWidth }}
        tabIndex={-1}
      >
        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between p-5 pb-4"
            style={{ borderBottom: '1px solid var(--glass-border)' }}
          >
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="glass-btn glass-btn-ghost glass-btn-icon w-8 h-8"
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}
        {/* Body */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

