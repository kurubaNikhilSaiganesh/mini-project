// ExamsView — MID and SEM exam schedules

import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { EXAMS, getDaysUntilExam, SESSIONS } from '../data/exams';
import { GlassTabs } from './ui/GlassTabs';
import { GlassBadge } from './ui/GlassBadge';

const TABS = [
  { id: 'all',  label: 'All Exams' },
  { id: 'MID',  label: 'Mid Term' },
  { id: 'SEM',  label: 'Semester' },
];

function SessionBadge({ session }) {
  const s = SESSIONS[session];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
      style={{
        background: session === 'FN' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(245, 158, 11, 0.12)',
        color: session === 'FN' ? 'var(--blue)' : '#D97706',
        border: `1px solid ${session === 'FN' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)'}`,
      }}
    >
      {session} · {s?.label}
    </span>
  );
}

function ExamScheduleRow({ item }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 px-4 rounded-md transition-colors"
      style={{ borderBottom: '1px solid var(--glass-border)' }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="text-center shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded-lg"
          style={{ background: 'rgba(245, 158, 11, 0.12)' }}
        >
          <p className="font-mono font-bold text-base leading-none" style={{ color: '#D97706' }}>
            {new Date(item.date).getDate()}
          </p>
          <p className="font-mono text-[8px] uppercase tracking-wide" style={{ color: '#D97706' }}>
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
          </p>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
            {item.subjectName}
          </p>
          <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {item.subjectCode} · {item.branch} {item.section && `· Sec ${item.section}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <SessionBadge session={item.session} />
        <span
          className="text-xs px-2 py-0.5 rounded font-mono"
          style={{ background: 'var(--glass-1)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}
        >
          {item.examHall}
        </span>
      </div>
    </div>
  );
}

function ExamCard({ exam, onFindSeat }) {
  const daysUntil = getDaysUntilExam(exam);
  const isUpcoming = daysUntil > 0;
  const isOngoing  = exam.status === 'ONGOING' || (daysUntil <= 0 && exam.status !== 'COMPLETED');
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'var(--glass-1)',
        backdropFilter: 'var(--blur-md)',
        WebkitBackdropFilter: 'var(--blur-md)',
        border: isOngoing ? '1px solid rgba(8, 127, 69, 0.3)' : '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-sm)',
        isolation: 'isolate',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {/* Exam header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GlassBadge variant="gold">{exam.type}</GlassBadge>
              <GlassBadge variant={isOngoing ? 'green' : isUpcoming ? 'gold' : 'gray'}>
                {isOngoing ? 'Ongoing' : isUpcoming ? `In ${daysUntil}d` : 'Completed'}
              </GlassBadge>
            </div>
            <h3
              className="font-display font-bold text-lg md:text-xl leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {exam.name}
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {exam.startDate} — {exam.endDate} · Semester {exam.semester}
            </p>
          </div>

          {/* Countdown */}
          {isUpcoming && (
            <div
              className="text-center px-4 py-2 rounded-lg shrink-0"
              style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)' }}
            >
              <p className="font-display font-black text-2xl leading-none" style={{ color: '#D97706' }}>
                {daysUntil}
              </p>
              <p className="font-mono text-[8px] uppercase tracking-wider mt-0.5" style={{ color: '#D97706' }}>
                days
              </p>
            </div>
          )}
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {exam.description}
        </p>

        {/* Branches */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {exam.branches.map((b) => (
            <span
              key={b}
              className="font-mono text-[10px] px-2 py-0.5 rounded uppercase"
              style={{ background: 'var(--glass-1)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}
            >
              {b}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onFindSeat}
            className="glass-btn glass-btn-primary glass-btn-sm rounded-full flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Find My Seat
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="glass-btn glass-btn-ghost glass-btn-sm"
          >
            {expanded ? 'Hide' : 'View'} Schedule
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable schedule */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--glass-border)' }}>
          <div className="px-4 py-2">
            <p className="font-mono text-[9px] uppercase tracking-widest mb-0" style={{ color: 'var(--text-muted)' }}>
              Detailed Schedule
            </p>
          </div>
          <div>
            {exam.schedule.map((item, idx) => (
              <ExamScheduleRow key={idx} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExamsView() {
  const { navigateTo } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? EXAMS
    : EXAMS.filter((e) => e.type === activeTab);

  return (
    <div className="px-3 sm:px-4 md:px-8 py-6 sm:py-8 max-w-4xl mx-auto page-enter w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>
          [EXAM_SYS]
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          Examinations.
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <GlassTabs
          tabs={TABS.map((t) => ({
            ...t,
            count: t.id === 'all' ? EXAMS.length : EXAMS.filter((e) => e.type === t.id).length,
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Quick seating shortcut */}
      <div
        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 rounded-2xl backdrop-blur-md"
        style={{ 
          background: 'rgba(245, 158, 11, 0.08)', 
          border: '1px solid rgba(245, 158, 11, 0.2)', 
          boxShadow: 'none',
          isolation: 'isolate',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0" style={{ background: '#F59E0B' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Exam Seating Lookup</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Find your exam hall and seat number</p>
          </div>
        </div>
        <button
          onClick={() => navigateTo('seating')}
          className="glass-btn glass-btn-sm rounded-full shrink-0 font-bold text-white w-full sm:w-auto"
          style={{ background: '#F59E0B', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}
        >
          Find My Seat
        </button>
      </div>

      {/* Exam cards */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
              No {activeTab === 'all' ? '' : activeTab} exams scheduled yet.
            </p>
          </div>
        ) : (
          filtered.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onFindSeat={() => navigateTo('seating')}
            />
          ))
        )}
      </div>
    </div>
  );
}

