import { useState, useContext } from 'react';
import { AppContext } from '../App';
import MarqueeTicker from './MarqueeTicker';
import EventCard from './EventCard';

const STATUSES = ['ALL', 'UPCOMING', 'COMPLETED'];

const SPAN_CLASS = {
  large:  'bento-large',
  medium: 'bento-medium',
  small:  'bento-small',
};

export default function EventsSection() {
  const { events } = useContext(AppContext);
  const [activeCat,    setActiveCat]    = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');

  const categories = ['ALL', ...new Set(events.map((e) => e.category))];

  const filtered = events.filter((e) => {
    const catOk    = activeCat    === 'ALL' || e.category === activeCat;
    const statusOk = activeStatus === 'ALL' || e.status   === activeStatus;
    return catOk && statusOk;
  });

  const upcomingCount  = events.filter((e) => e.status === 'UPCOMING').length;
  const completedCount = events.filter((e) => e.status === 'COMPLETED').length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Section header */}
      <div className="px-4 md:px-8 py-8 border-b-2 border-[#111111] dark:border-[#333333]">
        <p className="font-mono text-[10px] text-[var(--navigo-yellow)] uppercase tracking-widest mb-2">
          [EVENTS_BULLETIN]
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Campus Events.
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {upcomingCount} upcoming · {completedCount} completed
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-6">
            {[
              { label: 'Total', value: events.length },
              { label: 'Upcoming', value: upcomingCount },
              { label: 'Open Reg.', value: upcomingCount },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="font-display text-2xl font-bold" style={{ color: 'var(--navigo-yellow)' }}>
                  {String(stat.value).padStart(2, '0')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* Filters */}
      <div className="px-4 md:px-8 py-4 border-b-2 border-[#111111] dark:border-[#333333] flex flex-wrap gap-3">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 transition-all ${
                activeCat === cat
                  ? 'border-[#111111] bg-[var(--navigo-yellow)] text-[#111111]'
                  : 'border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500 hover:border-[#111111] dark:hover:border-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-px bg-[#E5E7EB] dark:bg-[#2A2A2A] hidden sm:block" />

        {/* Status filters */}
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border-2 transition-all ${
                activeStatus === s
                  ? 'border-[#111111] bg-[#111111] text-white'
                  : 'border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500 hover:border-[#111111] dark:hover:border-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Events grid */}
      <div className="px-4 md:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="border-2 border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] p-12 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-gray-400">
              NO EVENTS MATCH CURRENT FILTERS
            </p>
            <button
              onClick={() => { setActiveCat('ALL'); setActiveStatus('ALL'); }}
              className="mt-4 btn-secondary text-xs py-2 px-6"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="bento-grid">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                spanClass={SPAN_CLASS[event.span] || 'bento-small'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom stats bar */}
      <div className="border-t-2 border-[#111111] dark:border-[#333333] px-4 md:px-8 py-4 flex flex-wrap gap-6 bg-[#F0EDE4] dark:bg-[#1A1A1A]">
        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">BULLETIN_SYS v2.0 // LIVE</span>
        <span className="font-mono text-[10px] text-gray-400 uppercase ml-auto">{filtered.length} of {events.length} events shown</span>
      </div>
    </div>
  );
}
