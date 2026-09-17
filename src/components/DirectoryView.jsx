import { useState, useContext } from 'react';
import { BUILDINGS } from '../data';
import { AppContext } from '../App';

const FILTER_DEFS = [
  { key: 'all', label: 'All places' },
  { key: 'academic', label: 'Academic block' },
  { key: 'admin', label: 'Student services' },
  { key: 'canteen', label: 'Food & gathering' },
  { key: 'library', label: 'Study & research' },
  { key: 'hostel', label: 'Residential' },
  { key: 'sports', label: 'Sports' },
];

const TYPE_COLORS = {
  admin:      '#FF4757',
  academic:   '#3157FF',
  library:    '#747DFF',
  lab:        '#F4B400',
  hostel:     '#00D9FF',
  sports:     '#087F45',
  canteen:    '#FF6B1A',
  auditorium: '#9333EA',
  gate:       '#9CA3AF',
};

const TYPE_ICONS = {
  admin:      'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  academic:   'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  library:    'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  lab:        'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l2 2-2 2V3m0 14H5a2 2 0 0 1-2-2v-4',
  hostel:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  canteen:    'M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3',
  auditorium: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  sports:     'M6.5 6.5a5 5 0 1 0 7 7 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  gate:       'M3 21V9l9-6 9 6v12 M9 21V9 M15 21V9',
};

export default function DirectoryView({ setSelectedBuilding }) {
  const { navigateTo } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const buildings = BUILDINGS.filter((b) => b.type !== 'gate');

  const filtered = buildings.filter((b) => {
    const matchesFilter =
      activeFilter === 'all' ||
      b.type === activeFilter ||
      (activeFilter === 'admin' && ['admin', 'canteen', 'auditorium'].includes(b.type));

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.label.toLowerCase().includes(q) ||
      b.department.toLowerCase().includes(q) ||
      b.type.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.facilities.some((f) => f.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const handleReset = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  const handleViewDetails = (b) => {
    setSelectedBuilding(b);
    navigateTo('route'); // go to map view to show popup
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] text-[var(--navigo-yellow)] uppercase tracking-widest mb-2">
            [CAMPUS_DIRECTORY]
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">
            Campus Directory.
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            The people, rooms and places behind every destination at ALTS.
          </p>
        </div>
        {(searchQuery || activeFilter !== 'all') && (
          <button
            onClick={handleReset}
            className="btn-secondary text-xs py-2 px-4 flex items-center gap-2 self-start sm:self-auto"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
            </svg>
            Reset
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search buildings, departments, facilities..."
          className="input-field pl-12"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111111] dark:hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_DEFS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 transition-all ${
              activeFilter === f.key
                ? 'border-[#111111] bg-[var(--navigo-yellow)] text-[#111111] shadow-[2px_2px_0_#111111]'
                : 'border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-600 dark:text-gray-400 bg-white dark:bg-transparent hover:border-[#111111] dark:hover:border-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider">
          {filtered.length} {filtered.length === 1 ? 'place' : 'places'} found
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] p-12 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-gray-400">
            NO PLACES MATCH YOUR SEARCH
          </p>
          <button
            onClick={handleReset}
            className="mt-4 btn-secondary text-xs py-2 px-6"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => {
            const color = TYPE_COLORS[b.type] || '#9CA3AF';
            const iconPath = TYPE_ICONS[b.type] || TYPE_ICONS.admin;
            const floorCount = Math.max(1, Math.floor(b.h / 25));

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-[#141414] border-2 border-[#E5E7EB] dark:border-[#2A2A2A] flex flex-col cursor-pointer group transition-all hover:border-[#111111] dark:hover:border-white hover:shadow-[5px_5px_0_#111111] dark:hover:shadow-[5px_5px_0_#FFFFFF] hover:-translate-x-px hover:-translate-y-px"
                onClick={() => handleViewDetails(b)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleViewDetails(b)}
                aria-label={`View details for ${b.label}`}
              >
                {/* Top accent strip */}
                <div className="h-[3px]" style={{ background: color }} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Icon + index */}
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center"
                      style={{ background: color + '18', border: `1.5px solid ${color}` }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
                        <path d={iconPath}/>
                      </svg>
                    </div>
                    <span
                      className="font-mono text-[9px] font-bold px-2 py-1"
                      style={{ background: color + '18', color, border: `1px solid ${color}` }}
                    >
                      {b.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 mb-4">
                    <h3 className="font-bold text-base leading-tight mb-1">{b.label}</h3>
                    <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider mb-2">{b.department}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{b.description}</p>
                  </div>

                  {/* Facilities preview */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {b.facilities.slice(0, 3).map((f) => (
                      <span key={f} className="text-[9px] font-mono px-1.5 py-0.5 border border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500">
                        {f}
                      </span>
                    ))}
                    {b.facilities.length > 3 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 text-gray-400">+{b.facilities.length - 3}</span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center border-t border-[#E5E7EB] dark:border-[#2A2A2A] pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-gray-400">{floorCount} floor{floorCount !== 1 ? 's' : ''}</span>
                      {b.accessible && (
                        <span className="font-mono text-[9px] text-[var(--navigo-green)]">♿</span>
                      )}
                    </div>
                    <span
                      className="font-mono text-[10px] font-bold text-gray-400 group-hover:text-[#111111] dark:group-hover:text-white transition-colors flex items-center gap-1"
                    >
                      View details
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
