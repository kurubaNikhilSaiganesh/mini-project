import { useContext } from 'react';
import { AppContext } from '../App';
import RouteController from './RouteController';
import { TIMETABLE, getCurrentDay, getRoomById } from '../data';

function getCurrentSlot(classId) {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const today = getCurrentDay();
  return TIMETABLE.find(
    (t) => t.classId === classId && t.day === today && hhmm >= t.startTime && hhmm < t.endTime
  );
}

function getNextSlot(classId) {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const today = getCurrentDay();
  return TIMETABLE.filter(
    (t) => t.classId === classId && t.day === today && t.startTime > hhmm
  ).sort((a, b) => a.startTime.localeCompare(b.startTime))[0] || null;
}

// Default class context: CS-2A
const USER_CLASS = 'cs_2a';

const CORE_SYSTEMS = [
  {
    id: 'route',
    label: 'Navigation',
    code: 'SYS-01',
    desc: 'Campus wayfinding with BFS routing',
    color: '#3157FF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
      </svg>
    ),
  },
  {
    id: 'classes',
    label: 'Classes',
    code: 'SYS-02',
    desc: 'Departments, sections & timetables',
    color: '#FF4757',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    id: 'rooms',
    label: 'Rooms',
    code: 'SYS-03',
    desc: 'Building, floor, availability & type',
    color: '#087F45',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><line x1="9" y1="12" x2="15" y2="12"/>
      </svg>
    ),
  },
  {
    id: 'faculty',
    label: 'Faculty',
    code: 'SYS-04',
    desc: 'Staff directory, office & subjects',
    color: '#F4B400',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'timetable',
    label: 'Timetable',
    code: 'SYS-05',
    desc: 'Today & weekly schedule view',
    color: '#747DFF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id: 'events',
    label: 'Events',
    code: 'SYS-06',
    desc: 'Campus bulletin, fests & workshops',
    color: '#087F45',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
];

const WHAT_IT_SOLVES = [
  {
    q: 'Where is my class?',
    a: 'Room numbers, building, floor — linked live to the map.',
    icon: '📍',
  },
  {
    q: 'How do I get there?',
    a: 'BFS route with waypoints, distance, ETA, and accessibility.',
    icon: '🗺️',
  },
  {
    q: "What's on campus today?",
    a: 'Live events bulletin, timetable, and admin announcements.',
    icon: '📋',
  },
];

export default function DashboardView() {
  const { navigateTo, announcements, removeAnnouncement } = useContext(AppContext);
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const currentSlot = getCurrentSlot(USER_CLASS);
  const nextSlot    = getNextSlot(USER_CLASS);
  const displaySlot = currentSlot || nextSlot;
  const nextRoom    = displaySlot ? getRoomById(displaySlot.roomId) : null;

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Admin announcement banner ── */}
      {announcements.length > 0 && (
        <div className="border-b-2 border-[#FF4757] bg-[#FF4757]/10 px-4 md:px-8 py-3">
          <div className="flex flex-col gap-1.5">
            {announcements.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs text-[#FF4757]">
                  <span className="font-bold">[{a.severity}]</span> {a.text}
                </p>
                <button
                  onClick={() => removeAnnouncement(a.id)}
                  className="font-mono text-[9px] text-[#FF4757] hover:underline shrink-0"
                  aria-label="Dismiss announcement"
                >
                  DISMISS
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="px-4 md:px-8 pt-10 pb-8 border-b-2 border-[#111111] dark:border-[#333333]">
        <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-3">
          {date.toUpperCase()}
        </p>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/logo.png"
                alt="NaviGO"
                style={{ height: 44, width: 'auto', objectFit: 'contain' }}
              />
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest leading-relaxed">
                NAVIGATION<br/>EXPLORATION · SYSTEM
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold uppercase leading-none tracking-tight">
              KNOW<br />WHERE<br />
              <span style={{ color: 'var(--navigo-yellow)' }}>TO GO.</span>
            </h1>
            <p className="mt-4 text-gray-500 text-sm max-w-md">
              Real-time campus wayfinding, class schedules, room availability, and event bulletin — all in one system.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col gap-3 lg:items-end">
            <button
              onClick={() => navigateTo('route')}
              className="btn-primary text-sm px-8 py-3 w-full lg:w-auto"
            >
              EXPLORE CAMPUS
            </button>
            <div className="flex gap-2">
              <button onClick={() => navigateTo('rooms')} className="btn-secondary text-xs py-2 px-5 flex-1 lg:flex-none">
                FIND A ROOM
              </button>
              <button onClick={() => navigateTo('timetable')} className="btn-secondary text-xs py-2 px-5 flex-1 lg:flex-none">
                VIEW TIMETABLE
              </button>
            </div>
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Aarav.
            </p>
          </div>
        </div>
      </div>

      {/* ── What NaviGO Solves ── */}
      <div className="px-4 md:px-8 py-8 border-b-2 border-[#111111] dark:border-[#333333]">
        <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-5">What NaviGO Solves</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHAT_IT_SOLVES.map((item) => (
            <div key={item.q} className="border-2 border-[#111111] dark:border-[#333333] p-5 bg-white dark:bg-[#141414]">
              <span className="text-2xl mb-3 block" role="img" aria-label="">{item.icon}</span>
              <h3 className="font-bold text-sm mb-1">{item.q}</h3>
              <p className="font-mono text-[10px] text-gray-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Route Finder + Next Stop ── */}
      <div className="px-4 md:px-8 py-8 border-b-2 border-[#111111] dark:border-[#333333]">
        <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-5">Quick Route</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RouteController />
          </div>

          {/* Next Stop card */}
          <div className="border-2 border-[#111111] dark:border-[#333333] bg-white dark:bg-[#141414] p-6 flex flex-col" style={{ boxShadow: '4px 4px 0 #111111' }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                  {currentSlot ? 'Current Class' : nextSlot ? 'Next Stop' : 'No More Classes'}
                </p>
                {displaySlot ? (
                  <>
                    <h3 className="font-mono text-2xl font-bold">{nextRoom?.number || '—'}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                      {displaySlot.subject}<br />
                      <span className="font-mono">{displaySlot.startTime}</span>
                    </p>
                  </>
                ) : (
                  <h3 className="font-mono text-lg font-bold text-gray-400">—</h3>
                )}
              </div>
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0"
                style={{ background: 'var(--navigo-yellow)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
            </div>

            <div className="mt-auto">
              {displaySlot && (
                <>
                  <div className="w-full bg-[#F3F3F3] dark:bg-[#2A2A2A] h-1.5 mb-3 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{ width: currentSlot ? '60%' : '0%', background: 'var(--navigo-green)' }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-gray-400 flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {currentSlot ? 'In Progress' : 'Upcoming'}
                    </span>
                    <button
                      onClick={() => navigateTo('route')}
                      className="font-bold text-xs flex items-center gap-1 hover:underline"
                      style={{ color: 'var(--navigo-green)' }}
                    >
                      Route there
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </>
              )}
              {!displaySlot && (
                <p className="font-mono text-[10px] text-gray-400 text-center">No classes scheduled today.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Core Systems Grid ── */}
      <div className="px-4 md:px-8 py-8 border-b-2 border-[#111111] dark:border-[#333333]">
        <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-5">Core Systems</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CORE_SYSTEMS.map((sys) => (
            <button
              key={sys.id}
              onClick={() => navigateTo(sys.id)}
              className="text-left p-5 flex flex-col gap-3 group border-2 border-[#111111] dark:border-[#333333] bg-white dark:bg-[#141414] relative overflow-hidden transition-all hover:-translate-x-px hover:-translate-y-px"
              style={{ boxShadow: '4px 4px 0 #111111' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '7px 7px 0 #111111'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '4px 4px 0 #111111'; }}
            >
              {/* Top accent strip */}
              <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: sys.color }} />

              <div className="flex items-start justify-between">
                <div style={{ color: sys.color }}>{sys.icon}</div>
                <span className="font-mono text-[9px] text-gray-400">{sys.code}</span>
              </div>

              <div>
                <h3 className="font-bold text-sm uppercase tracking-tight">{sys.label}</h3>
                <p className="font-mono text-[9px] text-gray-400 mt-0.5 leading-relaxed">{sys.desc}</p>
              </div>

              <div
                className="font-mono text-[9px] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: sys.color }}
              >
                OPEN →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Campus status strip ── */}
      <div className="px-4 md:px-8 py-4 flex items-center gap-3 bg-[#F0EDE4] dark:bg-[#1A1A1A]">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: announcements.length > 0 ? '#FF4757' : 'var(--navigo-green)', boxShadow: `0 0 0 3px ${announcements.length > 0 ? 'rgba(255,71,87,0.2)' : 'rgba(8,127,69,0.2)'}` }}
        />
        <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
          {announcements.length > 0 ? `${announcements.length} active broadcast${announcements.length > 1 ? 's' : ''}` : 'Campus is calm · No active notices'}
        </p>
        <button
          onClick={() => navigateTo('events')}
          className="ml-auto font-mono text-[10px] text-gray-400 hover:text-[var(--navigo-yellow)] transition-colors"
        >
          View events →
        </button>
      </div>
    </div>
  );
}
