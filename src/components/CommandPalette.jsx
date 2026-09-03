import React, { useContext, useState, useRef, useEffect } from 'react';
import { Search, X, ArrowRight, Building2 } from 'lucide-react';
import { AppContext } from '../App';
import { BUILDINGS } from '../data';

export default function CommandPalette() {
  const { setCmdOpen, setSelectedBuilding, setViewBox, locateOnMap } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = BUILDINGS.filter((b) =>
    b.label.toLowerCase().includes(query.toLowerCase()) ||
    b.department.toLowerCase().includes(query.toLowerCase()) ||
    b.type.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (building) => {
    locateOnMap(building.id);
    setCmdOpen(false);
  };

  const handleKey = (e, building) => {
    if (e.key === 'Enter' || e.key === ' ') handleSelect(building);
  };

  return (
    <div className="cmd-overlay" onClick={() => setCmdOpen(false)}>
      <div
        className="w-full max-w-xl mx-4 border-4 border-black dark:border-white bg-white dark:bg-[#1A1A1A] shadow-brutal"
        style={{ boxShadow: '8px 8px 0px #000' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center" style={{ borderBottom: '3px solid #111111' }}>
          {/* Mini logo */}
          <img
            src="/logo.png"
            alt="NaviGO"
            style={{ height: '32px', width: 'auto', objectFit: 'contain', marginLeft: '12px', flexShrink: 0, display: 'block' }}
          />
          <div style={{ width: '1px', height: '24px', background: '#111111', margin: '0 12px', opacity: 0.2 }} />
          <Search size={16} style={{ opacity: 0.5, flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH BUILDINGS, DEPARTMENTS..."
            className="flex-1 px-3 py-4 font-mono text-sm bg-transparent outline-none placeholder:opacity-40 uppercase tracking-wide"
          />
          <button
            className="mr-3 font-mono text-xs border-2 px-2 py-1 transition-colors"
            style={{ borderColor: '#111111' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#3157FF'; e.currentTarget.style.color = '#FFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit'; }}
            onClick={() => setCmdOpen(false)}
          >
            ESC
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 font-mono text-sm text-center opacity-50">
              [NO RESULTS FOUND]
            </div>
          ) : (
            filtered.map((b, idx) => (
              <div
                key={b.id}
                role="button"
                tabIndex={0}
                aria-label={`Navigate to ${b.label}`}
                onClick={() => handleSelect(b)}
                onKeyDown={(e) => handleKey(e, b)}
                className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors group border-b border-[#E5E5E5] dark:border-[#3A3A3A]"
              >
                <div className="flex-shrink-0 w-8 h-8 border-2 border-current flex items-center justify-center">
                  <Building2 size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm uppercase">{b.label}</p>
                  <p className="font-mono text-xs opacity-60">{b.code} // {b.department}</p>
                </div>
                <span className="font-mono text-xs opacity-40 uppercase group-hover:opacity-100">
                  [{b.type}]
                </span>
                <ArrowRight size={14} className="opacity-40 group-hover:opacity-100" />
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 flex gap-4 items-center" style={{ borderTop: '2px solid #E5E5E5' }}>
          <span className="font-mono text-xs" style={{ opacity: 0.4 }}>↑↓ NAVIGATE</span>
          <span className="font-mono text-xs" style={{ opacity: 0.4 }}>↵ SELECT</span>
          <span className="font-mono text-xs" style={{ opacity: 0.4 }}>ESC CLOSE</span>
          <span className="font-mono text-xs ml-auto" style={{ color: '#3157FF', opacity: 0.8 }}>
            {filtered.length} RESULTS
          </span>
        </div>
      </div>
    </div>
  );
}
