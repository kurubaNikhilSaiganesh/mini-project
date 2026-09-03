import React, { useContext, useState, useCallback, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize, X, MapPin, ArrowRight } from 'lucide-react';
import { AppContext } from '../App';
import { BUILDINGS, GRAPH, getBuildingById } from '../data';

// ─── SVG layout constants ───────────────────────────────
const SVG_W = 800;
const SVG_H = 600;

// Category → display filter key
const ZONE_FILTERS = [
  { key: 'all', label: 'ALL' },
  { key: 'academic', label: 'ACADEMICS' },
  { key: 'lab', label: 'LABS' },
  { key: 'hostel', label: 'HOSTELS' },
  { key: 'canteen', label: 'SERVICES' },
  { key: 'auditorium', label: 'EVENTS' },
  { key: 'sports', label: 'SPORTS' },
];

const SERVICE_TYPES = ['canteen', 'auditorium', 'library', 'admin', 'gate'];

function getBuildingCenter(b) {
  return { cx: b.x + b.w / 2, cy: b.y + b.h / 2 };
}

// ─── BuildingPopup ───────────────────────────────────────
function BuildingPopup({ building, onClose, onSetFrom, onSetTo }) {
  const { theme } = useContext(AppContext);
  if (!building) return null;
  return (
    <div
      className="building-popup card-brutal bg-white dark:bg-[#2A2A2A] p-4"
      style={{ minWidth: 220, maxWidth: 280 }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="tag-brutal text-xs mb-1.5 block">[{building.type.toUpperCase()}] {building.code}</span>
          <h3 className="font-display text-base uppercase leading-tight">{building.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="btn-brutal w-7 h-7 p-0 flex items-center justify-center text-sm flex-shrink-0"
        >×</button>
      </div>
      <p className="font-mono text-xs opacity-60 mb-2">{building.department}</p>
      <p className="text-xs mb-3 opacity-80">{building.description}</p>
      <div className="mb-3">
        {building.facilities.slice(0, 3).map((f) => (
          <div key={f} className="font-mono text-xs flex items-center gap-1 opacity-70">
            <span>▸</span> {f}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSetFrom(building.id)}
          className="btn-brutal flex-1 text-xs py-1.5"
        >SET FROM</button>
        <button
          onClick={() => onSetTo(building.id)}
          className="btn-brutal btn-brutal-filled flex-1 text-xs py-1.5"
        >SET TO</button>
      </div>
    </div>
  );
}

// ─── ZoneFilterBar ───────────────────────────────────────
function ZoneFilterBar({ activeFilter, setFilter }) {
  return (
    <div
      className="flex flex-wrap gap-2 px-4 py-3 border-b-2"
      style={{ borderColor: '#111111', background: 'var(--bg, #F4F1E8)' }}
    >
      {ZONE_FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          className="font-mono text-xs px-3 py-1.5 border-2 transition-all"
          style={{
            borderColor: '#111111',
            background: activeFilter === f.key ? '#3157FF' : 'var(--bg-panel, #FFFFFF)',
            color: activeFilter === f.key ? '#FFFFFF' : '#111111',
            boxShadow: activeFilter === f.key ? '3px 3px 0 #111111' : 'none',
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== f.key) {
              e.currentTarget.style.background = '#C7F000';
              e.currentTarget.style.color = '#111111';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== f.key) {
              e.currentTarget.style.background = 'var(--bg-panel, #FFFFFF)';
              e.currentTarget.style.color = '#111111';
            }
          }}
        >
          [{f.label}]
        </button>
      ))}
    </div>
  );
}

// ─── Main CampusMap ─────────────────────────────────────
export default function CampusMap() {
  const {
    selectedBuilding, setSelectedBuilding,
    fromNode, setFromNode,
    toNode, setToNode,
    activeRoute,
    activeZoneFilter, setActiveZoneFilter,
    viewBox, setViewBox,
    theme,
  } = useContext(AppContext);

  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 20, y: 20 });

  const strokeColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  const fillColor = theme === 'dark' ? '#2A2A2A' : '#F4F4F4';
  const bgColor = theme === 'dark' ? '#1A1A1A' : '#FFFFFF';

  // ─── Zoom / Pan ─────────────────────────────────────
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
    if (e.target === svgRef.current || e.target.tagName === 'rect' && !e.target.dataset.bid) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY, vb: { ...viewBox } });
    }
  };
  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;
    const scaleX = viewBox.w / svgRef.current.clientWidth;
    const scaleY = viewBox.h / svgRef.current.clientHeight;
    const dx = (e.clientX - dragStart.x) * scaleX;
    const dy = (e.clientY - dragStart.y) * scaleY;
    setViewBox({ ...dragStart.vb, x: dragStart.vb.x - dx, y: dragStart.vb.y - dy });
  };
  const handleMouseUp = () => { setIsDragging(false); setDragStart(null); };

  // ─── Building click ──────────────────────────────────
  const handleBuildingClick = (building, e) => {
    e.stopPropagation();
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = (building.x + building.w / 2 - viewBox.x) / viewBox.w * rect.width;
    const svgY = (building.y - viewBox.y) / viewBox.h * rect.height;
    setPopupPos({
      x: Math.min(svgX + 10, rect.width - 290),
      y: Math.max(svgY - 20, 10)
    });
    setSelectedBuilding(building);
  };

  // ─── Filter logic ────────────────────────────────────
  const isVisible = (b) => {
    if (activeZoneFilter === 'all') return true;
    if (activeZoneFilter === 'canteen') return SERVICE_TYPES.includes(b.type);
    return b.type === activeZoneFilter;
  };

  // ─── Route path points ───────────────────────────────
  const routePoints = activeRoute
    ? activeRoute.map((id) => {
        const b = getBuildingById(id);
        return b ? getBuildingCenter(b) : null;
      }).filter(Boolean)
    : [];

  const routePathD = routePoints.length > 1
    ? routePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' ')
    : '';

  // ─── Pathway edges ───────────────────────────────────
  const edges = [];
  const seen = new Set();
  for (const [from, neighbors] of Object.entries(GRAPH)) {
    for (const to of neighbors) {
      const key = [from, to].sort().join('-');
      if (!seen.has(key)) {
        seen.add(key);
        const a = getBuildingById(from);
        const b = getBuildingById(to);
        if (a && b) {
          edges.push({ from, to, a, b });
        }
      }
    }
  }

  return (
    <div className="relative flex flex-col">
      <ZoneFilterBar activeFilter={activeZoneFilter} setFilter={setActiveZoneFilter} />

      {/* SVG Map Viewport */}
      <div className="relative overflow-hidden" style={{ minHeight: 480, background: theme === 'dark' ? '#0F0F0F' : '#F4F1E8' }}>
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          className="w-full h-full"
          style={{ minHeight: 480, cursor: isDragging ? 'grabbing' : 'grab', display: 'block' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            {/* Grid pattern — Electric Cyan tint */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme === 'dark' ? '#1A3A3A' : '#C5E8EA'} strokeWidth="0.6" />
            </pattern>
            {/* Crosshatch for green areas */}
            <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke={theme === 'dark' ? '#2A4A2A' : '#A8D5A2'} strokeWidth="1.2" />
            </pattern>
          </defs>

          {/* Background */}
          <rect x="-100" y="-100" width={SVG_W + 200} height={SVG_H + 200} fill={theme === 'dark' ? '#0F0F0F' : '#F4F1E8'} />
          <rect x="-100" y="-100" width={SVG_W + 200} height={SVG_H + 200} fill="url(#grid)" />

          {/* Green spaces (hatched) */}
          <rect x="150" y="180" width="80" height="50" fill="url(#hatch)" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
          <rect x="330" y="170" width="60" height="40" fill="url(#hatch)" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
          <rect x="470" y="170" width="60" height="40" fill="url(#hatch)" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
          <rect x="100" y="360" width="80" height="30" fill="url(#hatch)" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />

          {/* Pathway edges */}
          {edges.map(({ from, to, a, b }) => {
            const ca = getBuildingCenter(a);
            const cb = getBuildingCenter(b);
            return (
              <line
                key={`${from}-${to}`}
                x1={ca.cx} y1={ca.cy}
                x2={cb.cx} y2={cb.cy}
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.35"
              />
            );
          })}

          {/* Buildings */}
          {BUILDINGS.map((b) => {
            const isSelected = selectedBuilding?.id === b.id;
            const isOnRoute = activeRoute?.includes(b.id);
            const dimmed = !isVisible(b);
            const isGate = b.type === 'gate';
            const { cx, cy } = getBuildingCenter(b);

            const bFill = isSelected
              ? '#3157FF'
              : isOnRoute
                ? (theme === 'dark' ? '#3157FF44' : '#3157FF22')
                : (theme === 'dark' ? '#1A1A1A' : '#FFFFFF');
            const bStroke = isSelected ? '#3157FF' : strokeColor;
            const bStrokeW = isSelected || isOnRoute ? 3.5 : 2;

            return (
              <g
                key={b.id}
                role="button"
                tabIndex={0}
                aria-label={`${b.label} — ${b.department}. Click to view details.`}
                onClick={(e) => handleBuildingClick(b, e)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleBuildingClick(b, e)}
                style={{
                  opacity: dimmed ? 0.15 : 1,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                }}
              >
                {isGate ? (
                  <polygon
                    points={`${cx},${b.y} ${b.x + b.w},${cy} ${cx},${b.y + b.h} ${b.x},${cy}`}
                    fill={isSelected ? '#3157FF' : (theme === 'dark' ? '#2A2A2A' : '#E8E5DC')}
                    stroke={bStroke}
                    strokeWidth={bStrokeW}
                  />
                ) : (
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    fill={bFill}
                    stroke={bStroke}
                    strokeWidth={bStrokeW}
                    data-bid={b.id}
                  />
                )}

                {/* Building label */}
                <text
                  x={cx}
                  y={cy - 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fontFamily="Outfit, Archivo Black, Impact, sans-serif"
                  fontWeight="900"
                  fill={isSelected ? '#FFFFFF' : strokeColor}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {b.short}
                </text>
                {/* Code tag */}
                <text
                  x={cx}
                  y={cy + 9}
                  textAnchor="middle"
                  fontSize="7"
                  fontFamily="JetBrains Mono, Space Mono, monospace"
                  fill={isSelected ? '#C7F000' : strokeColor}
                  opacity={isSelected ? 1 : 0.6}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  [{b.code}]
                </text>
              </g>
            );
          })}

          {/* Active Route Path — Hyper Blue */}
          {routePathD && (
            <>
              <path
                d={routePathD}
                fill="none"
                stroke="#3157FF"
                strokeWidth="4"
                strokeDasharray="12 6"
                className="route-path"
                style={{ animation: 'dash-flow 2s linear infinite' }}
              />
              {/* Start node — Acid Lime */}
              {routePoints[0] && (
                <circle
                  cx={routePoints[0].cx}
                  cy={routePoints[0].cy}
                  r="9"
                  fill="none"
                  stroke="#C7F000"
                  strokeWidth="3"
                  className="pulse-marker"
                />
              )}
              {/* End node — Hyper Blue solid */}
              {routePoints[routePoints.length - 1] && routePoints.length > 1 && (
                <circle
                  cx={routePoints[routePoints.length - 1].cx}
                  cy={routePoints[routePoints.length - 1].cy}
                  r="9"
                  fill="#3157FF"
                  stroke="#111111"
                  strokeWidth="2"
                  className="pulse-marker"
                />
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
              onSetFrom={(id) => { setFromNode(id); setSelectedBuilding(null); }}
              onSetTo={(id) => { setToNode(id); setSelectedBuilding(null); }}
            />
          </div>
        )}

        {/* Map Controls (bottom-right) — using btn-brutal-icon for correct sizing */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2" style={{ zIndex: 30 }}>
          <button
            onClick={() => zoom(0.75)}
            className="btn-brutal-icon"
            aria-label="Zoom in"
            title="Zoom In"
          >
            <ZoomIn size={17} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => zoom(1.33)}
            className="btn-brutal-icon"
            aria-label="Zoom out"
            title="Zoom Out"
          >
            <ZoomOut size={17} strokeWidth={2.5} />
          </button>
          <button
            onClick={resetView}
            className="btn-brutal-icon"
            aria-label="Reset view"
            title="Reset View"
          >
            <Maximize size={17} strokeWidth={2.5} />
          </button>
        </div>

        {/* Coordinate readout */}
        <div
          className="absolute bottom-4 left-4 font-mono text-xs"
          style={{ zIndex: 30, color: theme === 'dark' ? '#00D9FF' : '#3157FF', opacity: 0.7 }}
        >
          VIEW: [{Math.round(viewBox.x)},{Math.round(viewBox.y)}] // ZOOM: {(SVG_W / viewBox.w).toFixed(1)}x
        </div>
      </div>
    </div>
  );
}
