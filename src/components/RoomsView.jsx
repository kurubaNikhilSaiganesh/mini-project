import { useState, useContext } from 'react';
import { ROOMS, getClassById } from '../data';
import { AppContext } from '../context/AppContext';

const ROOM_TYPES = [...new Set(ROOMS.map((r) => r.type))];
const BUILDINGS_LIST = [...new Set(ROOMS.map((r) => r.building))];

export default function RoomsView() {
  const { locateOnMap } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeBuilding, setActiveBuilding] = useState('all');

  const filtered = ROOMS.filter((r) => {
    const matchesType = activeType === 'all' || r.type === activeType;
    const matchesBuilding = activeBuilding === 'all' || r.building === activeBuilding;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.number.toLowerCase().includes(q) ||
      r.building.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      (r.assignedClassId && r.assignedClassId.toLowerCase().includes(q));
    return matchesType && matchesBuilding && matchesSearch;
  });

  const typeColors = {
    'Lecture Hall':    '#3157FF',
    'Computer Lab':    '#087F45',
    'AI/ML Lab':       '#F4B400',
    'Research Lab':    '#747DFF',
    'Seminar Hall':    '#FF4757',
    'Conference Room': '#00D9FF',
    'Drawing Hall':    '#FF6B1A',
    'Workshop':        '#2ED573',
    'IoT Lab':         '#FFA502',
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[var(--navigo-yellow)] uppercase tracking-widest mb-2">
          [ROOM_DIRECTORY]
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">
          Rooms.
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {ROOMS.length} rooms across {BUILDINGS_LIST.length} buildings.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search rooms by number, building, or type..."
          className="w-full rounded-full glass-input pl-12 pr-4 py-3 text-sm text-[var(--text-primary)] shadow-sm"
        />
      </div>

      {/* Filters */}
      {/* Filters — Rounded Pills with High Contrast Typography */}
      <div className="flex flex-wrap gap-2 mb-3 items-center overflow-x-auto scrollbar-hide py-1">
        <button
          onClick={() => setActiveBuilding('all')}
          className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all select-none whitespace-nowrap ${
            activeBuilding === 'all'
              ? 'bg-[var(--gold)] text-[#111111] shadow-gold scale-[1.02]'
              : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-[var(--glass-2)]'
          }`}
        >
          All Buildings
        </button>
        {BUILDINGS_LIST.map((b) => (
          <button
            key={b}
            onClick={() => setActiveBuilding(b)}
            className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all select-none whitespace-nowrap ${
              activeBuilding === b
                ? 'bg-[var(--gold)] text-[#111111] shadow-gold scale-[1.02]'
                : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-[var(--glass-2)]'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8 items-center overflow-x-auto scrollbar-hide py-1">
        <button
          onClick={() => setActiveType('all')}
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all select-none whitespace-nowrap ${
            activeType === 'all'
              ? 'bg-[var(--gold)] text-[#111111] font-bold shadow-gold scale-[1.02]'
              : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-[var(--glass-2)]'
          }`}
        >
          All Types
        </button>
        {ROOM_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all select-none whitespace-nowrap ${
              activeType === type
                ? 'bg-[var(--gold)] text-[#111111] font-bold shadow-gold scale-[1.02]'
                : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-[var(--glass-2)]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Rooms table */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-[var(--glass-border-strong)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">NO ROOMS MATCH YOUR FILTERS</p>
        </div>
      ) : (
        <>
          {/* Desktop table — Curved Glass Container */}
          <div className="hidden md:block overflow-x-auto rounded-3xl glass-card border border-[var(--glass-border)] shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--glass-2)] border-b border-[var(--glass-border)] text-[var(--text-muted)]">
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Room</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Building</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Floor</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Type</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Capacity</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Assigned Class</th>
                  <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((room) => {
                  const cls = room.assignedClassId ? getClassById(room.assignedClassId) : null;
                  const color = typeColors[room.type] || '#9CA3AF';
                  return (
                    <tr
                      key={room.id}
                      className="border-t border-[var(--glass-border)] hover:bg-[var(--glass-2)] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-sm text-[var(--text-primary)]">{room.number}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[var(--text-primary)]">{room.building}</td>
                      <td className="px-5 py-3.5 text-sm text-[var(--text-muted)]">{room.floor}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="font-mono text-[10px] font-bold px-3 py-1 rounded-full border inline-block"
                          style={{ background: color + '18', color, borderColor: color + '40' }}
                        >
                          {room.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-mono text-[var(--text-muted)]">{room.capacity}</td>
                      <td className="px-5 py-3.5 text-sm">
                        {cls ? (
                          <span className="font-mono text-[10.5px] font-semibold bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-3 py-1 rounded-full text-[var(--text-primary)] inline-block">
                            {cls.shortName}
                          </span>
                        ) : (
                          <span className="text-[var(--text-subtle)] text-xs font-mono">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => locateOnMap(room.buildingId)}
                          className="text-xs font-semibold px-3 py-1 rounded-full glass-btn glass-btn-ghost text-[var(--green)] hover:bg-[var(--green-light)] transition-all"
                        >
                          Find →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards — Rounded Glass */}
          <div className="md:hidden space-y-3">
            {filtered.map((room) => {
              const cls = room.assignedClassId ? getClassById(room.assignedClassId) : null;
              const color = typeColors[room.type] || '#9CA3AF';
              return (
                <div
                  key={room.id}
                  className="rounded-3xl glass-card p-5 border border-[var(--glass-border)] shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-lg text-[var(--text-primary)]">{room.number}</span>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{room.building} · {room.floor} Floor</p>
                    </div>
                    <span
                      className="font-mono text-[9.5px] font-bold px-3 py-1 rounded-full border shrink-0"
                      style={{ background: color + '18', color, borderColor: color + '40' }}
                    >
                      {room.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--glass-border)]">
                    <div className="space-y-0.5">
                      <p className="text-xs text-[var(--text-muted)]">Capacity: <span className="font-mono font-bold text-[var(--text-primary)]">{room.capacity}</span></p>
                      {cls && (
                        <p className="text-xs text-[var(--text-muted)]">Class: <span className="font-mono font-bold text-[var(--text-primary)]">{cls.shortName}</span></p>
                      )}
                    </div>
                    <button
                      onClick={() => locateOnMap(room.buildingId)}
                      className="glass-btn glass-btn-primary rounded-full text-xs font-bold py-1.5 px-4"
                    >
                      Find →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

