import { useState, useContext } from 'react';
import { ROOMS, getClassById } from '../data';
import { AppContext } from '../App';

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
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search rooms by number, building, or type..."
          className="input-field pl-12"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setActiveBuilding('all')}
          className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 transition-all ${
            activeBuilding === 'all'
              ? 'border-[#111111] bg-[var(--navigo-yellow)] text-[#111111]'
              : 'border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500 hover:border-[#111111]'
          }`}
        >
          All Buildings
        </button>
        {BUILDINGS_LIST.map((b) => (
          <button
            key={b}
            onClick={() => setActiveBuilding(b)}
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 transition-all ${
              activeBuilding === b
                ? 'border-[#111111] bg-[var(--navigo-yellow)] text-[#111111]'
                : 'border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500 hover:border-[#111111]'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveType('all')}
          className={`text-[10px] font-mono uppercase px-3 py-1 border transition-all ${
            activeType === 'all'
              ? 'border-[#111111] bg-[#111111] text-white'
              : 'border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500 hover:border-[#111111]'
          }`}
        >
          All Types
        </button>
        {ROOM_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`text-[10px] font-mono uppercase px-3 py-1 border transition-all ${
              activeType === type
                ? 'border-[#111111] bg-[#111111] text-white'
                : 'border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500 hover:border-[#111111]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Rooms table */}
      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] p-12 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-gray-400">NO ROOMS MATCH YOUR FILTERS</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto border-2 border-[#111111] dark:border-[#333333]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111111] dark:bg-[#1A1A1A] text-white">
                  <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-wider">Room</th>
                  <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-wider">Building</th>
                  <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-wider">Floor</th>
                  <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-wider">Capacity</th>
                  <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-wider">Assigned Class</th>
                  <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((room, idx) => {
                  const cls = room.assignedClassId ? getClassById(room.assignedClassId) : null;
                  const color = typeColors[room.type] || '#9CA3AF';
                  return (
                    <tr
                      key={room.id}
                      className={`border-t border-[#E5E7EB] dark:border-[#2A2A2A] hover:bg-[#F7F5F0] dark:hover:bg-[#1A1A1A] transition-colors ${
                        idx % 2 === 0 ? 'bg-white dark:bg-[#141414]' : 'bg-[#FAFAFA] dark:bg-[#111111]'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-sm">{room.number}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{room.building}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{room.floor}</td>
                      <td className="px-4 py-3">
                        <span
                          className="font-mono text-[9px] font-bold px-2 py-0.5"
                          style={{ background: color + '22', color, border: `1px solid ${color}` }}
                        >
                          {room.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">{room.capacity}</td>
                      <td className="px-4 py-3 text-sm">
                        {cls ? (
                          <span className="font-mono text-[10px] bg-[var(--navigo-yellow)]/20 px-2 py-0.5 text-[#111111] dark:text-white">
                            {cls.shortName}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs font-mono">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => locateOnMap(room.buildingId)}
                          className="text-xs font-mono text-[var(--navigo-green)] hover:text-[var(--navigo-green-hover)] font-bold transition-colors hover:underline"
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

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((room) => {
              const cls = room.assignedClassId ? getClassById(room.assignedClassId) : null;
              const color = typeColors[room.type] || '#9CA3AF';
              return (
                <div
                  key={room.id}
                  className="border-2 border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-mono font-bold text-lg">{room.number}</span>
                      <p className="text-xs text-gray-500">{room.building} · {room.floor} Floor</p>
                    </div>
                    <span
                      className="font-mono text-[9px] font-bold px-2 py-0.5"
                      style={{ background: color + '22', color, border: `1px solid ${color}` }}
                    >
                      {room.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Capacity: <span className="font-mono font-bold text-[#111111] dark:text-white">{room.capacity}</span></p>
                      {cls && (
                        <p className="text-xs text-gray-500">Class: <span className="font-mono font-bold text-[#111111] dark:text-white">{cls.shortName}</span></p>
                      )}
                    </div>
                    <button
                      onClick={() => locateOnMap(room.buildingId)}
                      className="btn-green text-xs py-2 px-4"
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
