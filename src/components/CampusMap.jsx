import { useContext, useState, useCallback, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { BUILDINGS, GRAPH, getBuildingById } from '../data';

const SVG_W = 800;
const SVG_H = 600;

const ZONE_FILTERS = [
  { key: 'all',       label: 'ALL' },
  { key: 'academic',  label: 'ACADEMICS' },
  { key: 'lab',       label: 'LABS' },
  { key: 'hostel',    label: 'HOSTELS' },
  { key: 'canteen',   label: 'SERVICES' },
  { key: 'auditorium',label: 'EVENTS' },
  { key: 'sports',    label: 'SPORTS' },
];

const SERVICE_TYPES = ['canteen', 'auditorium', 'library', 'admin', 'gate'];

// Building type → restrained semantic accent (used only for top strip + code tag)
// NOT used as fill colors — buildings use neutral white/off-white fill
const TYPE_COLOR = {
  admin:      '#6B7280',  // neutral gray — admin
  academic:   '#374151',  // dark slate — academic
  library:    '#374151',  // dark slate
  lab:        '#087F45',  // green — labs/research
  hostel:     '#374151',  // neutral
  canteen:    '#6B7280',  // neutral
  auditorium: '#374151',  // neutral
  sports:     '#087F45',  // green — active/sports
  gate:       '#9CA3AF',  // light gray — gates
};


function getBuildingCenter(b) {
  return { cx: b.x + b.w / 2, cy: b.y + b.h / 2 };
}

// ─── BuildingPopup ───────────────────────────────────────────
function BuildingPopup({ building, onClose, onSetFrom, onSetTo, onFindRoute }) {
  if (!building) return null;
  const accentColor = TYPE_COLOR[building.type] || '#9CA3AF';

  return (
    <div
      className="glass-modal rounded-3xl p-6 z-50 border border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
      style={{ minWidth: 260, maxWidth: 320 }}
      role="dialog"
      aria-label={`${building.label} details`}
    >
      {/* Top accent glow */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-20 blur-xl pointer-events-none"
        style={{ background: accentColor }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
        <div>
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1 glass-1 border border-[var(--glass-border)]"
            style={{ color: accentColor }}
          >
            {building.type.toUpperCase()} · {building.code}
          </span>
          <h3 className="font-display font-bold text-lg leading-tight text-[var(--text-primary)]">
            {building.label}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="glass-btn glass-btn-ghost glass-btn-icon w-7 h-7 rounded-full text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label="Close popup"
        >
          <X size={14} />
        </button>
      </div>

      {/* Department */}
      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider mb-2 text-amber-500">
        {building.department}
      </p>

      {/* Description */}
      <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
        {building.description}
      </p>

      {/* Facilities */}
      <div className="mb-4 space-y-1.5">
        {building.facilities.slice(0, 3).map((f) => (
          <div key={f} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accentColor }} />
            <span>{f}</span>
          </div>
        ))}
      </div>

      {/* Accessibility badge */}
      <div className="mb-5">
        <span
          className={`font-mono text-[9px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
            building.accessible
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
              : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border border-[var(--glass-border)]'
          }`}
        >
          {building.accessible ? '♿ FULLY ACCESSIBLE' : '⚠ LIMITED ACCESS'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-2 relative z-10">
        <button
          onClick={() => onSetFrom(building.id)}
          className="flex-1 glass-btn rounded-full text-xs font-semibold py-2"
        >
          Set From
        </button>
        <button
          onClick={() => onSetTo(building.id)}
          className="flex-1 glass-btn glass-btn-primary rounded-full text-xs font-bold py-2 shadow-xs"
        >
          Set To
        </button>
      </div>
      <button
        onClick={() => onFindRoute(building.id)}
        className="w-full glass-btn btn-green rounded-full text-xs py-2.5 font-bold shadow-md"
      >
        Find Route →
      </button>
    </div>
  );
}

// ─── ZoneFilterBar ────────────────────────────────────────────
function ZoneFilterBar({ activeFilter, setFilter }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-[var(--glass-border)] glass-1">
      {ZONE_FILTERS.map((f) => {
        const isActive = activeFilter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`font-mono text-[10px] font-bold px-4 py-1.5 rounded-full transition-all uppercase tracking-wider shrink-0 select-none ${
              isActive
                ? 'bg-amber-400 text-black shadow-sm font-bold scale-[1.02]'
                : 'glass-1 border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--glass-border-strong)]'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main CampusMap ──────────────────────────────────────────
export default function CampusMap() {
  const {
    selectedBuilding, setSelectedBuilding,
    fromNode, setFromNode,
    setToNode,
    activeRoute,
    activeZoneFilter, setActiveZoneFilter,
    viewBox, setViewBox,
    theme,
  } = useContext(AppContext);

  const svgRef = useRef(null);
  const [isDragging, setIsDragging]   = useState(false);
  const [dragStart, setDragStart]     = useState(null);
  const [popupPos, setPopupPos]       = useState({ x: 20, y: 20 });

  const strokeColor = theme === 'dark' ? '#2A2A2A' : '#E5E7EB';
  const fillColor   = theme === 'dark' ? '#1A1A1A' : '#FFFFFF';
  const bgColor     = theme === 'dark' ? '#0A0A0A' : '#F4F1E8';

  // ─── Zoom / Pan ──────────────────────────────────────────────
  const zoom = useCallback((factor) => {
    setViewBox((vb) => {
      const newW = Math.max(200, Math.min(SVG_W, vb.w * factor));
      const newH = Math.max(150, Math.min(SVG_H, vb.h * factor));
      const dx = (vb.w - newW) / 2;
      const dy = (vb.h - newH) / 2;
      return { x: vb.x + dx, y: vb.y + dy, w: newW, h: newH };
    });
  }, [setViewBox]);

  const resetView = () => setViewBox({ x: 0, y: 0, w: SVG_W, h: SVG_H });

  const handleMouseDown = (e) => {
    if (e.target === svgRef.current || (e.target.tagName === 'rect' && !e.target.dataset.bid)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY, vb: { ...viewBox } });
    }
  };
  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart || !svgRef.current) return;
    const scaleX = viewBox.w / svgRef.current.clientWidth;
    const scaleY = viewBox.h / svgRef.current.clientHeight;
    const dx = (e.clientX - dragStart.x) * scaleX;
    const dy = (e.clientY - dragStart.y) * scaleY;
    setViewBox({ ...dragStart.vb, x: dragStart.vb.x - dx, y: dragStart.vb.y - dy });
  };
  const handleMouseUp = () => { setIsDragging(false); setDragStart(null); };

  // ─── Building click ───────────────────────────────────────────
  const handleBuildingClick = (building, e) => {
    e.stopPropagation();
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = (building.x + building.w / 2 - viewBox.x) / viewBox.w * rect.width;
    const svgY = (building.y - viewBox.y) / viewBox.h * rect.height;
    setPopupPos({
      x: Math.min(svgX + 10, rect.width - 310),
      y: Math.max(svgY - 20, 10),
    });
    setSelectedBuilding(building);
  };

  // ─── Filter logic ──────────────────────────────────────────────
  const isVisible = (b) => {
    if (activeZoneFilter === 'all') return true;
    if (activeZoneFilter === 'canteen') return SERVICE_TYPES.includes(b.type);
    return b.type === activeZoneFilter;
  };

  // ─── Route path ────────────────────────────────────────────────
  const routePoints = activeRoute
    ? activeRoute.map((id) => {
        const b = getBuildingById(id);
        return b ? getBuildingCenter(b) : null;
      }).filter(Boolean)
    : [];

  const routePathD = routePoints.length > 1
    ? routePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' ')
    : '';

  // ─── Pathway edges ─────────────────────────────────────────────
  const edges = [];
  const seen = new Set();
  for (const [from, neighbors] of Object.entries(GRAPH)) {
    for (const to of neighbors) {
      const key = [from, to].sort().join('-');
      if (!seen.has(key)) {
        seen.add(key);
        const a = getBuildingById(from);
        const b = getBuildingById(to);
        if (a && b) edges.push({ from, to, a, b });
      }
    }
  }

  // ─── Popup action handlers ─────────────────────────────────────
  const handleSetFrom = (id) => {
    setFromNode(id);
    setSelectedBuilding(null);
  };
  const handleSetTo = (id) => {
    setToNode(id);
    setSelectedBuilding(null);
  };
  const handleFindRoute = (id) => {
    // If we already have a "from", calculate directly; else set as "to" and prompt
    if (fromNode && fromNode !== id) {
      setToNode(id);
      setSelectedBuilding(null);
      // calculateRoute will fire via useEffect in App, or user can click Get Route
    } else {
      setToNode(id);
      setSelectedBuilding(null);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <ZoneFilterBar activeFilter={activeZoneFilter} setFilter={setActiveZoneFilter} />

      {/* SVG Map Viewport */}
      <div
        className="relative overflow-hidden flex-1"
        style={{ background: bgColor, minHeight: 400 }}
      >
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          className="w-full h-full"
          style={{ minHeight: 400, cursor: isDragging ? 'grabbing' : 'grab', display: 'block' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          aria-label="Interactive campus map"
          role="application"
        >
          <defs>
            <pattern id="ng-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme === 'dark' ? '#1F2937' : '#C8D8C0'} strokeWidth="0.75" />
            </pattern>
            <pattern id="ng-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke={theme === 'dark' ? '#1E2E1E' : '#A8D5A2'} strokeWidth="1" />
            </pattern>
            {/* Yellow glow filter for selected building */}
            <filter id="yellow-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect x="-200" y="-200" width={SVG_W + 400} height={SVG_H + 400} fill={bgColor} />
          <rect x="-200" y="-200" width={SVG_W + 400} height={SVG_H + 400} fill="url(#ng-grid)" />

          {/* Green spaces */}
          <rect x="150" y="180" width="80" height="50" fill="url(#ng-hatch)" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
          <rect x="330" y="170" width="60" height="40" fill="url(#ng-hatch)" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
          <rect x="470" y="170" width="60" height="40" fill="url(#ng-hatch)" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
          <rect x="100" y="360" width="80" height="30" fill="url(#ng-hatch)" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />

          {/* Pathway edges */}
          {edges.map(({ from, to, a, b }) => {
            const ca = getBuildingCenter(a);
            const cb = getBuildingCenter(b);
            const isRouteEdge = activeRoute &&
              activeRoute.includes(from) && activeRoute.includes(to) &&
              Math.abs(activeRoute.indexOf(from) - activeRoute.indexOf(to)) === 1;
            return (
              <line
                key={`${from}-${to}`}
                x1={ca.cx} y1={ca.cy}
                x2={cb.cx} y2={cb.cy}
                stroke={isRouteEdge ? '#F4B400' : strokeColor}
                strokeWidth={isRouteEdge ? 2 : 1.5}
                strokeDasharray={isRouteEdge ? '0' : '6 4'}
                opacity={isRouteEdge ? 0.8 : 0.3}
              />
            );
          })}

          {/* Buildings */}
          {BUILDINGS.map((b) => {
            const isSelected = selectedBuilding?.id === b.id;
            const isOnRoute  = activeRoute?.includes(b.id);
            const dimmed     = !isVisible(b);
            const isGate     = b.type === 'gate';
            const { cx, cy } = getBuildingCenter(b);
            const typeColor  = TYPE_COLOR[b.type] || '#9CA3AF';

            const bFill   = isSelected
              ? '#F4B400'
              : isOnRoute
                ? (theme === 'dark' ? '#1F2937' : '#F0F4F0')
                : fillColor;
            const bStroke = isSelected
              ? '#F4B400'
              : isOnRoute
                ? '#374151'
                : (theme === 'dark' ? '#374151' : '#D1D5DB');
            const bStrokeW = isSelected ? 3 : isOnRoute ? 2 : 1.5;

            return (
              <g
                key={b.id}
                role="button"
                tabIndex={0}
                aria-label={`${b.label} — ${b.department}. Click to view details.`}
                onClick={(e) => handleBuildingClick(b, e)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleBuildingClick(b, e)}
                style={{
                  opacity: dimmed ? 0.12 : 1,
                  cursor: 'pointer',
                  transition: 'opacity 0.25s ease',
                }}
              >
                {/* Building hover highlight */}
                {!dimmed && (
                  <rect
                    x={b.x - 3} y={b.y - 3}
                    width={b.w + 6} height={b.h + 6}
                    fill="none"
                    stroke={typeColor}
                    strokeWidth={1}
                    opacity={0}
                    className="building-hover-ring"
                    rx="2"
                    style={{ transition: 'opacity 0.2s' }}
                  />
                )}

                {isGate ? (
                  <polygon
                    points={`${cx},${b.y} ${b.x + b.w},${cy} ${cx},${b.y + b.h} ${b.x},${cy}`}
                    fill={isSelected ? '#F4B400' : fillColor}
                    stroke={bStroke}
                    strokeWidth={bStrokeW}
                  />
                ) : (
                  <rect
                    x={b.x} y={b.y}
                    width={b.w} height={b.h}
                    rx="4" ry="4"
                    fill={bFill}
                    stroke={bStroke}
                    strokeWidth={bStrokeW}
                    data-bid={b.id}
                    filter={isSelected ? 'url(#yellow-glow)' : undefined}
                  />
                )}

                {/* Type color dot (top-left of building) */}
                {!isGate && (
                  <rect
                    x={b.x} y={b.y}
                    width={b.w} height={4}
                    rx="2"
                    fill={typeColor}
                    opacity={0.8}
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Short label */}
                <text
                  x={cx}
                  y={cy - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fontFamily="Outfit, Impact, sans-serif"
                  fontWeight="800"
                  fill={isSelected ? '#111111' : theme === 'dark' ? '#E5E7EB' : '#1F2937'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {b.short}
                </text>

                {/* Code tag */}
                <text
                  x={cx}
                  y={cy + 9}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontFamily="JetBrains Mono, Space Mono, monospace"
                  fill={isSelected ? '#333333' : theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  [{b.code}]
                </text>

                {/* Accessibility indicator */}
                {b.accessible && !isGate && (
                  <text
                    x={b.x + b.w - 6}
                    y={b.y + b.h - 4}
                    fontSize="8"
                    fill={isSelected ? '#111111' : '#087F45'}
                    opacity={0.7}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    ♿
                  </text>
                )}
              </g>
            );
          })}

          {/* Active Route Path — NaviGO Yellow */}
          {routePathD && (
            <>
              {/* Glow */}
              <path
                d={routePathD}
                fill="none"
                stroke="#F4B400"
                strokeWidth="10"
                opacity="0.15"
              />
              {/* Main line */}
              <path
                d={routePathD}
                fill="none"
                stroke="#F4B400"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 6"
                className="route-path"
              />
              {/* Start node — green */}
              {routePoints[0] && (
                <>
                  <circle
                    cx={routePoints[0].cx}
                    cy={routePoints[0].cy}
                    r="8" fill="#087F45" stroke="#FFFFFF" strokeWidth="2"
                  />
                  <circle
                    cx={routePoints[0].cx}
                    cy={routePoints[0].cy}
                    r="12" fill="none" stroke="#087F45" strokeWidth="1.5"
                    className="pulse-marker"
                  />
                </>
              )}
              {/* End node — yellow */}
              {routePoints[routePoints.length - 1] && routePoints.length > 1 && (
                <>
                  <circle
                    cx={routePoints[routePoints.length - 1].cx}
                    cy={routePoints[routePoints.length - 1].cy}
                    r="8" fill="#F4B400" stroke="#111111" strokeWidth="2"
                  />
                  <text
                    x={routePoints[routePoints.length - 1].cx}
                    y={routePoints[routePoints.length - 1].cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fill="#111111"
                    fontWeight="900"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    ⚑
                  </text>
                </>
              )}
            </>
          )}
        </svg>

        {/* Building popup */}
        {selectedBuilding && (
          <div
            className="absolute"
            style={{ left: popupPos.x, top: popupPos.y, zIndex: 40 }}
          >
            <BuildingPopup
              building={selectedBuilding}
              onClose={() => setSelectedBuilding(null)}
              onSetFrom={handleSetFrom}
              onSetTo={handleSetTo}
              onFindRoute={handleFindRoute}
            />
          </div>
        )}

        {/* Map Controls (bottom-right) */}
        <div
          className="absolute bottom-5 right-5 flex flex-col gap-1.5 glass-2 rounded-2xl p-1.5 border border-[var(--glass-border-strong)] shadow-lg backdrop-blur-md"
          style={{ zIndex: 30 }}
        >
          <button
            onClick={() => zoom(0.75)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-amber-400 hover:text-black transition-colors"
            aria-label="Zoom in"
            title="Zoom In"
          >
            <ZoomIn size={16} strokeWidth={2} />
          </button>
          <button
            onClick={() => zoom(1.33)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-amber-400 hover:text-black transition-colors"
            aria-label="Zoom out"
            title="Zoom Out"
          >
            <ZoomOut size={16} strokeWidth={2} />
          </button>
          <button
            onClick={resetView}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-amber-400 hover:text-black transition-colors"
            aria-label="Reset map view"
            title="Reset View"
          >
            <Maximize size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Coordinate readout */}
        <div
          className="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-wider glass-1 rounded-full px-3 py-1 border border-[var(--glass-border)] shadow-xs"
          style={{ zIndex: 30, color: 'var(--gold)' }}
        >
          VIEW [{Math.round(viewBox.x)}, {Math.round(viewBox.y)}] · {(SVG_W / viewBox.w).toFixed(1)}×
        </div>
      </div>
    </div>
  );
}

