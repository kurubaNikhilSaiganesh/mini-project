import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import RouteController from './RouteController';
import { TIMETABLE, getCurrentDay, getRoomById } from '../data';
import { ArrowRight, Sparkles, Navigation, BookOpen, Building, Users, Clock, Trophy } from 'lucide-react';

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
    desc: 'Campus wayfinding with interactive BFS routing',
    color: '#3B82F6',
    icon: <Navigation size={22} className="text-blue-500" />,
  },
  {
    id: 'classes',
    label: 'Classes',
    code: 'SYS-02',
    desc: 'Departments, academic sections & schedules',
    color: '#EF4444',
    icon: <BookOpen size={22} className="text-red-500" />,
  },
  {
    id: 'rooms',
    label: 'Rooms',
    code: 'SYS-03',
    desc: 'Building, floor status, capacity & room types',
    color: '#087F45',
    icon: <Building size={22} className="text-emerald-500" />,
  },
  {
    id: 'faculty',
    label: 'Faculty',
    code: 'SYS-04',
    desc: 'Staff directory, office cabins & subject leads',
    color: '#F4B400',
    icon: <Users size={22} className="text-amber-500" />,
  },
  {
    id: 'timetable',
    label: 'Timetable',
    code: 'SYS-05',
    desc: 'Today & weekly period calendar view',
    color: '#8B5CF6',
    icon: <Clock size={22} className="text-purple-500" />,
  },
  {
    id: 'events',
    label: 'Events',
    code: 'SYS-06',
    desc: 'Campus bulletin, hackathons, fests & workshops',
    color: '#10B981',
    icon: <Trophy size={22} className="text-teal-500" />,
  },
];

const WHAT_IT_SOLVES = [
  {
    q: 'Where is my class?',
    a: 'Real-time room numbers, building coordinates & floor levels linked live to the map.',
    icon: '📍',
  },
  {
    q: 'How do I get there?',
    a: 'Instant BFS pathfinding with turn-by-turn waypoints, walking distance, ETA, and ramp access.',
    icon: '🗺️',
  },
  {
    q: "What's on campus today?",
    a: 'Live events bulletin, interactive timetables, exam seating, and broadcast notices.',
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
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-8 page-enter">

      {/* ── Admin announcement banner ── */}
      {announcements.length > 0 && (
        <div
          className="glass-card p-4 md:p-5 flex flex-col gap-2 rounded-2xl"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            borderColor: 'rgba(239, 68, 68, 0.25)',
          }}
        >
          {announcements.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="font-mono text-xs font-semibold text-red-500">
                  <span className="font-bold uppercase tracking-wider">[{a.severity}]</span> {a.text}
                </p>
              </div>
              <button
                onClick={() => removeAnnouncement(a.id)}
                className="glass-btn glass-btn-ghost glass-btn-sm text-[10px] text-red-500 hover:text-red-600 rounded-full shrink-0"
                aria-label="Dismiss announcement"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Hero Glass Showcase ── */}
      <div
        className="glass-card glass-2 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl"
        style={{
          border: '1px solid var(--glass-border-strong)',
        }}
      >
        {/* Ambient radial glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--green) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-xl">
            {/* Live date pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 glass-1 border border-[var(--glass-border)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                {date} · ALTS CAMPUS
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-2xl glass-2 border border-[var(--glass-border)] shadow-xs">
                <img
                  src="/logo.png"
                  alt="ALTS"
                  style={{ height: 36, width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] leading-relaxed">
                Autonomous University Platform<br />Spatial Navigation · Schedules
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black uppercase leading-[1.05] tracking-tight text-[var(--text-primary)]">
              Know Where<br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
                To Go.
              </span>
            </h1>

            <p className="mt-4 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
              Real-time campus wayfinding, dynamic class timetables, interactive floor directories, and live exam utilities — designed in fluid glass.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col gap-3 sm:items-end w-full sm:w-auto">
            <button
              onClick={() => navigateTo('route')}
              className="glass-btn glass-btn-primary glass-btn-lg rounded-full shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Navigation size={18} />
              <span>Explore Campus</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigateTo('rooms')}
                className="glass-btn flex-1 sm:flex-none text-xs rounded-full py-2.5 px-5"
              >
                Find a Room
              </button>
              <button
                onClick={() => navigateTo('timetable')}
                className="glass-btn flex-1 sm:flex-none text-xs rounded-full py-2.5 px-5"
              >
                Timetable
              </button>
            </div>

            <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider text-right">
              Welcome back, Aarav · BCA Year 2
            </p>
          </div>
        </div>
      </div>

      {/* ── Route Finder + Next Stop Section ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--text-primary)]">
              Instant Wayfinding & Next Stop
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Live Schedule Sync
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RouteController />
          </div>

          {/* Next Stop Card */}
          <div
            className="glass-card glass-2 rounded-3xl p-6 md:p-7 flex flex-col justify-between border border-[var(--glass-border-strong)] shadow-lg relative overflow-hidden"
          >
            {/* Ambient accent blob */}
            <div
              className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-15 blur-2xl pointer-events-none"
              style={{ background: 'var(--gold)' }}
            />

            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider mb-2 glass-1 border border-[var(--glass-border)] text-amber-500">
                    {currentSlot ? 'Current Class' : nextSlot ? 'Next Stop' : 'Schedule Finished'}
                  </span>
                  {displaySlot ? (
                    <>
                      <h3 className="font-mono text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        {nextRoom?.number || '—'}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-snug font-medium">
                        {displaySlot.subject}<br />
                        <span className="font-mono text-[var(--text-muted)] text-[11px]">{displaySlot.startTime} – {displaySlot.endTime}</span>
                      </p>
                    </>
                  ) : (
                    <h3 className="font-mono text-xl font-bold text-[var(--text-muted)]">No Classes Left</h3>
                  )}
                </div>

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
                  style={{ background: 'var(--gold)', color: '#111' }}
                >
                  <Clock size={22} strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
              {displaySlot ? (
                <>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full mb-3 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: currentSlot ? '65%' : '20%',
                        background: 'linear-gradient(90deg, var(--gold) 0%, var(--green) 100%)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${currentSlot ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                      {currentSlot ? 'In Progress' : 'Upcoming Next'}
                    </span>
                    <button
                      onClick={() => navigateTo('route')}
                      className="glass-btn glass-btn-primary glass-btn-sm rounded-full text-xs font-bold flex items-center gap-1"
                    >
                      <span>Route Here</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </>
              ) : (
                <p className="font-mono text-xs text-[var(--text-muted)] text-center py-2">
                  All classes for today are complete.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── What NaviGO Solves ── */}
      <div className="space-y-4">
        <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest px-1">
          Designed for ALTS Students & Visitors
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHAT_IT_SOLVES.map((item) => (
            <div
              key={item.q}
              className="glass-card rounded-3xl p-6 border border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl mb-4 block" role="img" aria-label="Feature icon">{item.icon}</span>
                <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-1.5">{item.q}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Core Systems Grid ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
            Core University Systems
          </p>
          <span className="font-mono text-[10px] text-[var(--text-subtle)]">6 Active Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CORE_SYSTEMS.map((sys) => (
            <button
              key={sys.id}
              onClick={() => navigateTo(sys.id)}
              className="glass-card rounded-3xl p-6 text-left flex flex-col justify-between group border border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] hover:shadow-lg transition-all duration-200 relative overflow-hidden"
            >
              {/* Subtle accent corner glow */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-xl pointer-events-none transition-opacity group-hover:opacity-25"
                style={{ background: sys.color }}
              />

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl glass-2 border border-[var(--glass-border)] shadow-xs transition-transform group-hover:scale-110 duration-200">
                    {sys.icon}
                  </div>
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-full glass-1 border border-[var(--glass-border)] text-[var(--text-muted)] font-semibold">
                    {sys.code}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base uppercase tracking-tight text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">
                  {sys.label}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {sys.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">
                <span>Access Module</span>
                <ArrowRight size={14} className="transform transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Campus Status Strip ── */}
      <div className="glass-card rounded-full px-6 py-3.5 flex flex-col sm:flex-row items-center gap-3 justify-between border border-[var(--glass-border)] shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              background: announcements.length > 0 ? '#EF4444' : 'var(--green)',
              boxShadow: `0 0 12px ${announcements.length > 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(8, 127, 69, 0.6)'}`,
            }}
          />
          <p className="font-mono text-xs text-[var(--text-secondary)] tracking-wide">
            {announcements.length > 0 ? `${announcements.length} broadcast update(s) active` : 'Campus Status: Normal Operations · All Venues Open'}
          </p>
        </div>
        <button
          onClick={() => navigateTo('events')}
          className="font-mono text-xs text-amber-500 hover:text-amber-600 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>View Campus Events</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
