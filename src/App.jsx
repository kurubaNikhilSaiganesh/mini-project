import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BUILDINGS, EVENTS, CLASSES, FACULTY, ROOMS, TIMETABLE,
  findPath, getBuildingById, calcRouteStats, getCurrentDay } from './data';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import DirectoryView from './components/DirectoryView';
import CampusMap from './components/CampusMap';
import RouteController from './components/RouteController';
import CommandPalette from './components/CommandPalette';
import EventsSection from './components/EventsSection';
import TimetableView from './components/TimetableView';
import ClassesView from './components/ClassesView';
import FacultyView from './components/FacultyView';
import RoomsView from './components/RoomsView';
import AdminView from './components/AdminView';
import RegisterModal from './components/RegisterModal';

export const AppContext = React.createContext(null);

export default function App() {
  const [theme, setTheme] = useState('light');
  const [activeView, setActiveView] = useState('today');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Apply theme
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Ctrl+K / Cmd+K, Escape
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
        setRegisterModal(null);
        setMobileMenuOpen(false);
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
    setFromNode('');
    setToNode('');
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
      setActiveView('route');
      setMobileMenuOpen(false);
    }
  }, []);

  const navigateTo = useCallback((view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
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
    navigateTo,
    mobileMenuOpen, setMobileMenuOpen,
    activeView, setActiveView,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="flex h-screen overflow-hidden">
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={navigateTo}
          theme={theme}
          toggleTheme={toggleTheme}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg-main)] relative">

          {/* Top bar */}
          <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b-2 border-[var(--border-color)] dark:border-[#2A2A2A] sticky top-0 bg-[var(--bg-main)]/95 backdrop-blur-sm z-20">
            {/* Hamburger (mobile) */}
            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 border-2 border-[#111111] dark:border-white"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <span className="w-5 h-0.5 bg-[#111111] dark:bg-white block" />
              <span className="w-5 h-0.5 bg-[#111111] dark:bg-white block" />
              <span className="w-5 h-0.5 bg-[#111111] dark:bg-white block" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span className="text-[var(--navigo-yellow)] font-bold">NAVIGO</span>
              <span>/</span>
              <span>{activeView.replace('_', ' ')}</span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Search hint */}
              <button
                onClick={() => setCmdOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 border-2 border-[#E5E7EB] dark:border-[#2A2A2A] text-xs font-mono text-gray-400 hover:border-[var(--navigo-yellow)] hover:text-[var(--navigo-yellow)] transition-colors"
                aria-label="Open command palette"
              >
                <span>Search</span>
                <kbd className="text-[10px] border border-current px-1">⌘K</kbd>
              </button>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center border-2 border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500 dark:text-gray-400 hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'dark' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Dynamic Views */}
          <div key={activeView} className="page-enter">
            {activeView === 'today'     && <DashboardView />}
            {activeView === 'directory' && <DirectoryView setSelectedBuilding={selectBuilding} />}
            {activeView === 'events'    && <EventsSection />}
            {activeView === 'timetable' && <TimetableView />}
            {activeView === 'classes'   && <ClassesView />}
            {activeView === 'faculty'   && <FacultyView />}
            {activeView === 'rooms'     && <RoomsView />}
            {activeView === 'admin'     && <AdminView />}

            {activeView === 'route' && (
              <div className="px-4 md:px-8 py-6 h-[calc(100vh-57px)] flex flex-col gap-4">
                <RouteController />
                <div className="flex-1 border-2 border-[#111111] dark:border-[#333333] overflow-hidden" style={{ minHeight: 300 }}>
                  <CampusMap />
                </div>
              </div>
            )}

            {/* Placeholder views */}
            {['complaints', 'firstaid', 'examhalls'].includes(activeView) && (
              <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center border-2 border-[#111111] dark:border-white p-12 max-w-sm mx-auto">
                  <p className="font-mono text-xs uppercase tracking-widest mb-2 text-[var(--navigo-yellow)]">
                    [MODULE STATUS]
                  </p>
                  <h2 className="font-display text-2xl uppercase font-bold mb-4">
                    {activeView === 'complaints' ? 'Complaints' :
                     activeView === 'firstaid'   ? 'First Aid'  : 'Exam Halls'}
                  </h2>
                  <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                    DATA NOT AVAILABLE
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Command Palette */}
        {cmdOpen && <CommandPalette />}

        {/* Register Modal */}
        {registerModal && (
          <RegisterModal
            event={registerModal}
            onClose={() => setRegisterModal(null)}
          />
        )}
      </div>
    </AppContext.Provider>
  );
}
