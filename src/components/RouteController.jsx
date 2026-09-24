import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { BUILDINGS, getBuildingById } from '../data';
import { RefreshCcw, Navigation, CheckCircle2, AlertCircle, ArrowRight, X } from 'lucide-react';

const DESTINATIONS = BUILDINGS.filter((b) => b.type !== 'gate');

import { useState, useRef, useEffect } from 'react';

function SelectField({ label, value, onChange, placeholder, dotColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const selectedNode = DESTINATIONS.find((b) => b.id === value);
  const displayLabel = selectedNode ? `${selectedNode.label} (${selectedNode.code})` : placeholder;

  return (
    <div className="flex-1 min-w-0 w-full relative" ref={containerRef}>
      <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 block font-semibold">
        {label}
      </label>
      <div
        className="w-full glass-select rounded-full pl-10 pr-10 py-3 text-sm font-medium transition-all shadow-xs cursor-pointer flex items-center justify-between select-none magic-hover"
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-10 shadow-sm"
          style={{ background: dotColor }}
        />
        <span className={`truncate ${!value ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)] font-semibold'}`}>
          {displayLabel}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={`text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {isOpen && (
        <div
          className="absolute top-full mt-2 w-full left-0 right-0 sm:min-w-[280px] rounded-3xl shadow-2xl z-[100] max-h-64 overflow-y-auto overscroll-contain p-2 border backdrop-blur-xl"
          style={{
            backgroundColor: 'var(--glass-4)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderColor: 'var(--glass-border)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          <div className="p-1 space-y-1">
            {DESTINATIONS.map((b) => {
              const isSelected = b.id === value;
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    onChange(b.id);
                    setIsOpen(false);
                  }}
                  className={`px-3.5 py-2.5 text-sm rounded-2xl cursor-pointer transition-all duration-150 flex items-center justify-between mx-0.5 ${
                    isSelected
                      ? 'bg-[var(--gold)] text-white font-bold shadow-sm'
                      : 'hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-primary)] font-medium'
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <span className="truncate">{b.label}</span>
                  <span className={`font-mono text-[10px] ml-2 shrink-0 px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)]'}`}>
                    {b.code}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
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
    <div
      className="glass-card glass-2 rounded-3xl p-6 md:p-8 border border-[var(--glass-border-strong)] shadow-xl relative"
    >
      {/* Subtle ambient light restricted to container bounds */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{ background: 'var(--gold)' }}
        />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-full bg-amber-500/10 text-amber-500">
              <Navigation size={13} />
            </span>
            <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-bold">
              Campus Navigator · BFS
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Where are you headed?
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Choose your origin and destination to generate turn-by-turn routing across ALTS.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-1 border border-[var(--glass-border)] self-start magic-hover hover:scale-105 transition-all duration-300 cursor-default">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            Live Waypoints
          </span>
        </div>
      </div>

      {/* FROM / SWAP / TO / GET — Responsive Grid with clean wrapping */}
      <div className="flex flex-col sm:flex-row flex-wrap xl:flex-nowrap items-stretch sm:items-end gap-3 relative z-20 w-full">
        <SelectField
          label="Starting From"
          value={fromNode}
          onChange={setFromNode}
          placeholder="Select starting point"
          dotColor="#EF4444"
        />

        <button
          onClick={swapNodes}
          className="glass-btn rounded-full w-11 h-11 p-0 flex items-center justify-center shrink-0 mb-0.5 self-center sm:self-end hover:rotate-180 transition-transform duration-300 shadow-sm"
          title="Swap starting point and destination"
          aria-label="Swap starting point and destination"
        >
          <RefreshCcw size={15} className="text-[var(--text-muted)]" />
        </button>

        <SelectField
          label="Take Me To"
          value={toNode}
          onChange={setToNode}
          placeholder="Select destination"
          dotColor="var(--green)"
        />

        <button
          onClick={calculateRoute}
          disabled={!fromNode || !toNode || fromNode === toNode}
          className="glass-btn glass-btn-primary rounded-full py-3.5 px-7 whitespace-nowrap shrink-0 h-[48px] w-full xl:w-auto font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none mt-2 sm:mt-0"
          aria-label="Calculate route"
        >
          <span>Get Route</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Route result */}
      {activeRoute && routeStats && (
        <div className="mt-8 pt-6 border-t border-[var(--glass-border)] relative z-10 space-y-6">
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="glass-card rounded-2xl px-4 py-2.5 border border-[var(--glass-border)] flex items-center gap-3">
                <div>
                  <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Distance</p>
                  <p className="font-mono text-lg font-bold text-[var(--text-primary)]">
                    {routeStats.distance}<span className="text-xs text-[var(--text-muted)] font-normal ml-0.5">m</span>
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl px-4 py-2.5 border border-[var(--glass-border)] flex items-center gap-3">
                <div>
                  <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Est. Walk</p>
                  <p className="font-mono text-lg font-bold text-[var(--text-primary)]">
                    {routeStats.time}<span className="text-xs text-[var(--text-muted)] font-normal ml-0.5">min</span>
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl px-4 py-2.5 border border-[var(--glass-border)] flex items-center gap-2">
                {routeStats.accessible ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <AlertCircle size={16} className="text-red-500" />
                )}
                <div>
                  <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Wheelchair</p>
                  <p className={`font-mono text-xs font-bold ${routeStats.accessible ? 'text-emerald-500' : 'text-red-500'}`}>
                    {routeStats.accessible ? 'Accessible' : 'Stairs En Route'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={clearRoute}
              className="glass-btn glass-btn-ghost glass-btn-sm rounded-full text-xs flex items-center gap-1.5"
            >
              <X size={13} />
              <span>Clear Route</span>
            </button>
          </div>

          {/* Step-by-step route cards */}
          <div>
            <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3 font-semibold">
              Step-by-Step Waypoints ({activeRoute.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {activeRoute.map((nodeId, idx) => {
                const b = getBuildingById(nodeId);
                if (!b) return null;
                const isFirst = idx === 0;
                const isLast  = idx === activeRoute.length - 1;
                return (
                  <div
                    key={nodeId}
                    className={`glass-card rounded-2xl p-3 flex items-center gap-3 border ${
                      isFirst
                        ? 'border-red-500/30 bg-red-500/5'
                        : isLast
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-[var(--glass-border)]'
                    }`}
                  >
                    {/* Step indicator */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-mono text-[10px] font-bold shadow-xs"
                      style={{
                        background: isFirst ? '#EF4444' : isLast ? 'var(--green)' : 'var(--glass-3)',
                        color: isFirst || isLast ? '#FFFFFF' : 'var(--text-primary)',
                        border: '1px solid var(--glass-border)',
                      }}
                    >
                      {isFirst ? '▶' : isLast ? '⚑' : String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        {b.label}
                      </p>
                      <p className="font-mono text-[9px] text-[var(--text-muted)] truncate">
                        {isFirst ? 'Starting Origin' : isLast ? 'Final Destination' : `Waypoint ${idx}`}
                      </p>
                    </div>
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
