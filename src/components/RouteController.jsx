import React, { useContext, useCallback } from 'react';
import {
  Navigation, ArrowRight, RotateCcw, Flag, CornerDownRight,
  ArrowUpRight, Accessibility, AlertTriangle, ChevronDown
} from 'lucide-react';
import { AppContext } from '../App';
import { BUILDINGS, getBuildingById } from '../data';

const TYPE_ICONS = {
  admin: '🏛',
  academic: '📚',
  library: '📖',
  lab: '🔬',
  hostel: '🏠',
  canteen: '🍽',
  auditorium: '🎭',
  sports: '⚽',
  gate: '🚪',
};

const DESTINATIONS = BUILDINGS.filter((b) => b.type !== 'gate');

function SelectField({ label, value, onChange, placeholder }) {
  const { theme } = useContext(AppContext);
  return (
    <div className="relative">
      <label className="font-mono text-xs opacity-60 block mb-1.5 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select-brutal pr-8"
        >
          <option value="">{placeholder}</option>
          {DESTINATIONS.map((b) => (
            <option key={b.id} value={b.id}>
              {TYPE_ICONS[b.type] || '●'} {b.short} — {b.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
        />
      </div>
    </div>
  );
}

export default function RouteController() {
  const {
    fromNode, setFromNode,
    toNode, setToNode,
    activeRoute, routeStats,
    calculateRoute, clearRoute,
  } = useContext(AppContext);

  const sameNode = fromNode && toNode && fromNode === toNode;

  const stepIcons = [Flag, ArrowUpRight, CornerDownRight, CornerDownRight, CornerDownRight, Flag];

  return (
    <div className="flex flex-col gap-5 p-5 min-h-[500px]" style={{ background: 'var(--bg-dark, #E8E5DC)' }}>
      {/* Panel header */}
      <div className="flex items-center gap-2 border-b-2 pb-3" style={{ borderColor: 'var(--border)' }}>
        <Navigation size={16} style={{ color: '#3157FF' }} />
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#3157FF' }}>ROUTE_CONTROLLER</span>
        <span className="font-mono text-xs ml-auto" style={{ color: '#7C3AED', opacity: 0.8 }}>[SYS.NAV-01]</span>
      </div>

      {/* FROM selector */}
      <SelectField
        label="▶ FROM // ORIGIN"
        value={fromNode}
        onChange={setFromNode}
        placeholder="SELECT ORIGIN..."
      />

      {/* Swap icon */}
      <div className="flex justify-center">
        <div className="font-mono text-sm opacity-40">↕</div>
      </div>

      {/* TO selector */}
      <SelectField
        label="◀ TO // DESTINATION"
        value={toNode}
        onChange={setToNode}
        placeholder="SELECT DESTINATION..."
      />

      {/* Same node warning */}
      {sameNode && (
        <div className="border-2 p-3 flex items-center gap-2" style={{ borderColor: '#FF6B1A', background: '#FFF3EE', color: '#FF6B1A' }}>
          <AlertTriangle size={14} />
          <span className="font-mono text-xs">[WARN] ORIGIN == DESTINATION</span>
        </div>
      )}

      {/* Calculate button — Hyper Blue */}
      <button
        className="btn-brutal btn-brutal-filled w-full flex items-center justify-center gap-2 py-3"
        onClick={calculateRoute}
        disabled={!fromNode || !toNode || sameNode}
        style={{ opacity: (!fromNode || !toNode || sameNode) ? 0.4 : 1 }}
      >
        <Navigation size={16} />
        CALCULATE ROUTE →
      </button>

      {/* Route Info Card */}
      {activeRoute && routeStats && (
        <div className="border-3" style={{ border: '3px solid var(--border)' }}>
          {/* Stats header — Hyper Blue */}
          <div className="p-3" style={{ background: '#3157FF', color: '#FFFFFF' }}>
            <p className="font-mono text-xs font-bold tracking-widest">
              DISTANCE: {routeStats.distance}M // EST. TIME: {routeStats.time} MIN
            </p>
          </div>

          {/* Waypoint list */}
          <div className="p-3 space-y-2">
            {activeRoute.map((nodeId, idx) => {
              const b = getBuildingById(nodeId);
              if (!b) return null;
              const isFirst = idx === 0;
              const isLast = idx === activeRoute.length - 1;
              const Icon = isFirst ? Flag : isLast ? Flag : CornerDownRight;
              return (
                <div
                  key={nodeId}
                  className="flex items-center gap-2 font-mono text-xs"
                >
                  <span className="opacity-50 w-8 flex-shrink-0">
                    [{String(idx + 1).padStart(2, '0')}]
                  </span>
                  <Icon size={12} className="flex-shrink-0" />
                  <span className="uppercase">
                    {isFirst ? '▶ START: ' : isLast ? '⚑ ARRIVE: ' : '→ VIA: '}
                    {b.short}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Accessible flag */}
          <div className="border-t-2 p-3 flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <Accessibility size={14} style={{ color: routeStats.accessible ? '#3157FF' : '#FF6B1A' }} />
            <span className="font-mono text-xs" style={{ color: routeStats.accessible ? '#3157FF' : '#FF6B1A' }}>
              [WHEELCHAIR ACCESSIBLE: {routeStats.accessible ? 'YES' : 'NO'}]
            </span>
          </div>

          {/* Clear button */}
          <div className="border-t-2 border-black dark:border-white p-3">
            <button
              className="btn-brutal w-full text-xs flex items-center justify-center gap-2 py-2"
              onClick={clearRoute}
            >
              <RotateCcw size={12} />
              [CLEAR ROUTE]
            </button>
          </div>
        </div>
      )}

      {/* Hint when no route */}
      {!activeRoute && !sameNode && (
        <div className="mt-auto">
          <div className="border-2 border-dashed border-[#999] dark:border-[#666] p-4 text-center">
            <p className="font-mono text-xs opacity-50">[SELECT FROM & TO</p>
            <p className="font-mono text-xs opacity-50">THEN CALCULATE ROUTE]</p>
          </div>
        </div>
      )}
    </div>
  );
}
