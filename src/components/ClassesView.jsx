import { useState, useContext } from 'react';
import { CLASSES, getFacultyById, getRoomById } from '../data';
import { AppContext } from '../context/AppContext';

export default function ClassesView() {
  const { locateOnMap } = useContext(AppContext);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const selectedClass = selectedClassId ? CLASSES.find((c) => c.id === selectedClassId) : null;

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[var(--gold)] uppercase tracking-widest mb-2 font-semibold">
          [CLASS_DIRECTORY]
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          Classes.
        </h1>
        <p className="text-[var(--text-muted)] text-sm mt-2">
          {CLASSES.length} classes across {[...new Set(CLASSES.map((c) => c.department))].length} departments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class list */}
        <div className="lg:col-span-1 space-y-2.5">
          {CLASSES.map((cls) => {
            const isSelected = selectedClassId === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(isSelected ? null : cls.id)}
                className={`w-full text-left p-4.5 rounded-2xl glass-card border transition-all duration-200 select-none ${
                  isSelected
                    ? 'border-[var(--gold)] bg-[var(--gold)]/10 shadow-sm scale-[1.01]'
                    : 'border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] hover:bg-[var(--glass-2)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-[var(--gold)] text-[#111111] border-[var(--gold)]'
                        : 'bg-[var(--glass-2)] text-[var(--text-primary)] border-[var(--glass-border)]'
                    }`}
                  >
                    {cls.shortName}
                  </span>
                  <span className="font-mono text-[9px] text-[var(--text-muted)] font-semibold">YEAR {cls.year}</span>
                </div>
                <p className="font-bold text-sm text-[var(--text-primary)]">{cls.name}</p>
                <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">{cls.department}</p>
                <p className="font-mono text-[9px] text-[var(--text-subtle)] mt-1">{cls.strength} students</p>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {!selectedClass ? (
            <div className="rounded-3xl glass-card border border-dashed border-[var(--glass-border-strong)] h-full min-h-[300px] flex items-center justify-center p-8">
              <div className="text-center">
                <svg className="w-10 h-10 text-[var(--text-subtle)] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  SELECT A CLASS TO VIEW DETAILS
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl glass-card overflow-hidden border border-[var(--glass-border)] shadow-xl">
              {/* Class header */}
              <div className="p-6 border-b border-[var(--glass-border)] bg-[var(--glass-2)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1 font-semibold">
                      {selectedClass.department}
                    </p>
                    <h2 className="font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
                      {selectedClass.name}
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-2">{selectedClass.description}</p>
                  </div>
                  <span className="font-mono text-xs bg-[var(--gold)] text-[#111111] font-bold px-3 py-1 rounded-full shrink-0 shadow-sm">
                    {selectedClass.shortName}
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Stats */}
                <div className="space-y-4">
                  <div className="rounded-2xl glass-card p-4 border border-[var(--glass-border)]">
                    <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-1 font-semibold">Year / Section</p>
                    <p className="font-bold text-[var(--text-primary)]">Year {selectedClass.year} — Section {selectedClass.section}</p>
                  </div>
                  <div className="rounded-2xl glass-card p-4 border border-[var(--glass-border)]">
                    <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-1 font-semibold">Class Strength</p>
                    <p className="font-bold text-[var(--text-primary)]">{selectedClass.strength} students</p>
                  </div>

                  {/* Room */}
                  {selectedClass.roomId && (() => {
                    const room = getRoomById(selectedClass.roomId);
                    if (!room) return null;
                    return (
                      <div>
                        <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5 font-semibold">Assigned Room</p>
                        <div className="flex items-center justify-between rounded-2xl glass-card p-4 border border-[var(--glass-border)]">
                          <div>
                            <p className="font-bold font-mono text-[var(--text-primary)] text-sm">{room.number}</p>
                            <p className="text-xs text-[var(--text-muted)]">{room.building} · {room.floor} Floor · {room.type}</p>
                          </div>
                          <button
                            onClick={() => locateOnMap(room.buildingId)}
                            className="glass-btn glass-btn-primary rounded-full text-xs py-1.5 px-3 font-bold"
                          >
                            Locate
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Faculty */}
                <div>
                  <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-semibold">Faculty</p>
                  <div className="space-y-2.5">
                    {selectedClass.facultyIds?.map((fid) => {
                      const faculty = getFacultyById(fid);
                      if (!faculty) return null;
                      return (
                        <div key={fid} className="flex items-center gap-3 rounded-2xl glass-card p-3 border border-[var(--glass-border)]">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                            style={{ background: 'var(--green)' }}
                          >
                            {faculty.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[var(--text-primary)] truncate">{faculty.name}</p>
                            <p className="font-mono text-[9px] text-[var(--text-muted)] truncate uppercase">{faculty.designation}</p>
                          </div>
                          <button
                            onClick={() => locateOnMap(faculty.buildingId)}
                            className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full glass-btn glass-btn-ghost text-[var(--gold)] hover:bg-[var(--gold-light)]"
                          >
                            Office →
                          </button>
                        </div>
                      );
                    })}
                    {(!selectedClass.facultyIds || selectedClass.facultyIds.length === 0) && (
                      <p className="font-mono text-xs text-[var(--text-muted)]">DATA NOT AVAILABLE</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
