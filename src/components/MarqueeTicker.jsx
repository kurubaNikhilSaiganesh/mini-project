import { useContext } from 'react';
import { AppContext } from '../App';
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
            style={{ color: item.startsWith('[ALERT]') || item.startsWith('[EMERGENCY]') ? '#FF4757' : '#C7F000' }}
          >
            {item}
            <span className="mx-6" style={{ color: '#FFFFFF', opacity: 0.4 }}>│</span>
          </span>
        ))}
      </div>
    </div>
  );
}
