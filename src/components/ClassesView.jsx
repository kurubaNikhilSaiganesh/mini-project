import { useState, useContext } from 'react';
import { CLASSES, getFacultyById, getRoomById } from '../data';
import { AppContext } from '../App';

export default function ClassesView() {
  const { locateOnMap } = useContext(AppContext);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const selectedClass = selectedClassId ? CLASSES.find((c) => c.id === selectedClassId) : null;

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[var(--navigo-yellow)] uppercase tracking-widest mb-2">
          [CLASS_DIRECTORY]
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">
          Classes.
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {CLASSES.length} classes across {[...new Set(CLASSES.map((c) => c.department))].length} departments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class list */}
        <div className="lg:col-span-1 space-y-2">
          {CLASSES.map((cls) => {
            const isSelected = selectedClassId === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(isSelected ? null : cls.id)}
                className={`w-full text-left p-4 border-2 transition-all ${
                  isSelected
                    ? 'border-[var(--navigo-yellow)] bg-[var(--navigo-yellow)]/10 shadow-[4px_4px_0_#111111]'
                    : 'border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-[#111111] hover:shadow-brutal'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 ${
                    isSelected ? 'bg-[var(--navigo-yellow)] text-[#111111]' : 'bg-[#F3F3F3] dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-400'
                  }`}>
                    {cls.shortName}
                  </span>
                  <span className="font-mono text-[9px] text-gray-400">YEAR {cls.year}</span>
                </div>
                <p className="font-bold text-sm">{cls.name}</p>
                <p className="font-mono text-[10px] text-gray-500 mt-1">{cls.department}</p>
                <p className="font-mono text-[9px] text-gray-400 mt-1">{cls.strength} students</p>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {!selectedClass ? (
            <div className="border-2 border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] h-full min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <svg className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p className="font-mono text-xs uppercase tracking-wider text-gray-400">
                  SELECT A CLASS TO VIEW DETAILS
                </p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-[#111111] dark:border-[#333333] bg-white dark:bg-[#141414]">
              {/* Class header */}
              <div className="p-6 border-b-2 border-[#111111] dark:border-[#333333] bg-[var(--navigo-yellow)]/10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                      {selectedClass.department}
                    </p>
                    <h2 className="font-display text-2xl font-bold uppercase">{selectedClass.name}</h2>
                    <p className="text-sm text-gray-500 mt-2">{selectedClass.description}</p>
                  </div>
                  <span className="font-mono text-xs bg-[var(--navigo-yellow)] text-[#111111] font-bold px-3 py-1 shrink-0">
                    {selectedClass.shortName}
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Stats */}
                <div className="space-y-4">
                  <div>
                    <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider mb-1">Year / Section</p>
                    <p className="font-bold">Year {selectedClass.year} — Section {selectedClass.section}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider mb-1">Class Strength</p>
                    <p className="font-bold">{selectedClass.strength} students</p>
                  </div>

                  {/* Room */}
                  {selectedClass.roomId && (() => {
                    const room = getRoomById(selectedClass.roomId);
                    if (!room) return null;
                    return (
                      <div>
                        <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider mb-1">Assigned Room</p>
                        <div className="flex items-center justify-between border-2 border-[#E5E7EB] dark:border-[#2A2A2A] p-3">
                          <div>
                            <p className="font-bold font-mono">{room.number}</p>
                            <p className="text-xs text-gray-500">{room.building} · {room.floor} Floor · {room.type}</p>
                          </div>
                          <button
                            onClick={() => locateOnMap(room.buildingId)}
                            className="btn-green text-xs py-1.5 px-3"
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
                  <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider mb-3">Faculty</p>
                  <div className="space-y-3">
                    {selectedClass.facultyIds?.map((fid) => {
                      const faculty = getFacultyById(fid);
                      if (!faculty) return null;
                      return (
                        <div key={fid} className="flex items-center gap-3 border-2 border-[#E5E7EB] dark:border-[#2A2A2A] p-3">
                          <div
                            className="w-8 h-8 flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                            style={{ background: 'var(--navigo-green)' }}
                          >
                            {faculty.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{faculty.name}</p>
                            <p className="font-mono text-[9px] text-gray-500 truncate uppercase">{faculty.designation}</p>
                          </div>
                          <button
                            onClick={() => locateOnMap(faculty.buildingId)}
                            className="shrink-0 text-xs font-mono text-[var(--navigo-yellow)] hover:underline"
                          >
                            Office →
                          </button>
                        </div>
                      );
                    })}
                    {(!selectedClass.facultyIds || selectedClass.facultyIds.length === 0) && (
                      <p className="font-mono text-xs text-gray-400">DATA NOT AVAILABLE</p>
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
