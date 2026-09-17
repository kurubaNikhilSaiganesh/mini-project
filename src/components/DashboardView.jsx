import { useContext } from 'react';
import { AppContext } from '../App';
import RouteController from './RouteController';
import { TIMETABLE, CLASSES, getCurrentDay, getRoomById } from '../data';

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

// Default class context: CS-2A (BCA Year 2 stand-in)
const USER_CLASS = 'cs_2a';

export default function DashboardView() {
  const { navigateTo } = useContext(AppContext);
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const currentSlot = getCurrentSlot(USER_CLASS);
  const nextSlot    = getNextSlot(USER_CLASS);
  const displaySlot = currentSlot || nextSlot;
  const nextRoom    = displaySlot ? getRoomById(displaySlot.roomId) : null;

  // Quick action cards
  const quickCards = [
    {
      id: 'route',
      label: 'Find a Route',
      sub: 'Room to room',
      color: '#3157FF',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
        </svg>
      ),
    },
    {
      id: 'directory',
      label: 'Campus Places',
      sub: 'Buildings & rooms',
      color: '#FF4757',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: 'timetable',
      label: 'Timetable',
      sub: "Today's schedule",
      color: '#F4B400',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      id: 'events',
      label: 'Events',
      sub: 'Campus showcase',
      color: '#087F45',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-2">
          {date.toUpperCase()}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},
          <br />
          <span style={{ color: 'var(--navigo-yellow)' }}>Aarav.</span>
        </h1>
      </div>

      {/* Route Finder + Next Stop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
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

      {/* Quick action cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickCards.map((card) => (
          <button
            key={card.id}
            onClick={() => navigateTo(card.id)}
            className="text-left p-5 h-[120px] flex flex-col justify-between group border-2 border-[#111111] dark:border-[#333333] bg-white dark:bg-[#141414] relative overflow-hidden transition-all hover:-translate-x-px hover:-translate-y-px"
            style={{ boxShadow: '4px 4px 0 #111111' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '6px 6px 0 #111111'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '4px 4px 0 #111111'; }}
          >
            {/* Color accent strip */}
            <div
              className="absolute top-0 left-0 w-full h-[3px]"
              style={{ background: card.color }}
            />

            {/* Arrow */}
            <svg
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>

            {/* Icon */}
            <div style={{ color: card.color }}>
              {card.icon}
            </div>

            {/* Labels */}
            <div>
              <h4 className="font-bold text-sm">{card.label}</h4>
              <p className="font-mono text-[9px] text-gray-400 uppercase">{card.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Campus is calm strip */}
      <div className="mt-6 flex items-center gap-3 border-2 border-[#E5E7EB] dark:border-[#2A2A2A] px-4 py-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--navigo-green)', boxShadow: '0 0 0 3px rgba(8,127,69,0.2)' }}
        />
        <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">Campus is calm · No active notices</p>
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
