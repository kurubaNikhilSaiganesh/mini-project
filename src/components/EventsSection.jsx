import React from 'react';
import { EVENTS } from '../data';
import MarqueeTicker from './MarqueeTicker';
import EventCard from './EventCard';

const SPAN_CLASS = {
  large: 'bento-large',
  medium: 'bento-medium',
  small: 'bento-small',
};

export default function EventsSection() {
  return (
    <section id="events" className="border-t-4 border-black dark:border-white">
      {/* Section Header */}
      <div className="border-b-4 px-6 py-4" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs" style={{ color: '#3157FF' }}>[02]</span>
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">
            BULLETIN // CAMPUS SHOWCASE &amp; EVENTS
          </h2>
        </div>
        <div className="font-mono text-xs mt-2" style={{ color: '#7C3AED', opacity: 0.7 }}>
          {'// ─────────────────────────────────────────────────── //'}
        </div>
      </div>

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* Bento Grid */}
      <div className="px-6 py-8">
        <div className="bento-grid">
          {EVENTS.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              spanClass={SPAN_CLASS[event.span] || 'bento-small'}
            />
          ))}
        </div>
      </div>

      {/* Bottom stats bar — Warm Paper */}
      <div className="border-t-4 px-6 py-4 flex flex-wrap gap-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-dark, #E8E5DC)' }}>
        <div>
          <p className="font-mono text-xs" style={{ color: '#7C3AED' }}>TOTAL EVENTS</p>
          <p className="font-display text-2xl">{EVENTS.length.toString().padStart(2, '0')}</p>
        </div>
        <div>
          <p className="font-mono text-xs" style={{ color: '#7C3AED' }}>UPCOMING THIS MONTH</p>
          <p className="font-display text-2xl">04</p>
        </div>
        <div>
          <p className="font-mono text-xs" style={{ color: '#7C3AED' }}>OPEN REGISTRATIONS</p>
          <p className="font-display text-2xl">06</p>
        </div>
        <div className="ml-auto self-center">
          <span className="font-mono text-xs" style={{ color: '#00D9FF', opacity: 0.7 }}>[BULLETIN_SYS v2.0 // LIVE]</span>
        </div>
      </div>
    </section>
  );
}
