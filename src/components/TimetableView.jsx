import { useState, useContext } from 'react';
import { CLASSES, TIMETABLE, DAYS, getCurrentDay, getTimetableForDay } from '../data';
import { AppContext } from '../context/AppContext';
import { Clock, MapPin, CheckCircle2, Circle, ChevronDown } from 'lucide-react';

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
  const allSlots = TIMETABLE.filter((t) => t.classId === selectedClassId)
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
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto page-enter space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-1 border border-[var(--glass-border)] mb-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-bold">
            Timetable System
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          Schedule.
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          <span className="font-mono ml-2 text-xs text-amber-500">· Today: {today}</span>
        </p>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Class selector */}
        <div className="flex-1">
          <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
            Select Class
          </label>
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="glass-select rounded-full py-3 pr-10 pl-5 text-sm font-semibold appearance-none cursor-pointer w-full shadow-xs"
            >
              {CLASSES.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-[#141414]">
                  {c.name} — {c.shortName}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
              <ChevronDown size={14} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* View mode pills */}
        <div className="flex self-end">
          <div
            className="flex p-1 rounded-full glass-1 border border-[var(--glass-border)] gap-1"
          >
            {['today', 'week'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all capitalize ${
                  viewMode === mode
                    ? 'bg-amber-400 text-black shadow-sm scale-[1.02]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {mode === 'today' ? 'Today' : 'This Week'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Class info strip */}
      {selectedClass && (
        <div className="glass-card rounded-3xl p-5 border border-[var(--glass-border)] flex flex-wrap gap-6">
          {[
            { label: 'Class', value: selectedClass.name },
            { label: 'Department', value: selectedClass.department },
            { label: 'Strength', value: `${selectedClass.strength} students` },
            { label: 'Year / Section', value: `Year ${selectedClass.year} — Section ${selectedClass.section}` },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">{item.label}</p>
              <p className="font-semibold text-sm text-[var(--text-primary)]">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* TODAY VIEW */}
      {viewMode === 'today' && (
        <div className="space-y-3">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-1">
            {today === 'SUN' || today === 'SAT' ? 'Weekend — No classes' : `Periods for ${today}`}
          </h2>

          {todaySlots.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-[var(--glass-border-strong)]">
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                No classes scheduled today
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySlots.map((slot) => {
                const status = statusOf(slot);
                const isCurrent = status === 'current';
                const isDone    = status === 'done';

                return (
                  <div
                    key={slot.id}
                    className={`glass-card rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 border transition-all ${
                      isCurrent
                        ? 'border-emerald-500/40 bg-emerald-500/5 shadow-md'
                        : isDone
                          ? 'border-[var(--glass-border)] opacity-45'
                          : 'border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] hover:shadow-md'
                    }`}
                  >
                    {/* Time column */}
                    <div className="shrink-0 text-center sm:text-left min-w-[90px]">
                      <div className="flex sm:flex-col items-center sm:items-start gap-2">
                        {isCurrent ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        ) : isDone ? (
                          <Circle size={16} className="text-[var(--text-subtle)] shrink-0" />
                        ) : (
                          <Clock size={16} className="text-amber-400 shrink-0" />
                        )}
                        <div>
                          <p className="font-mono text-xl font-extrabold text-[var(--text-primary)] leading-none">
                            {slot.startTime}
                          </p>
                          <p className="font-mono text-xs text-[var(--text-muted)]">–{slot.endTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div
                      className={`w-full sm:w-px h-px sm:h-10 ${isCurrent ? 'bg-emerald-500/40' : 'bg-[var(--glass-border)]'}`}
                    />

                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display font-bold text-lg leading-tight text-[var(--text-primary)]">
                          {slot.subject}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                          ROOM: {slot.roomId?.replace('room_', '').toUpperCase()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCurrent && (
                          <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
                            ● NOW
                          </span>
                        )}
                        {!isDone && (
                          <button
                            onClick={() => locateOnMap('academic_a')}
                            className="glass-btn glass-btn-sm rounded-full text-xs flex items-center gap-1.5 shrink-0"
                          >
                            <MapPin size={12} />
                            <span>Locate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="overflow-x-auto -mx-4 md:-mx-0 pb-4">
          <div className="min-w-[640px] grid grid-cols-6 gap-3">
            {DAYS.map((day) => {
              const isToday = day === today;
              return (
                <div
                  key={day}
                  className={`glass-card rounded-2xl overflow-hidden border ${
                    isToday
                      ? 'border-amber-400/40 bg-amber-400/5 shadow-md'
                      : 'border-[var(--glass-border)]'
                  }`}
                >
                  {/* Day header */}
                  <div
                    className={`px-3 py-2.5 text-center border-b border-[var(--glass-border)] ${
                      isToday ? 'bg-amber-400 text-black' : 'glass-2 text-[var(--text-primary)]'
                    }`}
                  >
                    <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider">
                      {day} {isToday && '◆'}
                    </p>
                  </div>

                  {/* Slots */}
                  <div className="p-2 space-y-1.5 min-h-[120px]">
                    {slotsByDay[day]?.length === 0 && (
                      <p className="font-mono text-[9px] text-[var(--text-subtle)] uppercase text-center pt-4">—</p>
                    )}
                    {slotsByDay[day]?.map((slot) => {
                      const isCurrent = isCurrentPeriod(slot.startTime, slot.endTime) && day === today;
                      return (
                        <div
                          key={slot.id}
                          className={`p-2 rounded-lg text-left border transition-all ${
                            isCurrent
                              ? 'border-emerald-500/40 bg-emerald-500/10'
                              : 'border-[var(--glass-border)] glass-1'
                          }`}
                        >
                          <p className="font-mono text-[8px] text-[var(--text-muted)]">{slot.startTime}–{slot.endTime}</p>
                          <p className="text-[10px] font-bold leading-tight mt-0.5 text-[var(--text-primary)] truncate">{slot.subject}</p>
                          {isCurrent && (
                            <span className="text-[8px] font-mono text-emerald-500 font-bold">● NOW</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
