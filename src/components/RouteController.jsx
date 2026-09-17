import { useContext } from 'react';
import { AppContext } from '../App';
import { BUILDINGS, getBuildingById } from '../data';
import { RefreshCcw, Navigation } from 'lucide-react';

const DESTINATIONS = BUILDINGS.filter((b) => b.type !== 'gate');

function SelectField({ label, value, onChange, placeholder, dotColor }) {
  return (
    <div className="flex-1">
      <label className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
          style={{ background: dotColor }}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#1A1A1A] border-2 border-[#333333] text-white py-3 pl-9 pr-10 appearance-none focus:outline-none focus:border-[var(--navigo-yellow)] transition-colors text-sm cursor-pointer font-body"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <option value="" disabled className="text-gray-500">{placeholder}</option>
          {DESTINATIONS.map((b) => (
            <option key={b.id} value={b.id}>{b.label}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
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

  const swapNodes = () => {
    const temp = fromNode;
    setFromNode(toNode);
    setToNode(temp);
  };

  return (
    <div className="bg-[#111111] text-white p-6 md:p-8 border-2 border-[#111111]" style={{ boxShadow: '4px 4px 0 #F4B400' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Navigation size={12} style={{ color: 'var(--navigo-yellow)' }} />
            <span className="font-mono text-[9px] text-[var(--navigo-yellow)] uppercase tracking-widest">
              Route Finder
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Where are you headed?
          </h2>
        </div>
        <div className="font-mono text-[9px] text-gray-500 border border-gray-700 px-3 py-1 uppercase tracking-wider">
          Live Campus
        </div>
      </div>

      {/* FROM / SWAP / TO / GET */}
      <div className="flex flex-col md:flex-row items-end gap-3">
        <SelectField
          label="Starting From"
          value={fromNode}
          onChange={setFromNode}
          placeholder="Select starting point"
          dotColor="#FF4757"
        />

        <button
          onClick={swapNodes}
          className="mb-0.5 w-9 h-9 flex items-center justify-center border-2 border-gray-600 text-gray-400 hover:border-[var(--navigo-yellow)] hover:text-[var(--navigo-yellow)] transition-colors shrink-0"
          title="Swap from and to"
          aria-label="Swap from and to locations"
        >
          <RefreshCcw size={14} />
        </button>

        <SelectField
          label="Take Me To"
          value={toNode}
          onChange={setToNode}
          placeholder="Select destination"
          dotColor="var(--navigo-green)"
        />

        <button
          onClick={calculateRoute}
          disabled={!fromNode || !toNode || fromNode === toNode}
          className="btn-primary py-3 px-6 whitespace-nowrap shrink-0 h-[46px] disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Calculate route"
        >
          Get route →
        </button>
      </div>

      {/* Route result */}
      {activeRoute && routeStats && (
        <div className="mt-6 pt-6 border-t border-[#333333]">
          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-5">
            <div>
              <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Distance</p>
              <p className="font-mono text-xl font-bold text-white">{routeStats.distance}<span className="text-sm text-gray-400">m</span></p>
            </div>
            <div>
              <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Est. Walk</p>
              <p className="font-mono text-xl font-bold text-white">{routeStats.time}<span className="text-sm text-gray-400">min</span></p>
            </div>
            <div>
              <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Accessible</p>
              <p className={`font-mono text-sm font-bold ${routeStats.accessible ? 'text-[var(--navigo-green)]' : 'text-[#FF4757]'}`}>
                {routeStats.accessible ? '♿ YES' : '✕ NO'}
              </p>
            </div>
            <button
              onClick={clearRoute}
              className="ml-auto self-end font-mono text-xs text-gray-500 hover:text-white transition-colors border border-gray-700 px-3 py-1.5 hover:border-white"
            >
              Clear Route
            </button>
          </div>

          {/* Step-by-step */}
          <div>
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider mb-3">Route Steps</p>
            <div className="space-y-1.5">
              {activeRoute.map((nodeId, idx) => {
                const b = getBuildingById(nodeId);
                if (!b) return null;
                const isFirst = idx === 0;
                const isLast  = idx === activeRoute.length - 1;
                return (
                  <div key={nodeId} className="flex items-center gap-3">
                    {/* Step indicator */}
                    <div
                      className="w-6 h-6 flex items-center justify-center shrink-0 font-mono text-[9px] font-bold"
                      style={{
                        background: isFirst ? '#FF4757' : isLast ? 'var(--navigo-green)' : '#333333',
                        color: '#FFFFFF',
                      }}
                    >
                      {isFirst ? '▶' : isLast ? '⚑' : String(idx + 1).padStart(2, '0')}
                    </div>
                    <p className="text-sm font-medium">
                      {b.label}
                      {isFirst && <span className="font-mono text-[9px] text-gray-500 ml-2">[START]</span>}
                      {isLast  && <span className="font-mono text-[9px] text-[var(--navigo-green)] ml-2">[DESTINATION]</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
