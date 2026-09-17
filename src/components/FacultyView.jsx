import { useState, useContext } from 'react';
import { FACULTY, getClassById } from '../data';
import { AppContext } from '../App';

const DEPARTMENTS = [...new Set(FACULTY.map((f) => f.department))];

export default function FacultyView() {
  const { locateOnMap } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDept, setActiveDept] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = FACULTY.filter((f) => {
    const matchesDept = activeDept === 'all' || f.department === activeDept;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q) ||
      f.subjects.some((s) => s.toLowerCase().includes(q));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[var(--navigo-yellow)] uppercase tracking-widest mb-2">
          [FACULTY_DIRECTORY]
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">
          Faculty.
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {FACULTY.length} faculty members across {DEPARTMENTS.length} departments.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, subject, or designation..."
            className="input-field pl-12"
          />
        </div>
      </div>

      {/* Department filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveDept('all')}
          className={`text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 transition-all ${
            activeDept === 'all'
              ? 'border-[#111111] bg-[var(--navigo-yellow)] text-[#111111]'
              : 'border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-600 dark:text-gray-400 hover:border-[#111111] dark:hover:border-white'
          }`}
        >
          All
        </button>
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 transition-all ${
              activeDept === dept
                ? 'border-[#111111] bg-[var(--navigo-yellow)] text-[#111111]'
                : 'border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-600 dark:text-gray-400 hover:border-[#111111] dark:hover:border-white'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Faculty grid */}
      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] p-12 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-gray-400">NO RESULTS FOUND</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((faculty) => {
            const isExpanded = expanded === faculty.id;
            const assignedClasses = faculty.classIds?.map((cid) => getClassById(cid)).filter(Boolean) || [];

            return (
              <div
                key={faculty.id}
                className={`border-2 bg-white dark:bg-[#141414] transition-all ${
                  isExpanded
                    ? 'border-[var(--navigo-yellow)] shadow-[4px_4px_0_#111111]'
                    : 'border-[#E5E7EB] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white hover:shadow-brutal'
                }`}
              >
                {/* Card header — always visible */}
                <button
                  className="w-full text-left p-5 flex items-start gap-4"
                  onClick={() => setExpanded(isExpanded ? null : faculty.id)}
                  aria-expanded={isExpanded}
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: isExpanded ? 'var(--navigo-yellow)' : 'var(--navigo-green)', color: isExpanded ? '#111111' : '#FFFFFF' }}
                  >
                    {faculty.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base leading-tight">{faculty.name}</h3>
                        <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                          {faculty.designation}
                        </p>
                      </div>
                      <span className={`font-mono text-[9px] px-2 py-1 shrink-0 ${
                        isExpanded
                          ? 'bg-[var(--navigo-yellow)] text-[#111111]'
                          : 'bg-[#F3F3F3] dark:bg-[#2A2A2A] text-gray-500'
                      }`}>
                        {faculty.department.split(' ')[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Subjects */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {faculty.subjects.map((s) => (
                        <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 border border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    style={{ marginTop: 2 }}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t-2 border-[#E5E7EB] dark:border-[#2A2A2A] pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">Office</p>
                        <p className="text-sm font-medium mt-0.5">{faculty.office}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-medium mt-0.5 font-mono">{faculty.phone}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">Email</p>
                      <a href={`mailto:${faculty.email}`} className="text-sm font-mono text-[var(--accent-blue)] hover:underline mt-0.5 block">
                        {faculty.email}
                      </a>
                    </div>

                    {assignedClasses.length > 0 && (
                      <div>
                        <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider mb-2">Assigned Classes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {assignedClasses.map((cls) => (
                            <span key={cls.id} className="font-mono text-[9px] px-2 py-1 bg-[var(--navigo-yellow)]/20 border border-[var(--navigo-yellow)] text-[#111111] dark:text-white">
                              {cls.shortName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => locateOnMap(faculty.buildingId)}
                        className="btn-green text-xs py-2 px-4 flex-1"
                      >
                        Find Office →
                      </button>
                      <a
                        href={`mailto:${faculty.email}`}
                        className="btn-secondary text-xs py-2 px-4"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
