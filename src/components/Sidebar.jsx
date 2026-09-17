
const NAV_ITEMS = [
  {
    id: 'today',
    label: 'Today',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'route',
    label: 'Find a Route',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
      </svg>
    ),
  },
  {
    id: 'directory',
    label: 'Campus Directory',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'events',
    label: 'Events',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    id: 'timetable',
    label: 'Timetable',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id: 'classes',
    label: 'Classes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    id: 'faculty',
    label: 'Faculty',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'rooms',
    label: 'Rooms',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><line x1="9" y1="12" x2="15" y2="12"/>
      </svg>
    ),
  },
];

const EXTRA_ITEMS = [
  {
    id: 'complaints',
    label: 'Complaints',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
    ),
  },
  {
    id: 'firstaid',
    label: 'First Aid',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    id: 'examhalls',
    label: 'Exam Halls',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
      </svg>
    ),
  },
];

export default function Sidebar({ activeView, setActiveView, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      {/* Mobile sidebar — slide-in overlay */}
      <aside
        className={`
          w-[240px] bg-[var(--bg-sidebar)] h-screen flex flex-col shrink-0 z-50
          ${mobileMenuOpen
            ? 'fixed top-0 left-0 sidebar-mobile'
            : 'hidden lg:flex'
          }
        `}
        style={{
          borderRight: '2px solid #1E1E1E',
        }}
      >
        {/* Logo area */}
        <div className="px-5 pt-6 pb-4 border-b border-[#1E1E1E]">
          <div className="flex items-center justify-between">
            <img
              src="/logo.png"
              alt="NaviGO"
              style={{ height: 36, width: 'auto', objectFit: 'contain' }}
            />
            {/* Mobile close button */}
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest mt-2">
            NAVIGATION · EXPLORATION · SYSTEM
          </p>
        </div>

        {/* Student/Staff toggle */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex bg-[#1A1A1A] border border-[#2A2A2A] p-0.5">
            <button className="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] bg-[var(--navigo-yellow)]">
              Student
            </button>
            <button className="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              Staff
            </button>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
          <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest px-2 py-2">
            Navigate Campus
          </p>

          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={isActive ? 'text-[var(--navigo-yellow)]' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--navigo-yellow)' }}
                  />
                )}
              </button>
            );
          })}

          <div className="mt-4 mb-2 border-t border-[#1E1E1E]" />

          <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest px-2 py-2">
            Services
          </p>

          {EXTRA_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={isActive ? 'text-[var(--navigo-yellow)]' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Admin — visually separated */}
          <div className="mt-4 mb-2 border-t border-[#1E1E1E]" />

          <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest px-2 py-2">
            Administration
          </p>

          <button
            onClick={() => setActiveView('admin')}
            className={`nav-item ${activeView === 'admin' ? 'active' : ''}`}
            aria-current={activeView === 'admin' ? 'page' : undefined}
          >
            <span className={activeView === 'admin' ? 'text-[var(--navigo-yellow)]' : 'text-gray-500'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <span>Admin Panel</span>
            <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 bg-[var(--navigo-yellow)] text-[#111111] font-bold">ADMIN</span>
          </button>
        </nav>

        {/* Bottom user profile */}
        <div className="px-4 py-4 border-t border-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#111111] shrink-0"
              style={{ background: 'var(--navigo-yellow)' }}
            >
              AK
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate leading-tight">Aarav Kannan</p>
              <p className="font-mono text-[9px] text-gray-500 truncate uppercase">BCA · Year 2</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Always-visible desktop sidebar */}
      <aside
        className="hidden lg:flex w-[240px] bg-[var(--bg-sidebar)] h-screen flex-col shrink-0 z-30"
        style={{ borderRight: '2px solid #1E1E1E' }}
      >
        {/* Logo area */}
        <div className="px-5 pt-6 pb-4 border-b border-[#1E1E1E]">
          <img
            src="/logo.png"
            alt="NaviGO"
            style={{ height: 36, width: 'auto', objectFit: 'contain' }}
          />
          <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest mt-2">
            NAVIGATION · EXPLORATION · SYSTEM
          </p>
        </div>

        {/* Student/Staff toggle */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex bg-[#1A1A1A] border border-[#2A2A2A] p-0.5">
            <button className="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] bg-[var(--navigo-yellow)]">
              Student
            </button>
            <button className="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              Staff
            </button>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
          <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest px-2 py-2">
            Navigate Campus
          </p>

          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={isActive ? 'text-[var(--navigo-yellow)]' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--navigo-yellow)' }}
                  />
                )}
              </button>
            );
          })}

          <div className="mt-4 mb-2 border-t border-[#1E1E1E]" />

          <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest px-2 py-2">
            Services
          </p>

          {EXTRA_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className={isActive ? 'text-[var(--navigo-yellow)]' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mt-4 mb-2 border-t border-[#1E1E1E]" />

          <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest px-2 py-2">
            Administration
          </p>

          <button
            onClick={() => setActiveView('admin')}
            className={`nav-item ${activeView === 'admin' ? 'active' : ''}`}
          >
            <span className={activeView === 'admin' ? 'text-[var(--navigo-yellow)]' : 'text-gray-500'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <span>Admin Panel</span>
            <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 bg-[var(--navigo-yellow)] text-[#111111] font-bold">ADMIN</span>
          </button>
        </nav>

        {/* User profile */}
        <div className="px-4 py-4 border-t border-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#111111] shrink-0"
              style={{ background: 'var(--navigo-yellow)' }}
            >
              AK
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate leading-tight">Aarav Kannan</p>
              <p className="font-mono text-[9px] text-gray-500 truncate uppercase">BCA · Year 2</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
