import { useState, useContext } from 'react';
import { AppContext } from '../App';
import { BUILDINGS, FACULTY, ROOMS, CLASSES, TIMETABLE, getRoomById, getClassById } from '../data';

const CATEGORIES = ['WORKSHOP', 'LECTURE', 'TECH_FEST', 'HACKATHON', 'CULTURAL_FEST', 'SPORTS', 'COMPETITION'];
const SEVERITIES = ['ALERT', 'NOTICE', 'DEADLINE', 'UPDATE', 'EMERGENCY'];

export default function AdminView() {
  const {
    events, setEvents,
    announcements, addAnnouncement, removeAnnouncement,
    roomOverrides, applyRoomOverride,
    timetableOverrides, applyTimetableOverride,
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('events');
  const [successMsg, setSuccessMsg] = useState('');

  // Event form state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', category: 'WORKSHOP', date: '', time: '', venue: 'auditorium', description: '',
  });

  // Room change state
  const [roomChangeClass, setRoomChangeClass] = useState('');
  const [roomChangeNewRoom, setRoomChangeNewRoom] = useState('');
  const [roomChangeConfirm, setRoomChangeConfirm] = useState(false);

  // Timetable reschedule state
  const [ttSlotId, setTtSlotId] = useState('');
  const [ttNewStart, setTtNewStart] = useState('');
  const [ttNewEnd, setTtNewEnd] = useState('');
  const [ttNewRoom, setTtNewRoom] = useState('');
  const [ttConfirm, setTtConfirm] = useState(false);

  // Announcement state
  const [annText, setAnnText] = useState('');
  const [annSeverity, setAnnSeverity] = useState('ALERT');

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // --- Events ---
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    const event = {
      ...newEvent,
      id: `custom_${Date.now()}`,
      venueName: BUILDINGS.find((b) => b.id === newEvent.venue)?.label || newEvent.venue,
      organizer: 'Admin',
      status: 'UPCOMING',
      span: 'small',
    };
    setEvents([...events, event]);
    setNewEvent({ title: '', category: 'WORKSHOP', date: '', time: '', venue: 'auditorium', description: '' });
    setShowAddEvent(false);
    flash('Event added — visible on Events page.');
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    flash('Event removed from Events page.');
  };

  // --- Room change ---
  const handleRoomChange = () => {
    if (!roomChangeClass || !roomChangeNewRoom) return;
    applyRoomOverride(roomChangeClass, roomChangeNewRoom);
    const cls = getClassById(roomChangeClass);
    const room = getRoomById(roomChangeNewRoom);
    flash(`Room change applied: ${cls?.shortName} → ${room?.number}. Visible on Classes & Rooms pages.`);
    setRoomChangeClass('');
    setRoomChangeNewRoom('');
    setRoomChangeConfirm(false);
  };

  // --- Timetable reschedule ---
  const selectedSlot = TIMETABLE.find((t) => t.id === ttSlotId);
  const handleTimetableOverride = () => {
    if (!ttSlotId) return;
    const changes = {};
    if (ttNewStart) changes.startTime = ttNewStart;
    if (ttNewEnd) changes.endTime = ttNewEnd;
    if (ttNewRoom) changes.roomId = ttNewRoom;
    applyTimetableOverride(ttSlotId, changes);
    flash('Timetable slot updated. Reflected on Timetable page.');
    setTtSlotId(''); setTtNewStart(''); setTtNewEnd(''); setTtNewRoom('');
    setTtConfirm(false);
  };

  // --- Announcements ---
  const handleAddAnnouncement = () => {
    if (!annText.trim()) return;
    addAnnouncement(annText.trim(), annSeverity);
    setAnnText('');
    flash('Announcement broadcast to marquee and dashboard.');
  };

  const stats = [
    { label: 'Buildings', value: BUILDINGS.length, color: 'var(--navigo-yellow)' },
    { label: 'Faculty', value: FACULTY.length, color: 'var(--navigo-green)' },
    { label: 'Rooms', value: ROOMS.length, color: '#3157FF' },
    { label: 'Classes', value: CLASSES.length, color: '#FF4757' },
    { label: 'Events', value: events.length, color: '#747DFF' },
  ];

  const TABS = [
    { id: 'events', label: 'Events' },
    { id: 'rooms', label: 'Room Changes' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'announce', label: 'Announcements' },
    { id: 'data', label: 'Data Overview' },
  ];

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[var(--navigo-yellow)] uppercase tracking-widest">[ADMIN_PANEL]</span>
          <span className="font-mono text-[9px] border border-[#FF4757] text-[#FF4757] px-2 py-0.5">
            SESSION LOCAL — CHANGES NOT PERSISTED
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">
          Admin Panel.
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Manage campus data. Changes propagate live to public pages within this session.
        </p>
      </div>

      {/* Success flash */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-3 border-2 border-[var(--navigo-green)] bg-[var(--navigo-green)]/10 px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navigo-green)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span className="font-mono text-sm text-[var(--navigo-green)]">{successMsg}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="border-2 border-[#111111] dark:border-[#333333] p-4 bg-white dark:bg-[#141414]">
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="font-display text-3xl font-bold" style={{ color: s.color }}>
              {String(s.value).padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>

      {/* Active announcements banner */}
      {announcements.length > 0 && (
        <div className="mb-6 border-2 border-[#FF4757] p-4 bg-[#FF4757]/10">
          <p className="font-mono text-[9px] text-[#FF4757] uppercase tracking-widest mb-2">
            {announcements.length} Active Broadcast{announcements.length > 1 ? 's' : ''}
          </p>
          <div className="flex flex-col gap-2">
            {announcements.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-[#FF4757]">[{a.severity}] {a.text}</span>
                <button
                  onClick={() => removeAnnouncement(a.id)}
                  className="font-mono text-[9px] px-2 py-0.5 border border-[#FF4757] text-[#FF4757] hover:bg-[#FF4757] hover:text-white transition-colors shrink-0"
                  aria-label="Remove announcement"
                >
                  REVOKE
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b-2 border-[#111111] dark:border-[#333333] mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-mono text-xs uppercase tracking-wider px-5 py-3 whitespace-nowrap border-b-2 -mb-[2px] transition-colors ${
              activeTab === tab.id
                ? 'border-[var(--navigo-yellow)] text-[#111111] dark:text-white font-bold'
                : 'border-transparent text-gray-400 hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Events Tab ── */}
      {activeTab === 'events' && (
        <div className="border-2 border-[#111111] dark:border-[#333333]">
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111] dark:border-[#333333] bg-[#F7F5F0] dark:bg-[#1A1A1A]">
            <div>
              <h2 className="font-display text-xl font-bold uppercase">Events Management</h2>
              <p className="font-mono text-[10px] text-gray-500 mt-0.5">{events.length} events in system</p>
            </div>
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="btn-primary text-xs py-2 px-4"
            >
              {showAddEvent ? '✕ Cancel' : '+ Add Event'}
            </button>
          </div>

          {showAddEvent && (
            <div className="p-5 border-b-2 border-[var(--navigo-yellow)] bg-[var(--navigo-yellow)]/5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">New Event</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Title *</label>
                  <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Event title" className="input-field" />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Category</label>
                  <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} className="input-field appearance-none cursor-pointer">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Date * (YYYY.MM.DD)</label>
                  <input type="text" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} placeholder="2026.12.01" className="input-field font-mono" />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Time *</label>
                  <input type="text" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} placeholder="10:00 AM" className="input-field font-mono" />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Venue</label>
                  <select value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} className="input-field appearance-none cursor-pointer">
                    {BUILDINGS.filter((b) => b.type !== 'gate').map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                  <input type="text" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Short description" className="input-field" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleAddEvent} disabled={!newEvent.title || !newEvent.date || !newEvent.time} className="btn-primary text-xs py-2 px-6 disabled:opacity-40">
                  Save Event
                </button>
                <button onClick={() => setShowAddEvent(false)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
              </div>
            </div>
          )}

          <div>
            {events.map((event, idx) => (
              <div
                key={event.id}
                className={`flex items-start gap-4 px-5 py-4 border-b border-[#E5E7EB] dark:border-[#2A2A2A] ${
                  idx % 2 === 0 ? 'bg-white dark:bg-[#141414]' : 'bg-[#FAFAFA] dark:bg-[#111111]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-mono text-[9px] px-1.5 py-0.5 border border-current text-[var(--navigo-yellow)]">{event.category}</span>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 ${event.status === 'UPCOMING' ? 'bg-[var(--navigo-yellow)]/20 text-[var(--navigo-yellow)]' : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-500'}`}>{event.status}</span>
                    {event.id.startsWith('custom_') && (
                      <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[var(--navigo-green)]/20 text-[var(--navigo-green)]">NEW</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm">{event.title}</h4>
                  <p className="font-mono text-[10px] text-gray-500">{event.date} · {event.time} · {event.venueName}</p>
                </div>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center border-2 border-[#FF4757] text-[#FF4757] hover:bg-[#FF4757] hover:text-white transition-colors"
                  aria-label={`Delete ${event.title}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Room Changes Tab ── */}
      {activeTab === 'rooms' && (
        <div className="border-2 border-[#111111] dark:border-[#333333]">
          <div className="px-5 py-4 border-b-2 border-[#111111] dark:border-[#333333] bg-[#F7F5F0] dark:bg-[#1A1A1A]">
            <h2 className="font-display text-xl font-bold uppercase">Room Change</h2>
            <p className="font-mono text-[10px] text-gray-500 mt-0.5">Reassign a class to a different room — propagates to Classes, Rooms, and Timetable pages</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Class</label>
                <select
                  value={roomChangeClass}
                  onChange={(e) => { setRoomChangeClass(e.target.value); setRoomChangeConfirm(false); }}
                  className="input-field appearance-none cursor-pointer"
                >
                  <option value="">— Select Class —</option>
                  {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">New Room</label>
                <select
                  value={roomChangeNewRoom}
                  onChange={(e) => { setRoomChangeNewRoom(e.target.value); setRoomChangeConfirm(false); }}
                  className="input-field appearance-none cursor-pointer"
                >
                  <option value="">— Select Room —</option>
                  {ROOMS.map((r) => <option key={r.id} value={r.id}>{r.number} — {r.building} ({r.type})</option>)}
                </select>
              </div>
            </div>

            {roomChangeClass && roomChangeNewRoom && !roomChangeConfirm && (
              <div className="border-2 border-[var(--navigo-yellow)] bg-[var(--navigo-yellow)]/5 p-4 mb-4">
                <p className="font-mono text-xs mb-3">
                  <span className="font-bold">{getClassById(roomChangeClass)?.name}</span>
                  {' → '}
                  <span className="font-bold">{getRoomById(roomChangeNewRoom)?.number}</span>
                  , effective immediately
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setRoomChangeConfirm(true)} className="btn-primary text-xs py-2 px-5">CONFIRM</button>
                  <button onClick={() => { setRoomChangeClass(''); setRoomChangeNewRoom(''); }} className="btn-secondary text-xs py-2 px-4">CANCEL</button>
                </div>
              </div>
            )}

            {roomChangeConfirm && (
              <button onClick={handleRoomChange} className="btn-green text-xs py-2 px-6">
                Apply Room Change
              </button>
            )}

            {/* Active overrides */}
            {Object.keys(roomOverrides).length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-2">Active Room Overrides</p>
                <div className="border-2 border-[#111111] dark:border-[#333333] divide-y divide-[#E5E7EB] dark:divide-[#2A2A2A]">
                  {Object.entries(roomOverrides).map(([classId, roomId]) => {
                    const cls = getClassById(classId);
                    const room = getRoomById(roomId);
                    return (
                      <div key={classId} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#141414]">
                        <div>
                          <span className="font-bold text-sm">{cls?.shortName}</span>
                          <span className="font-mono text-xs text-gray-400 ml-2">→ {room?.number}</span>
                        </div>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[var(--navigo-yellow)]/20 text-[var(--navigo-yellow)]">ACTIVE</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Timetable Tab ── */}
      {activeTab === 'timetable' && (
        <div className="border-2 border-[#111111] dark:border-[#333333]">
          <div className="px-5 py-4 border-b-2 border-[#111111] dark:border-[#333333] bg-[#F7F5F0] dark:bg-[#1A1A1A]">
            <h2 className="font-display text-xl font-bold uppercase">Timetable Reschedule</h2>
            <p className="font-mono text-[10px] text-gray-500 mt-0.5">Override a specific timetable slot&apos;s time or room</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Select Slot</label>
                <select
                  value={ttSlotId}
                  onChange={(e) => { setTtSlotId(e.target.value); setTtConfirm(false); }}
                  className="input-field appearance-none cursor-pointer"
                >
                  <option value="">— Select a timetable slot —</option>
                  {TIMETABLE.map((t) => {
                    const cls = getClassById(t.classId);
                    return (
                      <option key={t.id} value={t.id}>
                        {cls?.shortName} — {t.day} {t.startTime}–{t.endTime} — {t.subject}
                      </option>
                    );
                  })}
                </select>
              </div>

              {ttSlotId && (
                <>
                  <div>
                    <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                      New Start Time (leave blank to keep {selectedSlot?.startTime})
                    </label>
                    <input type="text" value={ttNewStart} onChange={(e) => setTtNewStart(e.target.value)} placeholder={selectedSlot?.startTime} className="input-field font-mono" />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                      New End Time (leave blank to keep {selectedSlot?.endTime})
                    </label>
                    <input type="text" value={ttNewEnd} onChange={(e) => setTtNewEnd(e.target.value)} placeholder={selectedSlot?.endTime} className="input-field font-mono" />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">New Room (optional)</label>
                    <select value={ttNewRoom} onChange={(e) => setTtNewRoom(e.target.value)} className="input-field appearance-none cursor-pointer">
                      <option value="">— Keep current room —</option>
                      {ROOMS.map((r) => <option key={r.id} value={r.id}>{r.number} — {r.building}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            {ttSlotId && (ttNewStart || ttNewEnd || ttNewRoom) && !ttConfirm && (
              <div className="border-2 border-[var(--navigo-yellow)] bg-[var(--navigo-yellow)]/5 p-4 mb-4">
                <p className="font-mono text-xs mb-3">
                  Reschedule <span className="font-bold">{selectedSlot?.subject}</span>
                  {ttNewStart ? ` to ${ttNewStart}` : ''}{ttNewEnd ? `–${ttNewEnd}` : ''}
                  {ttNewRoom ? `, room → ${getRoomById(ttNewRoom)?.number}` : ''}
                  , effective immediately
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setTtConfirm(true)} className="btn-primary text-xs py-2 px-5">CONFIRM</button>
                  <button onClick={() => { setTtSlotId(''); setTtNewStart(''); setTtNewEnd(''); setTtNewRoom(''); }} className="btn-secondary text-xs py-2 px-4">CANCEL</button>
                </div>
              </div>
            )}

            {ttConfirm && (
              <button onClick={handleTimetableOverride} className="btn-green text-xs py-2 px-6">
                Apply Reschedule
              </button>
            )}

            {Object.keys(timetableOverrides).length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-2">Active Timetable Overrides</p>
                <div className="border-2 border-[#111111] dark:border-[#333333] divide-y divide-[#E5E7EB] dark:divide-[#2A2A2A]">
                  {Object.entries(timetableOverrides).map(([slotId, changes]) => {
                    const slot = TIMETABLE.find((t) => t.id === slotId);
                    return (
                      <div key={slotId} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#141414]">
                        <div>
                          <span className="font-bold text-sm">{slot?.subject}</span>
                          <span className="font-mono text-xs text-gray-400 ml-2">
                            {changes.startTime || slot?.startTime}–{changes.endTime || slot?.endTime}
                            {changes.roomId ? ` → ${getRoomById(changes.roomId)?.number}` : ''}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[var(--navigo-yellow)]/20 text-[var(--navigo-yellow)]">OVERRIDDEN</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Announcements Tab ── */}
      {activeTab === 'announce' && (
        <div className="border-2 border-[#111111] dark:border-[#333333]">
          <div className="px-5 py-4 border-b-2 border-[#111111] dark:border-[#333333] bg-[#F7F5F0] dark:bg-[#1A1A1A]">
            <h2 className="font-display text-xl font-bold uppercase">Broadcast Announcement</h2>
            <p className="font-mono text-[10px] text-gray-500 mt-0.5">Message appears in the marquee ticker and dashboard banner across all pages</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Message *</label>
                <input
                  type="text"
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAnnouncement()}
                  placeholder="e.g. CLASS A-301 CANCELLED TODAY"
                  className="input-field"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Severity</label>
                <select value={annSeverity} onChange={(e) => setAnnSeverity(e.target.value)} className="input-field appearance-none cursor-pointer">
                  {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleAddAnnouncement} disabled={!annText.trim()} className="btn-primary text-xs py-2 px-6 disabled:opacity-40">
              Broadcast Now
            </button>

            {announcements.length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-2">Live Broadcasts ({announcements.length})</p>
                <div className="border-2 border-[#FF4757] divide-y divide-[#FF4757]/30">
                  {announcements.map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-4 py-3 bg-[#FF4757]/5">
                      <div>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 border border-[#FF4757] text-[#FF4757] mr-2">{a.severity}</span>
                        <span className="font-mono text-sm">{a.text}</span>
                      </div>
                      <button
                        onClick={() => removeAnnouncement(a.id)}
                        className="font-mono text-[9px] px-2 py-0.5 border border-[#FF4757] text-[#FF4757] hover:bg-[#FF4757] hover:text-white transition-colors ml-3 shrink-0"
                      >
                        REVOKE
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {announcements.length === 0 && (
              <div className="mt-6 border-2 border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] p-8 text-center">
                <p className="font-mono text-xs uppercase tracking-wider text-gray-400">No active broadcasts</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Data Overview Tab ── */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buildings */}
          <div className="border-2 border-[#111111] dark:border-[#333333]">
            <div className="px-4 py-3 border-b-2 border-[#111111] dark:border-[#333333] bg-[#F7F5F0] dark:bg-[#1A1A1A]">
              <h3 className="font-bold text-sm uppercase tracking-tight">Buildings</h3>
              <p className="font-mono text-[9px] text-gray-400">Read-only</p>
            </div>
            <div className="divide-y divide-[#E5E7EB] dark:divide-[#2A2A2A]">
              {BUILDINGS.filter((b) => b.type !== 'gate').map((b) => (
                <div key={b.id} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{b.label}</p>
                    <p className="font-mono text-[9px] text-gray-500">{b.code} · {b.type}</p>
                  </div>
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 ${b.accessible ? 'text-[var(--navigo-green)]' : 'text-gray-400'}`}>
                    {b.accessible ? '♿ YES' : '♿ NO'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty */}
          <div className="border-2 border-[#111111] dark:border-[#333333]">
            <div className="px-4 py-3 border-b-2 border-[#111111] dark:border-[#333333] bg-[#F7F5F0] dark:bg-[#1A1A1A]">
              <h3 className="font-bold text-sm uppercase tracking-tight">Faculty</h3>
              <p className="font-mono text-[9px] text-gray-400">Read-only</p>
            </div>
            <div className="divide-y divide-[#E5E7EB] dark:divide-[#2A2A2A]">
              {FACULTY.map((f) => (
                <div key={f.id} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="font-mono text-[9px] text-gray-500">{f.designation}</p>
                  </div>
                  <p className="font-mono text-[9px] text-gray-400 max-w-[120px] text-right truncate">{f.department}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
