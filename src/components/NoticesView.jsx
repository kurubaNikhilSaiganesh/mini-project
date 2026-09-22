// NoticesView — campus notice board (admin-created announcements)

import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { GlassBadge } from './ui/GlassBadge';

const SEVERITY_CONFIG = {
  ALERT:     { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   badge: 'red',  icon: '⚠' },
  NOTICE:    { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  badge: 'blue', icon: '📢' },
  DEADLINE:  { color: '#F97316', bg: 'rgba(249,115,22,0.08)',  badge: 'gold', icon: '📅' },
  UPDATE:    { color: '#087F45', bg: 'rgba(8,127,69,0.08)',    badge: 'green',icon: '✅' },
  EMERGENCY: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   badge: 'red',  icon: '🚨' },
};

const DEFAULT_NOTICES = [
  {
    id: 'n_default_1',
    text: 'Mid Examination 1 date sheet has been released. Check the Exams section for the full schedule.',
    severity: 'NOTICE',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'n_default_2',
    text: 'Last date for internal marks correction: 30 September 2026. Contact your respective department.',
    severity: 'DEADLINE',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'n_default_3',
    text: 'Library will remain closed on 25 September 2026 for maintenance.',
    severity: 'ALERT',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

function NoticeCard({ notice }) {
  const cfg = SEVERITY_CONFIG[notice.severity] || SEVERITY_CONFIG.NOTICE;
  const date = new Date(notice.timestamp).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const time = new Date(notice.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div
      className="glass-card overflow-hidden"
      style={{ borderLeft: `3px solid ${cfg.color}` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{cfg.icon}</span>
            <GlassBadge variant={cfg.badge}>{notice.severity}</GlassBadge>
          </div>
          <span className="font-mono text-[9px] shrink-0" style={{ color: 'var(--text-subtle)' }}>
            {date} · {time}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {notice.text}
        </p>
      </div>
    </div>
  );
}

export default function NoticesView() {
  const { announcements } = useContext(AppContext);

  // Merge admin announcements with default notices, admin ones on top
  const all = [
    ...(announcements || []).map((a) => ({
      id: a.id || `ann_${a.timestamp}`,
      text: a.text,
      severity: a.severity,
      timestamp: a.timestamp || new Date().toISOString(),
    })),
    ...DEFAULT_NOTICES,
  ];

  return (
    <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>
          [NOTICES_SYS]
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          Notices.
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Campus announcements and important updates.
        </p>
      </div>

      {/* Severity legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
          <span
            key={key}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}
          >
            {cfg.icon} {key}
          </span>
        ))}
      </div>

      {/* Notice cards */}
      <div className="space-y-4">
        {all.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
              No notices at this time.
            </p>
          </div>
        ) : (
          all.map((n) => <NoticeCard key={n.id} notice={n} />)
        )}
      </div>
    </div>
  );
}

