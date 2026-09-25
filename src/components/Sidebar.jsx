import { useState, useContext } from 'react';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

// ── Unique Futuristic High-Craft Icons ─────────────────────────────

const ICONS = {
  // Home: Isometric Campus Command Beacon / Hex Portal with Core
  today: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Find a Route: Vector Waypoint Trajectory with Radar Sweep
  route: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="5" r="2.5" />
      <path d="M7.5 19H12a6 6 0 0 0 6-6V7.5" />
      <path d="M14.5 9.5L18 6l3.5 3.5" />
    </svg>
  ),
  // Campus Directory: Architectural Spatial Blueprint Grid
  directory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
      <circle cx="17.5" cy="17.5" r="1" fill="currentColor" />
    </svg>
  ),
  // Events: Celestial Supernova Crystalline Flare
  events: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M12 2l2.2 6.3L20 9l-5 4.2 1.5 6.8L12 16.5l-4.5 3.5 1.5-6.8L4 9l5.8-.7L12 2z" />
      <circle cx="12" cy="11.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Notices: Ultrasonic Broadcasting Beacon Tower
  notices: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M4 11a8 8 0 0 1 16 0c0 4.5 1.5 6 2 7H2c.5-1 2-2.5 2-7z" />
      <path d="M10 21h4" />
      <path d="M12 2v2" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Timetable: Dual-Orbital Chronometer Dial with Tick Arcs
  timetable: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 6.5v5.5l3.5 2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M12 2.5v1.5M12 20v1.5M2.5 12H4M20 12h1.5" />
    </svg>
  ),
  // Classes: Cybernetic Holo-Deck Learning Prism
  classes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h5" />
    </svg>
  ),
  // Faculty: Biometric Leadership Crest with Geometric Shield
  faculty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
      <path d="M3 10a9 9 0 0 0 3 6M21 10a9 9 0 0 1-3 6" />
    </svg>
  ),
  // Rooms: Isometric 3D Architectural Smart Chamber
  rooms: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
      <path d="M12 3v18" />
      <path d="M12 12l9-4M12 12l-9-4" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Exam Schedule: Official Quantum Encrypted Certificate Seal
  exams: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-5-5z" />
      <path d="M14 2v5h5" />
      <circle cx="11" cy="14" r="3" />
      <path d="M13 16l3 3" />
    </svg>
  ),
  // Exam Seating: Amphitheater Perspective Seating Matrix
  seating: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M5 20v-5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v5" />
      <circle cx="12" cy="6" r="3" />
      <path d="M2 20h20" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Search: Quantum Lidar Reticle Crosshair Scanner
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 7v2M11 13v2M7 11h2M13 11h2" />
    </svg>
  ),
  // Admin Panel: Cyber Master Security Shield & Matrix
  admin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M12 2l8 4v6c0 5.5-3.5 10-8 11-4.5-1-8-5.5-8-11V6l8-4z" />
      <circle cx="12" cy="11" r="2.5" />
      <path d="M12 13.5V17" />
    </svg>
  ),
};

// ── Navigation items (grouped) ───────────────────────────────────

const getNavGroups = (role) => {
  if (role === 'staff') {
    return [
      {
        label: 'Campus',
        items: [
          { id: 'today', label: 'Home', icon: ICONS.today },
          { id: 'route', label: 'Find a Route', icon: ICONS.route },
          { id: 'directory', label: 'Campus Directory', icon: ICONS.directory },
          { id: 'notices', label: 'Notices', icon: ICONS.notices },
        ],
      },
      {
        label: 'My Work',
        items: [
          { id: 'timetable', label: 'My Timetable', icon: ICONS.timetable },
          { id: 'classes', label: 'Next Class', icon: ICONS.classes },
          { id: 'rooms', label: 'Assigned Rooms', icon: ICONS.rooms },
        ],
      },
      {
        label: 'Account',
        items: [
          { id: 'faculty', label: 'My Profile', icon: ICONS.faculty },
        ],
      },
    ];
  }

  if (role === 'admin') {
    return [
      {
        label: 'Campus',
        items: [
          { id: 'today', label: 'Home', icon: ICONS.today },
          { id: 'route', label: 'Find a Route', icon: ICONS.route },
          { id: 'directory', label: 'Campus Directory', icon: ICONS.directory },
          { id: 'events', label: 'Events', icon: ICONS.events },
          { id: 'notices', label: 'Notices', icon: ICONS.notices },
        ],
      },
      {
        label: 'Management',
        items: [
          { id: 'timetable', label: 'Timetables', icon: ICONS.timetable },
          { id: 'classes', label: 'Classes', icon: ICONS.classes },
          { id: 'faculty', label: 'Faculty', icon: ICONS.faculty },
          { id: 'rooms', label: 'Rooms', icon: ICONS.rooms },
        ],
      },
      {
        label: 'Examinations (Admin)',
        items: [
          { id: 'exams', label: 'Manage Exams', icon: ICONS.exams },
          { id: 'seating', label: 'Manage Seating', icon: ICONS.seating },
        ],
      },
    ];
  }

  // default: student
  return [
    {
      label: 'Campus',
      items: [
        { id: 'today', label: 'Home', icon: ICONS.today },
        { id: 'route', label: 'Find a Route', icon: ICONS.route },
        { id: 'directory', label: 'Campus Directory', icon: ICONS.directory },
        { id: 'events', label: 'Events', icon: ICONS.events },
        { id: 'notices', label: 'Notices', icon: ICONS.notices },
      ],
    },
    {
      label: 'Academic',
      items: [
        { id: 'timetable', label: 'Timetable', icon: ICONS.timetable },
        { id: 'classes', label: 'Classes', icon: ICONS.classes },
        { id: 'faculty', label: 'Faculty', icon: ICONS.faculty },
        { id: 'rooms', label: 'Rooms', icon: ICONS.rooms },
      ],
    },
    {
      label: 'Examinations',
      items: [
        { id: 'exams', label: 'Exam Schedule', icon: ICONS.exams },
        { id: 'seating', label: 'Exam Seating', icon: ICONS.seating },
      ],
    },
  ];
};

// ── SidebarContent ───────────────────────────────────────────────

function SidebarContent({
  activeView,
  setActiveView,
  isMobile,
  onClose,
  onCollapse,
  role,
  setRole,
}) {
  return (
    <div className="flex flex-col h-full select-none">
      {/* Header — Logo + Hide / Close Controls */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 liquid-glass-icon shadow-lg" style={{ background: 'linear-gradient(135deg, #007AFF 0%, #34C759 100%)' }}>
            <div className="w-[26px] h-[26px] rounded-full inner-glass-symbol flex items-center justify-center">
              <span className="font-display font-black text-white text-[15px] drop-shadow-md">N</span>
            </div>
          </div>
          <div>
            <p className="font-display font-black text-[var(--sidebar-text-active)] text-sm leading-none tracking-tight">
              NaviGO
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

      {/* Role toggle with smooth animated slider */}
      <div className="px-4 pt-3.5 pb-2">
        <div
          className="relative flex p-1 rounded-full border border-black/10 dark:border-white/10"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}
        >
          {/* Moving liquid thumb */}
          <div
            className="absolute top-1 bottom-1 w-[calc(33.33%-4px)] rounded-full transition-transform duration-300"
            style={{
              left: 4,
              transform: role === 'staff' ? 'translateX(100%)' : role === 'admin' ? 'translateX(200%)' : 'translateX(0)',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          {['student', 'staff', 'admin'].map((r) => {
            const isCurrent = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="relative z-10 flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors duration-200 text-center"
                style={{
                  color: isCurrent ? 'var(--gold)' : 'rgba(255,255,255,0.7)',
                  textShadow: isCurrent ? '0 0 12px var(--shadow-gold)' : 'none',
                  fontWeight: 700,
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav groups — Clean, Gap-Free, Smooth Scrollable Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3.5 pt-2 pb-6 space-y-4 scrollbar-thin select-none relative"
        aria-label="Primary navigation"
        onKeyDown={(e) => {
          if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
          e.preventDefault();
          const allBtns = Array.from(e.currentTarget.querySelectorAll('button[data-id]'));
          const idx = allBtns.indexOf(document.activeElement);
          if (idx === -1) { allBtns[0]?.focus(); return; }
          const next = e.key === 'ArrowDown' ? allBtns[idx + 1] : allBtns[idx - 1];
          next?.focus();
        }}
      >
        {getNavGroups(role).map((group) => (
          <div key={group.label}>
            <p className="nav-section-label select-none">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    data-id={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      if (isMobile && onClose) onClose();
                    }}
                    className={`w-full group flex items-center gap-3 px-3.5 py-2.5 rounded-full transition-all duration-200 text-left relative ${
                      isActive
                        ? 'bg-[var(--gold)]/15 dark:bg-[var(--gold)]/20 border border-[var(--gold)]/35 text-[var(--sidebar-text-active)] font-bold shadow-xs'
                        : 'border border-transparent text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] hover:bg-black/5 dark:hover:bg-white/5 font-medium'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span
                      className="nav-icon transition-transform duration-200 group-hover:scale-110 shrink-0"
                      style={{
                        color: isActive ? 'var(--gold)' : 'currentColor',
                        filter: isActive ? 'drop-shadow(0 0 6px var(--gold))' : 'none',
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[13px] tracking-tight">{item.label}</span>
                    {isActive && (
                      <span
                        className="ml-auto w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_var(--gold)]"
                        style={{ background: 'var(--gold)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {role === 'admin' && (
          <div>
            <p className="nav-section-label select-none">Administration</p>
            <div className="space-y-1">
              {(() => {
                const isAdminActive = activeView === 'admin';

                return (
                  <button
                    data-id="admin"
                    onClick={() => {
                      setActiveView('admin');
                      if (isMobile && onClose) onClose();
                    }}
                    className={`w-full group flex items-center gap-3 px-3.5 py-2.5 rounded-full transition-all duration-200 text-left relative ${
                      isAdminActive
                        ? 'bg-[var(--gold)]/15 dark:bg-[var(--gold)]/20 border border-[var(--gold)]/35 text-[var(--sidebar-text-active)] font-bold shadow-xs'
                        : 'border border-transparent text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] hover:bg-black/5 dark:hover:bg-white/5 font-medium'
                    }`}
                    aria-current={isAdminActive ? 'page' : undefined}
                  >
                    <span
                      className="nav-icon transition-transform duration-200 group-hover:scale-110 shrink-0"
                      style={{
                        color: isAdminActive ? 'var(--gold)' : 'currentColor',
                        filter: isAdminActive ? 'drop-shadow(0 0 6px var(--gold))' : 'none',
                      }}
                    >
                      {ICONS.admin}
                    </span>
                    <span className="text-[13px] tracking-tight">Admin Settings</span>
                    <span
                      className="ml-auto font-mono text-[8px] px-2 py-0.5 font-bold tracking-wide rounded-full shadow-sm"
                      style={{ background: 'var(--gold)', color: '#ffffff' }}
                    >
                      ADMIN
                    </span>
                  </button>
                );
              })()}
            </div>
          </div>
        )}
      </nav>

      {/* User profile pill */}
      <div className="px-4 py-3.5 border-t border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3 p-1.5 rounded-full bg-[rgba(255,255,255,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[var(--sidebar-border)]">
          <div
            className="w-8 h-8 flex items-center justify-center text-[11px] font-bold font-mono shrink-0 rounded-full shadow-sm"
            style={{ background: 'var(--gold)', color: '#ffffff' }}
          >
            AK
          </div>
          <div className="overflow-hidden min-w-0 pr-2">
            <p className="text-[12.5px] font-semibold text-[var(--sidebar-text-active)] truncate leading-tight">
              {role === 'staff' ? 'Dr. Priya Sharma' : role === 'admin' ? 'System Admin' : 'Aarav Kannan'}
            </p>
            <p className="font-mono text-[8.5px] truncate uppercase tracking-wider text-[var(--sidebar-text)]">
              {role === 'staff' ? 'Professor · CSE' : role === 'admin' ? 'ALTS IT Dept' : 'BCA · Year 2'}
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
  const { userRole: role, setUserRole: setRole } = useContext(AppContext);

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
