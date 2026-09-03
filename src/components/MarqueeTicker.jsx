import React from 'react';
import { MARQUEE_ITEMS } from '../data';

export default function MarqueeTicker() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      className="overflow-hidden py-2.5"
      style={{
        background: '#3157FF',
        borderTop: '4px solid #111111',
        borderBottom: '4px solid #111111',
      }}
    >
      <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs tracking-widest flex-shrink-0 px-6 whitespace-nowrap"
            style={{ color: '#C7F000' }}
          >
            {item}
            <span className="mx-6" style={{ color: '#FFFFFF', opacity: 0.4 }}>│</span>
          </span>
        ))}
      </div>
    </div>
  );
}
