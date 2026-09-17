import { useContext } from 'react';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';
import { AppContext } from '../App';

// Category → accent color
const CATEGORY_ACCENT = {
  TECH_FEST:    '#3157FF',
  HACKATHON:    '#7C3AED',
  LECTURE:      '#00D9FF',
  CULTURAL_FEST:'#FF6B1A',
  WORKSHOP:     '#F4B400',
  SPORTS:       '#087F45',
  COMPETITION:  '#7C3AED',
};

// Status badge styles
const STATUS_STYLE = {
  UPCOMING:  'bg-[var(--navigo-yellow)] text-[#111111] border-[var(--navigo-yellow)]',
  COMPLETED: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function EventCard({ event, spanClass }) {
  const { locateOnMap, setRegisterModal } = useContext(AppContext);
  const isLarge  = spanClass === 'bento-large';
  const accent   = CATEGORY_ACCENT[event.category] || '#3157FF';

  return (
    <div className={`card-brutal flex flex-col overflow-hidden ${spanClass}`}>
      {/* Top accent strip */}
      <div className="h-[4px] w-full shrink-0" style={{ background: accent }} />

      <div className={`flex flex-col flex-1 bg-white dark:bg-[#1A1A1A] ${isLarge ? 'p-6' : 'p-5'}`}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Category tag */}
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border shrink-0"
            style={{ color: accent, borderColor: accent, background: accent + '18' }}
          >
            [{event.category}]
          </span>
          {/* Status badge */}
          <span className={`font-mono text-[9px] font-bold uppercase px-2 py-0.5 border ${STATUS_STYLE[event.status] || STATUS_STYLE.UPCOMING}`}>
            {event.status}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-display font-bold uppercase leading-tight mb-2 ${isLarge ? 'text-2xl' : 'text-base'}`}>
          {event.title}
        </h3>

        {/* Description */}
        <p className={`text-gray-600 dark:text-gray-400 mb-4 flex-1 ${isLarge ? 'text-sm' : 'text-xs'} line-clamp-3`}>
          {event.description}
        </p>

        {/* Meta */}
        <div className="space-y-1.5 mb-4 pt-3 border-t-2 border-[#E5E7EB] dark:border-[#2A2A2A]">
          {/* Date & time */}
          <div className="flex items-center gap-2">
            <Calendar size={11} style={{ color: accent }} className="shrink-0" />
            <span className="font-mono text-[10px] text-gray-600 dark:text-gray-400">
              {event.date} · {event.time}
            </span>
          </div>

          {/* Venue — clickable */}
          <button
            className="flex items-center gap-2 font-mono text-[10px] group w-full text-left"
            onClick={() => locateOnMap(event.venue)}
            aria-label={`Locate ${event.venueName} on campus map`}
          >
            <MapPin size={11} className="shrink-0" style={{ color: accent }} />
            <span className="underline group-hover:no-underline" style={{ color: accent }}>
              [VENUE: {event.venueName}]
            </span>
            <ArrowRight size={9} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" style={{ color: accent }} />
          </button>

          {/* Organizer */}
          <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">
            By {event.organizer}
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 flex-wrap">
          {event.status === 'UPCOMING' ? (
            <button
              className="btn-brutal btn-brutal-filled text-[10px] py-2 px-3 flex-1"
              onClick={() => setRegisterModal(event)}
              aria-label={`Register for ${event.title}`}
            >
              REGISTER →
            </button>
          ) : (
            <span className="font-mono text-[10px] text-gray-400 uppercase py-2 px-3 border-2 border-[#E5E7EB] dark:border-[#2A2A2A] flex-1 text-center">
              COMPLETED
            </span>
          )}
          <button
            className="btn-brutal text-[10px] py-2 px-3 hover:bg-[var(--navigo-yellow)] hover:border-[var(--navigo-yellow)] hover:text-[#111111]"
            onClick={() => locateOnMap(event.venue)}
            aria-label={`Locate ${event.venueName} on map`}
          >
            <MapPin size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
