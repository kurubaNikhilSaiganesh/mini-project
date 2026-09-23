import { useState, useEffect, useCallback } from 'react';
import { findPath, getBuildingById, calcRouteStats, EVENTS as INITIAL_EVENTS, MARQUEE_ITEMS } from './data';
import { useTheme } from './hooks/useTheme';
import { AppContext } from './context/AppContext';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MobileNav from './components/MobileNav';
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
import ExamsView from './components/ExamsView';
import SeatingView from './components/SeatingView';
import SearchView from './components/SearchView';
import NoticesView from './components/NoticesView';
import MarqueeTicker from './components/MarqueeTicker';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState('today');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // Shared data state
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [classes, setClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [roomOverrides, setRoomOverrides] = useState({});
  const [timetableOverrides, setTimetableOverrides] = useState({});

  useEffect(() => {
    fetch('https://localhost:8443/api/events')
      .then(res => res.json())
      .then(data => { if (data.length) setEvents(data); })
      .catch(err => console.error(err));

    fetch('https://localhost:8443/api/classes')
      .then(res => res.json())
      .then(data => { if (data.length) setClasses(data); })
      .catch(err => console.error(err));
  }, []);

  // Handle ALTS custom navigation events (from HeroSection)
  useEffect(() => {
    const handler = (e) => {
      if (e.detail) navigateTo(e.detail);
    };
    window.addEventListener('alts-navigate', handler);
    return () => window.removeEventListener('alts-navigate', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // ⌘K / Ctrl+K and Escape
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

  const addAnnouncement = useCallback((text, severity = 'ALERT') => {
    const id = `ann_${Date.now()}`;
    setAnnouncements((prev) => [{ id, text, severity, timestamp: new Date().toISOString() }, ...prev]);
    return id;
  }, []);

  const removeAnnouncement = useCallback((id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const applyRoomOverride = useCallback((classId, newRoomId) => {
    setRoomOverrides((prev) => ({ ...prev, [classId]: newRoomId }));
  }, []);

  const applyTimetableOverride = useCallback((slotId, changes) => {
    setTimetableOverrides((prev) => ({ ...prev, [slotId]: { ...(prev[slotId] || {}), ...changes } }));
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
    activeView, setActiveView: navigateTo,
    navigateTo,
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
    mobileMenuOpen, setMobileMenuOpen,
    // Shared data
    events, setEvents,
    classes, setClasses,
    announcements, addAnnouncement, removeAnnouncement,
    roomOverrides, applyRoomOverride,
    timetableOverrides, applyTimetableOverride,
    marqueeItems: MARQUEE_ITEMS,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: 'var(--bg-base)' }}
      >
        {/* Desktop + Mobile Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={navigateTo}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden my-3 mr-3 ml-1 lg:ml-3 rounded-3xl border border-[var(--glass-border)] bg-[var(--bg-surface)] shadow-xl relative transition-all duration-300">

          {/* Announcement ticker */}
          {announcements.length > 0 && (
            <MarqueeTicker items={announcements.map((a) => a.text)} />
          )}

          {/* Glass top bar */}
          <TopBar
            activeView={activeView}
            theme={theme}
            toggleTheme={toggleTheme}
            onMenuOpen={() => setMobileMenuOpen(true)}
            setCmdOpen={setCmdOpen}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />

          {/* Scrollable view */}
          <main
            id="main-scroll"
            className="flex-1 overflow-y-auto relative"
            style={{ paddingBottom: '80px' }}
          >
            <div key={activeView}>

              {activeView === 'today'     && <DashboardView />}
              {activeView === 'directory' && <DirectoryView setSelectedBuilding={selectBuilding} />}
              {activeView === 'events'    && <EventsSection />}
              {activeView === 'timetable' && <TimetableView />}
              {activeView === 'classes'   && <ClassesView />}
              {activeView === 'faculty'   && <FacultyView />}
              {activeView === 'rooms'     && <RoomsView />}
              {activeView === 'admin'     && <AdminView />}
              {activeView === 'exams'     && <ExamsView />}
              {activeView === 'seating'   && <SeatingView />}
              {activeView === 'search'    && <SearchView />}
              {activeView === 'notices'   && <NoticesView />}

              {activeView === 'route' && (
                <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
                  <div className="px-4 md:px-6 pt-4 pb-3">
                    <RouteController />
                  </div>
                  <div
                    className="flex-1"
                    style={{ borderTop: '1px solid var(--glass-border)', minHeight: 400 }}
                  >
                    <CampusMap />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileNav />

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
