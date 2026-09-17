import React, { useState } from 'react';
import { BUILDINGS, EVENTS, FACULTY, ROOMS, CLASSES } from '../data';

export default function AdminView() {
  const [events, setEvents] = useState(EVENTS);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', category: 'WORKSHOP', date: '', time: '', venue: 'auditorium', description: ''
  });
  const [editId, setEditId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const stats = [
    { label: 'Buildings', value: BUILDINGS.length, color: 'var(--navigo-yellow)' },
    { label: 'Faculty', value: FACULTY.length, color: 'var(--navigo-green)' },
    { label: 'Rooms', value: ROOMS.length, color: '#3157FF' },
    { label: 'Classes', value: CLASSES.length, color: '#FF4757' },
    { label: 'Events', value: events.length, color: '#747DFF' },
  ];

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
    flash('Event added successfully.');
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    flash('Event removed.');
  };

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

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
          Manage campus data. <strong>Note:</strong> All changes are session-only and will reset on page refresh.
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

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="border-2 border-[#111111] dark:border-[#333333] p-4 bg-white dark:bg-[#141414]">
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p
              className="font-display text-3xl font-bold"
              style={{ color: s.color }}
            >
              {String(s.value).padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>

      {/* Events management */}
      <div className="border-2 border-[#111111] dark:border-[#333333]">
        {/* Section header */}
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

        {/* Add event form */}
        {showAddEvent && (
          <div className="p-5 border-b-2 border-[var(--navigo-yellow)] bg-[var(--navigo-yellow)]/5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">New Event</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                  className="input-field"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  className="input-field appearance-none cursor-pointer"
                >
                  {['WORKSHOP', 'LECTURE', 'TECH_FEST', 'HACKATHON', 'CULTURAL_FEST', 'SPORTS', 'COMPETITION'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Date * (YYYY.MM.DD)</label>
                <input
                  type="text"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  placeholder="2026.12.01"
                  className="input-field font-mono"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Time *</label>
                <input
                  type="text"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  placeholder="10:00 AM"
                  className="input-field font-mono"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Venue</label>
                <select
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="input-field appearance-none cursor-pointer"
                >
                  {BUILDINGS.filter((b) => b.type !== 'gate').map((b) => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                <input
                  type="text"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Short description"
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title || !newEvent.date || !newEvent.time}
                className="btn-primary text-xs py-2 px-6 disabled:opacity-40"
              >
                Save Event
              </button>
              <button
                onClick={() => setShowAddEvent(false)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Events list */}
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
                  <span className="font-mono text-[9px] px-1.5 py-0.5 border border-current text-[var(--navigo-yellow)]">
                    {event.category}
                  </span>
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 ${
                    event.status === 'UPCOMING'
                      ? 'bg-[var(--navigo-yellow)]/20 text-[var(--navigo-yellow)]'
                      : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-500'
                  }`}>
                    {event.status}
                  </span>
                  {event.id.startsWith('custom_') && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[var(--navigo-green)]/20 text-[var(--navigo-green)]">
                      NEW
                    </span>
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

      {/* Read-only data tables */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buildings summary */}
        <div className="border-2 border-[#111111] dark:border-[#333333]">
          <div className="px-4 py-3 border-b-2 border-[#111111] dark:border-[#333333] bg-[#F7F5F0] dark:bg-[#1A1A1A]">
            <h3 className="font-bold text-sm uppercase tracking-tight">Buildings</h3>
            <p className="font-mono text-[9px] text-gray-400">Read-only</p>
          </div>
          <div className="divide-y divide-[#E5E7EB] dark:divide-[#2A2A2A]">
            {BUILDINGS.filter((b) => b.type !== 'gate').slice(0, 6).map((b) => (
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

        {/* Faculty summary */}
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
    </div>
  );
}
