import { useState, useContext } from 'react';
import { FACULTY, getClassById } from '../data';
import { AppContext } from '../context/AppContext';
import { Search, Mail, MapPin, ChevronDown } from 'lucide-react';

const DEPARTMENTS = [...new Set(FACULTY.map((f) => f.department))];

// Deterministic avatar gradient per faculty
const GRAD_PALETTE = [
  'from-violet-500 to-indigo-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-pink-400 to-rose-600',
  'from-sky-400 to-blue-600',
  'from-lime-400 to-emerald-500',
];

export default function FacultyView() {
  const { locateOnMap } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDept, setActiveDept]   = useState('all');
  const [expanded, setExpanded]       = useState(null);

  const filtered = FACULTY.filter((f) => {
    const matchesDept  = activeDept === 'all' || f.department === activeDept;
    const q            = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q) ||
      f.subjects.some((s) => s.toLowerCase().includes(q));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto page-enter space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-1 border border-[var(--glass-border)] mb-2">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="font-mono text-[10px] text-violet-400 uppercase tracking-widest font-bold">
            Faculty Directory
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          Faculty.
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          {FACULTY.length} members across {DEPARTMENTS.length} departments.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, subject, or designation…"
          className="glass-select rounded-full py-3 pl-11 pr-5 text-sm w-full"
        />
      </div>

      {/* Department filter pills */}
      <div className="flex flex-wrap gap-2">
        {['all', ...DEPARTMENTS].map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all capitalize ${
              activeDept === dept
                ? 'bg-violet-500 border-violet-500 text-white shadow-sm scale-[1.02]'
                : 'glass-1 border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--glass-border-strong)] hover:text-[var(--text-primary)]'
            }`}
          >
            {dept === 'all' ? 'All Departments' : dept}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs font-mono text-[var(--text-muted)] px-1">
        Showing {filtered.length} of {FACULTY.length} faculty
      </p>

      {/* Faculty grid */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-[var(--glass-border-strong)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
            No results found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((faculty, idx) => {
            const isExpanded     = expanded === faculty.id;
            const assignedClasses = faculty.classIds?.map((cid) => getClassById(cid)).filter(Boolean) || [];
            const grad            = GRAD_PALETTE[idx % GRAD_PALETTE.length];
            const initials        = faculty.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

            return (
              <div
                key={faculty.id}
                className={`glass-card rounded-3xl border transition-all ${
                  isExpanded
                    ? 'border-violet-400/40 shadow-lg'
                    : 'border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] hover:shadow-md'
                }`}
              >
                {/* Card header */}
                <button
                  className="w-full text-left p-5 flex items-start gap-4"
                  onClick={() => setExpanded(isExpanded ? null : faculty.id)}
                  aria-expanded={isExpanded}
                >
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-extrabold text-white shrink-0 bg-gradient-to-br ${grad}`}
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base leading-tight text-[var(--text-primary)]">{faculty.name}</h3>
                        <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
                          {faculty.designation}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[9px] px-2.5 py-1 rounded-full shrink-0 font-bold ${
                          isExpanded
                            ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                            : 'glass-1 border border-[var(--glass-border)] text-[var(--text-muted)]'
                        }`}
                      >
                        {faculty.department.split(' ')[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Subjects */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {faculty.subjects.map((s) => (
                        <span
                          key={s}
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full glass-1 border border-[var(--glass-border)] text-[var(--text-muted)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-[var(--text-muted)] transition-transform mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[var(--glass-border)] pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Office', value: faculty.office },
                        { label: 'Phone', value: faculty.phone, mono: true },
                      ].map(({ label, value, mono }) => (
                        <div key={label}>
                          <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
                          <p className={`text-sm font-medium mt-0.5 text-[var(--text-primary)] ${mono ? 'font-mono' : ''}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Email</p>
                      <a
                        href={`mailto:${faculty.email}`}
                        className="text-sm font-mono text-violet-400 hover:underline"
                      >
                        {faculty.email}
                      </a>
                    </div>

                    {assignedClasses.length > 0 && (
                      <div>
                        <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
                          Assigned Classes
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {assignedClasses.map((cls) => (
                            <span
                              key={cls.id}
                              className="font-mono text-[9px] px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-500 font-bold"
                            >
                              {cls.shortName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => locateOnMap(faculty.buildingId)}
                        className="btn-primary text-xs py-2 px-4 rounded-full flex items-center gap-1.5 flex-1 justify-center"
                      >
                        <MapPin size={12} />
                        Find Office
                      </button>
                      <a
                        href={`mailto:${faculty.email}`}
                        className="glass-btn glass-btn-sm rounded-full px-4 flex items-center gap-1.5 text-xs"
                      >
                        <Mail size={12} />
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
