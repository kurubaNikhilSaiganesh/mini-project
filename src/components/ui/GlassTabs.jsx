// GlassTabs — animated tab switcher with sliding active indicator
// Features smooth spring physics, translucent glass pill track, and ambient glow

import { useState, useRef, useEffect } from 'react';

export function GlassTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'gold', // 'gold' | 'glass' | 'green'
  className = '',
}) {
  const tabRefs = useRef([]);
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const activeIndex = tabs.findIndex((t) => t.id === activeTab);
      if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
        const el = tabRefs.current[activeIndex];
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activeTab, tabs]);

  const variantStyles = {
    gold: {
      activeText: 'var(--text-primary)',
      indicatorBg: 'linear-gradient(135deg, rgba(244, 180, 0, 0.25) 0%, rgba(244, 180, 0, 0.12) 100%)',
      indicatorBorder: '1px solid rgba(244, 180, 0, 0.45)',
      indicatorGlow: '0 4px 18px rgba(244, 180, 0, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      badgeBg: 'var(--gold)',
      badgeColor: '#111',
    },
    green: {
      activeText: 'var(--text-primary)',
      indicatorBg: 'linear-gradient(135deg, rgba(8, 127, 69, 0.25) 0%, rgba(8, 127, 69, 0.12) 100%)',
      indicatorBorder: '1px solid rgba(8, 127, 69, 0.45)',
      indicatorGlow: '0 4px 18px rgba(8, 127, 69, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      badgeBg: 'var(--green)',
      badgeColor: '#fff',
    },
    glass: {
      activeText: 'var(--text-primary)',
      indicatorBg: 'linear-gradient(135deg, var(--glass-3) 0%, var(--glass-2) 100%)',
      indicatorBorder: '1px solid var(--glass-border-strong)',
      indicatorGlow: '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
      badgeBg: 'var(--glass-3)',
      badgeColor: 'var(--text-primary)',
    },
  };

  const style = variantStyles[variant] || variantStyles.gold;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-1 p-1.5 backdrop-blur-md overflow-x-auto scrollbar-hide max-w-full ${className}`}
      style={{
        background: 'var(--glass-1)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-xs), inset 0 1px 2px rgba(0, 0, 0, 0.03)',
      }}
      role="tablist"
    >
      {/* Sliding indicator with smooth motion and glow */}
      <div
        className="absolute top-1.5 h-[calc(100%-12px)] transition-all pointer-events-none"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
          background: style.indicatorBg,
          borderRadius: 'var(--radius-full)',
          boxShadow: style.indicatorGlow,
          border: style.indicatorBorder,
          transitionDuration: '320ms',
          transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.35, 1)',
        }}
        aria-hidden="true"
      />

      {tabs.map((tab, i) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`relative z-10 flex items-center justify-center gap-2 px-4 md:px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 select-none whitespace-nowrap ${
              isActive
                ? 'scale-[1.02]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:scale-[1.01]'
            }`}
            style={{
              color: isActive ? style.activeText : undefined,
              textShadow: isActive ? '0 0 12px rgba(244, 180, 0, 0.2)' : 'none',
            }}
          >
            {tab.icon && <span className="text-sm shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-all shadow-sm"
                style={{
                  background: isActive ? style.badgeBg : 'var(--glass-2)',
                  color: isActive ? style.badgeColor : 'var(--text-muted)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
