import { useContext, useState, useRef, useEffect } from 'react';
import { Search, Building2, ArrowRight } from 'lucide-react';
import { AppContext } from '../App';
import { BUILDINGS, ROOMS, FACULTY } from '../data';

// Build searchable items from all data sources
const SEARCH_ITEMS = [
  ...BUILDINGS.map((b) => ({
    id: b.id,
    title: b.label,
    subtitle: `${b.code} // ${b.department}`,
    tag: b.type.toUpperCase(),
    type: 'building',
    action: 'locate',
  })),
  ...ROOMS.map((r) => ({
    id: r.id,
    title: `Room ${r.number}`,
    subtitle: `${r.building} · ${r.floor} Floor · ${r.type}`,
    tag: 'ROOM',
    type: 'room',
    action: 'room',
    buildingId: r.buildingId,
  })),
  ...FACULTY.map((f) => ({
    id: f.id,
    title: f.name,
    subtitle: `${f.designation} · ${f.department}`,
    tag: 'FACULTY',
    type: 'faculty',
    action: 'faculty',
    buildingId: f.buildingId,
  })),
];

export default function CommandPalette() {
  const { setCmdOpen, locateOnMap } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.tag.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : BUILDINGS.slice(0, 8).map((b) => ({
        id: b.id,
        title: b.label,
        subtitle: `${b.code} // ${b.department}`,
        tag: b.type.toUpperCase(),
        type: 'building',
        action: 'locate',
      }));

  // Reset cursor when results change
  useEffect(() => {
    setCursor(0);
  }, [query]);

  // Scroll cursor item into view
  useEffect(() => {
    const el = listRef.current?.children[cursor];
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const handleSelect = (item) => {
    if (item.action === 'locate' || item.action === 'room' || item.action === 'faculty') {
      const bid = item.buildingId || item.id;
      locateOnMap(bid);
    }
    setCmdOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[cursor]) handleSelect(filtered[cursor]);
    } else if (e.key === 'Escape') {
      setCmdOpen(false);
    }
  };

  const TAG_COLORS = {
    BUILDING: '#3157FF', ACADEMIC: '#3157FF', ADMIN: '#FF4757',
    LIBRARY: '#747DFF', LAB: '#F4B400', HOSTEL: '#00D9FF',
    CANTEEN: '#FF6B1A', AUDITORIUM: '#9333EA', SPORTS: '#087F45',
    GATE: '#9CA3AF', ROOM: '#087F45', FACULTY: '#F4B400',
  };

  return (
    <div
      className="cmd-overlay"
      onClick={() => setCmdOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Campus search"
    >
      <div
        className="w-full max-w-lg mx-4 border-2 border-[#111111] dark:border-white bg-white dark:bg-[#111111]"
        style={{ boxShadow: '8px 8px 0 #111111' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input row */}
        <div
          className="flex items-center border-b-2 border-[#111111] dark:border-[#333333]"
          role="searchbox"
        >
          <div className="pl-4 shrink-0">
            <img
              src="/logo.png"
              alt="NaviGO"
              style={{ height: 24, width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <div className="w-px h-6 bg-[#E5E7EB] dark:bg-[#333333] mx-3" />
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="SEARCH CAMPUS — BUILDINGS, ROOMS, FACULTY"
            className="flex-1 px-3 py-4 font-mono text-xs bg-transparent outline-none placeholder:text-gray-400 placeholder:text-[10px] uppercase tracking-wide dark:text-white"
            aria-autocomplete="list"
            aria-controls="cmd-results"
            aria-activedescendant={`cmd-item-${cursor}`}
          />
          <button
            className="mr-3 font-mono text-[10px] border-2 border-[#111111] dark:border-[#333333] px-2 py-1 hover:bg-[var(--navigo-yellow)] hover:border-[var(--navigo-yellow)] hover:text-[#111111] transition-colors"
            onClick={() => setCmdOpen(false)}
            aria-label="Close palette"
          >
            ESC
          </button>
        </div>

        {/* Section label */}
        {!query && (
          <div className="px-4 pt-3 pb-1">
            <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">Quick Access</p>
          </div>
        )}
        {query && filtered.length > 0 && (
          <div className="px-4 pt-3 pb-1">
            <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{query}&quot;
            </p>
          </div>
        )}

        {/* Results */}
        <div
          id="cmd-results"
          ref={listRef}
          className="max-h-72 overflow-y-auto"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-8 font-mono text-xs text-center text-gray-400 uppercase tracking-wider">
              [NO RESULTS] &mdash; Try &quot;library&quot;, &quot;lab&quot;, or a faculty name
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isActive = cursor === idx;
              const tagColor = TAG_COLORS[item.tag] || '#9CA3AF';
              return (
                <div
                  id={`cmd-item-${idx}`}
                  key={`${item.type}-${item.id}`}
                  role="option"
                  aria-selected={isActive}
                  tabIndex={-1}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setCursor(idx)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#E5E7EB] dark:border-[#1A1A1A] transition-colors ${
                    isActive
                      ? 'bg-[var(--navigo-yellow)] text-[#111111]'
                      : 'hover:bg-[#F7F5F0] dark:hover:bg-[#1A1A1A]'
                  }`}
                >
                  {/* Icon box */}
                  <div
                    className="w-8 h-8 border-2 flex items-center justify-center shrink-0"
                    style={{
                      borderColor: isActive ? '#111111' : tagColor,
                      color: isActive ? '#111111' : tagColor,
                    }}
                  >
                    <Building2 size={13} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.title}</p>
                    <p className={`font-mono text-[9px] truncate ${isActive ? 'text-[#333333]' : 'text-gray-400'}`}>
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Tag */}
                  <span
                    className="font-mono text-[9px] font-bold px-1.5 py-0.5 border shrink-0"
                    style={{
                      color: isActive ? '#111111' : tagColor,
                      borderColor: isActive ? '#111111' : tagColor,
                      background: isActive ? 'transparent' : tagColor + '18',
                    }}
                  >
                    {item.tag}
                  </span>

                  <ArrowRight size={12} className={isActive ? 'text-[#111111]' : 'text-gray-300'} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint bar */}
        <div className="px-4 py-2 flex gap-4 items-center border-t-2 border-[#111111] dark:border-[#333333] bg-[#F7F5F0] dark:bg-[#0A0A0A]">
          <span className="font-mono text-[9px] text-gray-400 uppercase">↑↓ Navigate</span>
          <span className="font-mono text-[9px] text-gray-400 uppercase">↵ Select</span>
          <span className="font-mono text-[9px] text-gray-400 uppercase">ESC Close</span>
          <span className="font-mono text-[9px] ml-auto" style={{ color: 'var(--navigo-yellow)' }}>
            {SEARCH_ITEMS.length} items indexed
          </span>
        </div>
      </div>
    </div>
  );
}
