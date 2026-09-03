import React, { useContext } from 'react';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';
import { AppContext } from '../App';

// Category → accent color mapping
const CATEGORY_ACCENT = {
  TECH_FEST:    '#3157FF',  // Hyper Blue
  HACKATHON:    '#7C3AED',  // Digital Violet
  LECTURE:      '#00D9FF',  // Electric Cyan
  CULTURAL_FEST:'#FF6B1A',  // Signal Orange
  WORKSHOP:     '#3157FF',  // Hyper Blue
  SPORTS:       '#C7F000',  // Acid Lime (with dark text)
  COMPETITION:  '#7C3AED',  // Digital Violet
};
const CATEGORY_TEXT = {
  SPORTS: '#111111',        // Acid Lime needs dark text
};

export default function EventCard({ event, spanClass }) {
  const { locateOnMap, setRegisterModal } = useContext(AppContext);
  const isLarge = spanClass === 'bento-large';
  const accent = CATEGORY_ACCENT[event.category] || '#3157FF';
  const accentText = CATEGORY_TEXT[event.category] || '#FFFFFF';

  return (
    <div className={`card-brutal flex flex-col overflow-hidden ${spanClass}`}>
      {/* Top accent strip — category color */}
      <div className="h-[5px] w-full flex-shrink-0" style={{ background: accent }} />

      <div className={`flex flex-col flex-1 p-5 ${isLarge ? 'p-6' : ''}`}
        style={{ background: 'var(--bg-panel, #FFFFFF)' }}
      >
        {/* Category tag */}
        <span className="tag-brutal mb-3 self-start">[{event.category}]</span>

        {/* Title */}
        <h3
          className={`font-display uppercase leading-tight mb-2 ${isLarge ? 'text-3xl' : 'text-lg'}`}
          style={{ color: 'var(--fg)' }}
        >
          {event.title}
        </h3>

        {/* Description */}
        <p className={`text-xs mb-4 flex-1 ${isLarge ? 'text-sm' : ''}`}
          style={{ opacity: 0.65, color: 'var(--fg)' }}
        >
          {event.description}
        </p>

        {/* Meta info */}
        <div className="space-y-1.5 mb-4 pt-3" style={{ borderTop: '2px solid var(--border)', opacity: 0.9 }}>
          <div className="flex items-center gap-2">
            <Calendar size={11} style={{ color: accent }} className="flex-shrink-0" />
            <span className="font-mono text-xs" style={{ color: 'var(--fg)' }}>
              DATE: {event.date} // {event.time}
            </span>
          </div>
          <button
            className="flex items-center gap-2 font-mono text-xs transition-opacity group"
            onClick={() => locateOnMap(event.venue)}
            style={{ color: accent }}
          >
            <MapPin size={11} className="flex-shrink-0" />
            <span className="underline">[VENUE: {event.venueName}]</span>
            <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            className="btn-brutal btn-brutal-filled text-xs py-2 px-3 flex-1"
            onClick={() => setRegisterModal(event)}
          >
            REGISTER NOW →
          </button>
          <button
            className="btn-brutal text-xs py-2 px-3"
            onClick={() => locateOnMap(event.venue)}
          >
            LOCATE
          </button>
        </div>
      </div>
    </div>
  );
}
