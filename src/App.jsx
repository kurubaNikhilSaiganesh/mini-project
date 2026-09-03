import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BUILDINGS, EVENTS, findPath, getBuildingById, calcRouteStats } from './data';
import Navbar from './components/Navbar';
import CampusMap from './components/CampusMap';
import RouteController from './components/RouteController';
import EventsSection from './components/EventsSection';
import CommandPalette from './components/CommandPalette';

export const AppContext = React.createContext(null);

export default function App() {
  const [theme, setTheme] = useState('light');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [activeRoute, setActiveRoute] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [activeZoneFilter, setActiveZoneFilter] = useState('all');
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 600 });
  const [cmdOpen, setCmdOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [registerModal, setRegisterModal] = useState(null);
  const mapSectionRef = useRef(null);

  // Apply theme to html element
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  // Ctrl+K / Cmd+K to open command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
        setRegisterModal(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const calculateRoute = useCallback(() => {
    if (!fromNode || !toNode || fromNode === toNode) return;
    const path = findPath(fromNode, toNode);
    if (path) {
      setActiveRoute(path);
      setRouteStats(calcRouteStats(path));
    }
  }, [fromNode, toNode]);

  const clearRoute = useCallback(() => {
    setActiveRoute(null);
    setRouteStats(null);
  }, []);

  const selectBuilding = useCallback((building, pos) => {
    setSelectedBuilding(building);
    if (pos) setPopupPos(pos);
  }, []);

  const locateOnMap = useCallback((buildingId) => {
    const b = getBuildingById(buildingId);
    if (b) {
      setSelectedBuilding(b);
      setViewBox({ x: b.x - 200, y: b.y - 150, w: 600, h: 450 });
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const ctx = {
    theme, toggleTheme,
    selectedBuilding, setSelectedBuilding: selectBuilding,
    fromNode, setFromNode,
    toNode, setToNode,
    activeRoute, setActiveRoute,
    routeStats, setRouteStats,
    activeZoneFilter, setActiveZoneFilter,
    viewBox, setViewBox,
    cmdOpen, setCmdOpen,
    popupPos, setPopupPos,
    calculateRoute, clearRoute,
    locateOnMap,
    registerModal, setRegisterModal,
    mapSectionRef,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="min-h-screen font-body" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <Navbar />

        {/* CMD Palette */}
        {cmdOpen && <CommandPalette />}

        {/* Register Modal */}
        {registerModal && (
          <div className="cmd-overlay" onClick={() => setRegisterModal(null)}>
            <div
              className="card-brutal bg-white dark:bg-[#2A2A2A] p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="tag-brutal mb-2 block">{registerModal.category}</span>
                  <h2 className="font-display text-2xl uppercase">{registerModal.title}</h2>
                </div>
                <button
                  onClick={() => setRegisterModal(null)}
                  className="btn-brutal text-xl w-10 h-10 p-0 flex items-center justify-center"
                >×</button>
              </div>
              <div className="border-t-2 border-black dark:border-white pt-4 space-y-3">
                <p className="font-mono text-sm">DATE: {registerModal.date} // {registerModal.time}</p>
                <p className="font-mono text-sm">VENUE: [{registerModal.venueName}]</p>
                <p className="text-sm mt-3">{registerModal.description}</p>
              </div>
              <div className="mt-6 p-4 border-2 border-black dark:border-white bg-[#F4F4F4] dark:bg-[#1A1A1A]">
                <p className="font-mono text-xs text-center">[ REGISTRATION CONFIRMED — CHECK YOUR EMAIL ]</p>
                <p className="font-mono text-xs text-center mt-1 opacity-60">SYS_REF: {registerModal.id.toUpperCase()}-{Date.now().toString(36).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setRegisterModal(null)}
                className="btn-brutal btn-brutal-filled w-full mt-4"
              >CLOSE CONFIRMATION</button>
            </div>
          </div>
        )}

        {/* NAV ENGINE SECTION */}
        <section ref={mapSectionRef} id="nav-engine" className="border-t-4" style={{ borderColor: 'var(--border)' }}>
          {/* Section Header */}
          <div className="border-b-4 px-6 py-4" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs" style={{ color: '#3157FF' }}>[01]</span>
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">
                NAV_ENGINE // FIND YOUR PATH
              </h2>
            </div>
            <div className="ascii-divider text-xs mt-2">
              {'// ───────────────────────────────────────────────── //'}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[380px_1fr]">
            <RouteController />
            <div className="border-t-4 lg:border-t-0 lg:border-l-4" style={{ borderColor: 'var(--border)' }}>
              <CampusMap />
            </div>
          </div>
        </section>

        {/* COLOR BAND DIVIDER */}
        <div className="border-t-4 border-b-4 px-6 py-1" style={{ borderColor: '#111111', background: '#3157FF' }}>
          <p className="font-mono text-xs overflow-hidden whitespace-nowrap" style={{ color: '#C7F000', letterSpacing: '0.15em' }}>
            {'▓'.repeat(200)}
          </p>
        </div>

        {/* EVENTS SECTION */}
        <EventsSection />

        {/* FOOTER */}
        <footer className="border-t-4 px-6 py-8 mt-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-dark, #E8E5DC)' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Logo + tagline */}
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="NaviGO Logo"
                style={{ height: '72px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
              <div>
                <p className="font-mono text-xs mt-1" style={{ color: '#3157FF' }}>
                  [SYS.VER: 2.0.1 // BUILD: {new Date().getFullYear()}]
                </p>
                <p className="font-mono text-xs mt-0.5" style={{ opacity: 0.45 }}>
                  CAMPUS NAVIGATION &amp; EVENT SYSTEM
                </p>
              </div>
            </div>
            {/* Right info */}
            <div className="font-mono text-xs space-y-1 text-right" style={{ opacity: 0.45 }}>
              <p>2D_SVG_ENGINE // NEO_BRUTALIST_UI</p>
              <p>NAVIGATION | EXPLORATION | SYSTEM</p>
              <p style={{ color: '#00D9FF', opacity: 0.7 }}>[STATUS: ONLINE // LIVE]</p>
            </div>
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
}
