import { useState, useRef, useEffect, useCallback } from 'react';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';

// ── Navigation items (grouped) ───────────────────────────────────

const NAV_GROUPS = [
  {
    label: 'Campus',
    items: [
      {
        id: 'today',
        label: 'Home',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
      {
        id: 'route',
        label: 'Find a Route',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ),
      },
      {
        id: 'directory',
        label: 'Campus Directory',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        ),
      },
      {
        id: 'events',
        label: 'Events',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
      {
        id: 'notices',
        label: 'Notices',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Academic',
    items: [
      {
        id: 'timetable',
        label: 'Timetable',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        id: 'classes',
        label: 'Classes',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        ),
      },
      {
        id: 'faculty',
        label: 'Faculty',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        id: 'rooms',
        label: 'Rooms',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <line x1="9" y1="22" x2="9" y2="12" />
            <line x1="15" y1="22" x2="15" y2="12" />
            <line x1="9" y1="12" x2="15" y2="12" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Examinations',
    items: [
      {
        id: 'exams',
        label: 'Exam Schedule',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
      {
        id: 'seating',
        label: 'Exam Seating',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ),
      },
      {
        id: 'search',
        label: 'Search',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        ),
      },
    ],
  },
];

// ── SidebarContent with Liquid River Flow & Hold-to-Zoom ─────────

function SidebarContent({
  activeView,
  setActiveView,
  isMobile,
  onClose,
  onCollapse,
  role,
  setRole,
}) {
  const itemRefs = useRef({});
  const navContainerRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [heldId, setHeldId] = useState(null);
  const isDraggingRef = useRef(false);

  // Position of the liquid sliding indicator (GPU accelerated translateY)
  const [pillStyle, setPillStyle] = useState({ transform: 'translateY(0)', height: 0, opacity: 0 });
  const cachedBoundsRef = useRef([]);
  const rafRef = useRef(null);

  // Update pill position based on active item or currently dragged/hovered item
  const updatePill = useCallback(() => {
    const targetId = heldId || hoveredId || activeView;
    const targetEl = itemRefs.current[targetId];
    const containerEl = navContainerRef.current;

    if (targetEl && containerEl) {
      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const relativeTop = targetRect.top - containerRect.top + containerEl.scrollTop;

      setPillStyle({
        transform: `translateY(${relativeTop}px)`,
        height: targetRect.height,
        opacity: 1,
      });
    }
  }, [activeView, hoveredId, heldId]);

  useEffect(() => {
    updatePill();
  }, [updatePill]);

  // Keep indicator aligned on window resize or view scroll
  useEffect(() => {
    const onResize = () => updatePill();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updatePill]);

  // Pointer drag/scrub handlers — zero DOM reading during pointermove
  const handlePointerDown = (e, itemId) => {
    isDraggingRef.current = true;
    setHeldId(itemId);
    // Cache item rects once on start so pointermove does zero DOM queries!
    cachedBoundsRef.current = Object.entries(itemRefs.current)
      .filter(([, el]) => Boolean(el))
      .map(([id, el]) => {
        const r = el.getBoundingClientRect();
        return { id, top: r.top, bottom: r.bottom };
      });
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientY = e.clientY;
    // Throttle with requestAnimationFrame to eliminate high-frequency re-renders
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const bounds = cachedBoundsRef.current;
      for (let i = 0; i < bounds.length; i++) {
        if (clientY >= bounds[i].top && clientY <= bounds[i].bottom) {
          if (bounds[i].id !== heldId) {
            setHeldId(bounds[i].id);
          }
          break;
        }
      }
    });
  };

  const handlePointerUp = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (isDraggingRef.current) {
      if (heldId) {
        setActiveView(heldId);
      }
      isDraggingRef.current = false;
      setHeldId(null);
    }
  };

  return (
    <div
      className="flex flex-col h-full select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Header — Logo + Hide / Close Controls */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 flex items-center justify-center p-1 shadow-sm">
            <img
              src="/logo.png"
              alt="ALTS"
              className="w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <p className="font-display font-black text-[var(--sidebar-text-active)] text-sm leading-none tracking-tight">
              ALTS
            </p>
            <p className="font-mono text-[8.5px] font-semibold leading-tight mt-0.5 text-[var(--sidebar-text)] tracking-wider">
              CAMPUS PLATFORM
            </p>
          </div>
        </div>

        {/* Hide control panel button (Desktop collapse / Mobile close) */}
        <div className="flex items-center gap-1">
          {isMobile ? (
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-full glass-btn glass-btn-ghost transition-all hover:scale-105"
              onClick={onClose}
              aria-label="Close navigation panel"
              title="Close panel"
            >
              <X size={15} />
              <span className="text-[11px] font-semibold">Close</span>
            </button>
          ) : (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn glass-btn-ghost transition-all duration-200 hover:scale-105 hover:bg-[var(--sidebar-surface)] text-[var(--sidebar-text-active)] hover:text-[var(--gold)]"
              onClick={onCollapse}
              aria-label="Hide control panel"
              title="Hide control panel"
            >
              <PanelLeftClose size={15} />
              <span className="text-[11px] font-bold tracking-wide">Hide</span>
            </button>
          )}
        </div>
      </div>

      {/* Role toggle with smooth animated moving slider */}
      <div className="px-4 pt-3.5 pb-2">
        <div
          className="relative flex p-1 rounded-full border border-[var(--sidebar-border)] bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.05)] backdrop-blur-sm shadow-inner"
        >
          {/* Moving liquid thumb */}
          <div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 shadow-sm"
            style={{
              left: 4,
              transform: role === 'staff' ? 'translateX(100%)' : 'translateX(0)',
              background: 'linear-gradient(135deg, var(--gold) 0%, #D9A100 100%)',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          {['student', 'staff'].map((r) => {
            const isCurrent = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="relative z-10 flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-colors duration-200 text-center"
                style={{
                  color: isCurrent ? '#111' : 'var(--sidebar-text)',
                  fontWeight: isCurrent ? 700 : 500,
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav groups — Liquid River Flow Navigation */}
      <nav
        ref={navContainerRef}
        onScroll={updatePill}
        className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide space-y-4 liquid-nav-track"
        aria-label="Primary navigation"
      >
        {/* Sliding Liquid River Indicator */}
        <div
          className={`liquid-nav-pill ${heldId ? 'holding' : ''}`}
          style={{
            transform: pillStyle.transform,
            height: `${pillStyle.height}px`,
            opacity: pillStyle.opacity,
          }}
          aria-hidden="true"
        />

        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="nav-section-label select-none">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeView === item.id;
                const isTarget = (heldId || hoveredId || activeView) === item.id;
                const isZoomed = heldId === item.id;

                return (
                  <button
                    key={item.id}
                    ref={(el) => { itemRefs.current[item.id] = el; }}
                    onClick={() => {
                      setActiveView(item.id);
                      if (isMobile && onClose) onClose();
                    }}
                    onPointerDown={(e) => handlePointerDown(e, item.id)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`liquid-nav-item ${isActive ? 'active' : ''} ${isZoomed ? 'zoomed' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      transform: isZoomed ? 'scale(1.10) translateX(6px)' : undefined,
                    }}
                  >
                    <span
                      className="nav-icon"
                      style={{
                        color: isTarget ? 'var(--gold)' : 'var(--sidebar-text)',
                        transform: isZoomed ? 'scale(1.2)' : undefined,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[13px] tracking-tight">{item.label}</span>
                    {isActive && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full shrink-0 shadow-sm"
                        style={{ background: 'var(--gold)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Administration */}
        <div>
          <p className="nav-section-label select-none">Administration</p>
          <div className="space-y-1">
            {(() => {
              const isAdminActive = activeView === 'admin';
              const isAdminTarget = (heldId || hoveredId || activeView) === 'admin';
              const isAdminZoomed = heldId === 'admin';

              return (
                <button
                  ref={(el) => { itemRefs.current['admin'] = el; }}
                  onClick={() => {
                    setActiveView('admin');
                    if (isMobile && onClose) onClose();
                  }}
                  onPointerDown={(e) => handlePointerDown(e, 'admin')}
                  onMouseEnter={() => setHoveredId('admin')}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`liquid-nav-item ${isAdminActive ? 'active' : ''} ${isAdminZoomed ? 'zoomed' : ''}`}
                  aria-current={isAdminActive ? 'page' : undefined}
                  style={{
                    transform: isAdminZoomed ? 'scale(1.10) translateX(6px)' : undefined,
                  }}
                >
                  <span
                    className="nav-icon"
                    style={{
                      color: isAdminTarget ? 'var(--gold)' : 'var(--sidebar-text)',
                      transform: isAdminZoomed ? 'scale(1.2)' : undefined,
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  <span className="text-[13px] tracking-tight">Admin Panel</span>
                  <span
                    className="ml-auto font-mono text-[8px] px-2 py-0.5 font-bold tracking-wide rounded-full shadow-sm"
                    style={{ background: 'var(--gold)', color: '#111' }}
                  >
                    ADMIN
                  </span>
                </button>
              );
            })()}
          </div>
        </div>
      </nav>

      {/* User profile pill */}
      <div className="px-4 py-3.5 border-t border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3 p-1.5 rounded-full bg-[rgba(255,255,255,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[var(--sidebar-border)]">
          <div
            className="w-8 h-8 flex items-center justify-center text-[11px] font-bold font-mono shrink-0 rounded-full shadow-sm"
            style={{ background: 'var(--gold)', color: '#111' }}
          >
            AK
          </div>
          <div className="overflow-hidden min-w-0 pr-2">
            <p className="text-[12.5px] font-semibold text-[var(--sidebar-text-active)] truncate leading-tight">
              Aarav Kannan
            </p>
            <p className="font-mono text-[8.5px] truncate uppercase tracking-wider text-[var(--sidebar-text)]">
              {role === 'staff' ? 'Staff · ALTS' : 'BCA · Year 2'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar (export) ──────────────────────────────────────────────

export default function Sidebar({
  activeView,
  setActiveView,
  mobileMenuOpen,
  setMobileMenuOpen,
  collapsed = false,
  setCollapsed = () => {},
}) {
  const [role, setRole] = useState('student');

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer — floating curved glass sheet */}
      {mobileMenuOpen && (
        <aside
          className="fixed top-3 left-3 bottom-3 w-[min(290px,calc(100vw-24px))] flex flex-col z-50 curved-control-panel sidebar-mobile lg:hidden shadow-2xl overflow-hidden"
          aria-label="Mobile navigation"
        >
          <SidebarContent
            activeView={activeView}
            setActiveView={(v) => { setActiveView(v); setMobileMenuOpen(false); }}
            isMobile={true}
            onClose={() => setMobileMenuOpen(false)}
            onCollapse={null}
            role={role}
            setRole={setRole}
          />
        </aside>
      )}

      {/* Desktop sidebar — floating curved glass control panel */}
      {!collapsed && (
        <aside
          className="hidden lg:flex flex-col w-[264px] my-3 ml-3 h-[calc(100vh-24px)] shrink-0 z-30 curved-control-panel overflow-hidden"
          aria-label="Primary navigation"
        >
          <SidebarContent
            activeView={activeView}
            setActiveView={setActiveView}
            isMobile={false}
            onClose={null}
            onCollapse={() => setCollapsed(true)}
            role={role}
            setRole={setRole}
          />
        </aside>
      )}

      {/* Desktop sidebar — when collapsed, show floating button at same top weight */}
      {collapsed && (
        <div className="hidden lg:block my-3 ml-3 shrink-0 z-30 select-none">
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full curved-control-panel hover:scale-105 transition-all text-xs font-bold text-[var(--sidebar-text-active)] hover:text-[var(--gold)] shadow-xl cursor-pointer group"
            title="Open control panel"
            aria-label="Open control panel"
          >
            <PanelLeftOpen size={16} className="text-[var(--gold)] group-hover:scale-110 transition-transform" />
            <span className="font-display font-black text-sm tracking-tight">ALTS</span>
            <span className="font-mono text-[9px] text-[var(--sidebar-text)] font-semibold tracking-wider uppercase">Menu</span>
          </button>
        </div>
      )}
    </>
  );
}
