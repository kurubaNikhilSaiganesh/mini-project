import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MARQUEE_ITEMS } from '../data';

export default function MarqueeTicker() {
  const ctx = useContext(AppContext);
  // Prepend admin announcements to base marquee items
  const adminAnns = ctx?.announcements ?? [];
  const baseItems = MARQUEE_ITEMS;
  const allItems = [
    ...adminAnns.map((a) => `[${a.severity}] ${a.text}`),
    ...baseItems,
  ];
  // Duplicate for seamless loop
  const items = [...allItems, ...allItems];

  return (
    <div className="px-3 md:px-5 py-2">
      <div className="overflow-hidden py-2 glass-2 rounded-full border border-[var(--glass-border-strong)] shadow-sm">
        <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={i}
            className="font-mono text-[11px] font-bold tracking-widest flex-shrink-0 px-6 whitespace-nowrap uppercase"
            style={{ color: item.startsWith('[ALERT]') || item.startsWith('[EMERGENCY]') ? 'var(--red)' : 'var(--blue)' }}
          >
            {item}
            <span className="mx-6" style={{ color: '#FFFFFF', opacity: 0.4 }}>│</span>
          </span>
        ))}
      </div>
    </div>
    </div>
  );
}

