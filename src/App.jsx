import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BUILDINGS, EVENTS, findPath, getBuildingById, calcRouteStats } from './data';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import DirectoryView from './components/DirectoryView';
import CampusMap from './components/CampusMap';
import RouteController from './components/RouteController';
import CommandPalette from './components/CommandPalette';

export const AppContext = React.createContext(null);

export default function App() {
  const [theme, setTheme] = useState('light');
  const [activeView, setActiveView] = useState('today');
  
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
      setActiveView('route'); // switch to map view
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
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg-main)] px-8 relative">
          
          {/* Header Area */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800 mb-4 sticky top-0 bg-[var(--bg-main)]/90 backdrop-blur-sm z-10">
             <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
               <span className="text-[var(--accent-blue)]">ALTS campus</span> / {activeView}
             </div>
             
             <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                 Student view <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
               </button>
             </div>
          </div>

          {/* Dynamic Views */}
          {activeView === 'today' && <DashboardView />}
          {activeView === 'directory' && <DirectoryView setSelectedBuilding={selectBuilding} />}
          {activeView === 'route' && (
            <div className="py-4 h-[calc(100vh-100px)] flex flex-col">
              <div className="mb-4">
                <RouteController />
              </div>
              <div className="flex-1 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">
                <CampusMap />
              </div>
            </div>
          )}
          
          {/* Fallback for unbuilt views */}
          {['complaints', 'firstaid', 'examhalls'].includes(activeView) && (
            <div className="flex items-center justify-center h-full text-gray-400 font-medium">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <p>This module is under construction.</p>
              </div>
            </div>
          )}

        </main>

        {cmdOpen && <CommandPalette />}
      </div>
    </AppContext.Provider>
  );
}
