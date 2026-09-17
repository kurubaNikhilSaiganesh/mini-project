import { useState, useContext } from 'react';
import { CLASSES, TIMETABLE, DAYS, getCurrentDay, getTimetableForDay } from '../data';
import { AppContext } from '../App';

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function isCurrentPeriod(startTime, endTime) {
  const now = getCurrentTime();
  return now >= startTime && now < endTime;
}

function isUpcoming(startTime) {
  return getCurrentTime() < startTime;
}

export default function TimetableView() {
  const { locateOnMap } = useContext(AppContext);
  const [selectedClassId, setSelectedClassId] = useState('cs_2a');
  const [viewMode, setViewMode] = useState('today'); // 'today' | 'week'

  const today = getCurrentDay();
  const selectedClass = CLASSES.find((c) => c.id === selectedClassId);

  const todaySlots = getTimetableForDay(selectedClassId, today);
  const allSlots   = TIMETABLE.filter((t) => t.classId === selectedClassId)
    .sort((a, b) => {
      const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      if (dayOrder.indexOf(a.day) !== dayOrder.indexOf(b.day)) {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      }
      return a.startTime.localeCompare(b.startTime);
    });

  const slotsByDay = DAYS.reduce((acc, day) => {
    acc[day] = allSlots.filter((s) => s.day === day);
    return acc;
  }, {});

  const statusOf = (slot) => {
    if (slot.day !== today) return 'other';
    if (isCurrentPeriod(slot.startTime, slot.endTime)) return 'current';
    if (isUpcoming(slot.startTime)) return 'upcoming';
    return 'done';
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[var(--navigo-yellow)] uppercase tracking-widest mb-2">
          [TIMETABLE_SYS]
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
          Timetable.
        </h1>
        <p className="text-gray-500 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          <span className="font-mono ml-2 text-xs text-[var(--navigo-yellow)]">
            [TODAY: {today}]
          </span>
        </p>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Class selector */}
        <div className="flex-1">
          <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">
            Select Class
          </label>
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full appearance-none border-2 border-[#111111] dark:border-[#333333] bg-white dark:bg-[#141414] text-[#111111] dark:text-white px-4 py-3 pr-10 font-medium text-sm focus:outline-none focus:border-[var(--navigo-yellow)] transition-colors cursor-pointer"
            >
              {CLASSES.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.shortName}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex border-2 border-[#111111] dark:border-[#333333] self-end h-[50px]">
          <button
            onClick={() => setViewMode('today')}
            className={`px-6 text-sm font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'today'
                ? 'bg-[var(--navigo-yellow)] text-[#111111]'
                : 'bg-transparent text-gray-500 hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-6 text-sm font-bold uppercase tracking-wider border-l-2 border-[#111111] dark:border-[#333333] transition-colors ${
              viewMode === 'week'
                ? 'bg-[var(--navigo-yellow)] text-[#111111]'
                : 'bg-transparent text-gray-500 hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Class info strip */}
      {selectedClass && (
        <div className="border-2 border-[#111111] dark:border-[#333333] p-4 mb-6 flex flex-wrap gap-6 bg-[var(--navigo-yellow)]/10">
          <div>
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Class</p>
            <p className="font-bold text-sm">{selectedClass.name}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Department</p>
            <p className="font-bold text-sm">{selectedClass.department}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Strength</p>
            <p className="font-bold text-sm">{selectedClass.strength} students</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Year / Section</p>
            <p className="font-bold text-sm">Year {selectedClass.year} — Section {selectedClass.section}</p>
          </div>
        </div>
      )}

      {/* TODAY VIEW */}
      {viewMode === 'today' && (
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
            {today === 'SUN' || today === 'SAT' ? 'No classes this day' : `Schedule for ${today}`}
          </h2>

          {todaySlots.length === 0 ? (
            <div className="border-2 border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] p-12 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
                — NO CLASSES SCHEDULED —
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySlots.map((slot) => {
                const status = statusOf(slot);
                const isCurrent = status === 'current';
                const isDone = status === 'done';

                return (
                  <div
                    key={slot.id}
                    className={`border-2 p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${
                      isCurrent
                        ? 'border-[var(--navigo-green)] bg-[var(--navigo-green)]/5'
                        : isDone
                          ? 'border-[#E5E7EB] dark:border-[#2A2A2A] opacity-50'
                          : 'border-[#111111] dark:border-[#333333] hover:shadow-brutal'
                    }`}
                  >
                    {/* Time */}
                    <div className="shrink-0 text-center sm:text-left min-w-[80px]">
                      <p className="font-mono text-lg font-bold text-[#111111] dark:text-white leading-tight">
                        {slot.startTime}
                      </p>
                      <p className="font-mono text-xs text-gray-400">–{slot.endTime}</p>
                    </div>

                    {/* Divider */}
                    <div className={`w-full sm:w-0.5 h-0.5 sm:h-12 ${isCurrent ? 'bg-[var(--navigo-green)]' : 'bg-[#E5E7EB] dark:bg-[#2A2A2A]'} sm:block`} />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-base leading-tight">{slot.subject}</h3>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">
                            ROOM: {slot.roomId?.replace('room_', '').toUpperCase()}
                          </p>
                        </div>
                        {isCurrent && (
                          <span className="shrink-0 text-[9px] font-mono font-bold uppercase px-2 py-1 bg-[var(--navigo-green)] text-white">
                            NOW
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    {!isDone && (
                      <button
                        onClick={() => {
                          locateOnMap(selectedClass.facultyIds?.[0] ? 'academic_a' : 'academic_a');
                        }}
                        className="shrink-0 btn-secondary text-xs px-4 py-2"
                        title="Locate room on map"
                      >
                        Locate →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="overflow-x-auto -mx-4 md:-mx-8 px-4 md:px-8">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-6 gap-px bg-[#111111] dark:bg-[#333333] border-2 border-[#111111] dark:border-[#333333]">
              {DAYS.map((day) => (
                <div key={day} className={`bg-[var(--bg-main)]`}>
                  {/* Day header */}
                  <div className={`px-3 py-2 border-b-2 border-[#111111] dark:border-[#333333] ${
                    day === today ? 'bg-[var(--navigo-yellow)] text-[#111111]' : ''
                  }`}>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider">
                      {day} {day === today && '◆'}
                    </p>
                  </div>

                  {/* Slots */}
                  <div className="p-2 space-y-1.5 min-h-[120px]">
                    {slotsByDay[day]?.length === 0 && (
                      <p className="font-mono text-[9px] text-gray-400 uppercase text-center pt-3">—</p>
                    )}
                    {slotsByDay[day]?.map((slot) => {
                      const isCurrent = isCurrentPeriod(slot.startTime, slot.endTime) && day === today;
                      return (
                        <div
                          key={slot.id}
                          className={`p-2 border ${
                            isCurrent
                              ? 'border-[var(--navigo-green)] bg-[var(--navigo-green)]/10'
                              : 'border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A]'
                          }`}
                        >
                          <p className="font-mono text-[8px] text-gray-400">{slot.startTime}–{slot.endTime}</p>
                          <p className="text-[10px] font-bold leading-tight mt-0.5">{slot.subject}</p>
                          {isCurrent && (
                            <span className="text-[8px] font-mono text-[var(--navigo-green)] font-bold">● NOW</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
