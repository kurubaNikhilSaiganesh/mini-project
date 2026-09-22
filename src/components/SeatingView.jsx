// SeatingView — exam seating lookup by registration number

import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { findSeatingByRegNumber, ROOM_LAYOUTS } from '../data/seating';
import { EXAMS, SESSIONS } from '../data/exams';
import QRScanner from './QRScanner';
import { GlassInput, GlassSelect } from './ui/GlassInput';
import { GlassButton } from './ui/GlassButton';
import { GlassBadge } from './ui/GlassBadge';

function SeatGrid({ layout, targetRow, targetBench, targetSeat }) {
  if (!layout) return null;
  const { rows, benches, seatsPerBench, label } = layout;

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
        {label} — Seating Grid
      </p>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border)', minWidth: 300 }}>
          {/* Board / Front */}
          <div
            className="text-center py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest mb-2"
            style={{ background: 'var(--glass-2)', color: 'var(--text-muted)' }}
          >
            ▲ Front / Board
          </div>

          {Array.from({ length: rows }, (_, rowIdx) => {
            const rowNum = rowIdx + 1;
            return (
              <div key={rowNum} className="flex items-center gap-2">
                <span className="font-mono text-[9px] w-8 shrink-0 text-right" style={{ color: 'var(--text-subtle)' }}>
                  R{rowNum}
                </span>
                <div className="flex gap-3">
                  {Array.from({ length: benches }, (_, benchIdx) => {
                    const benchNum = benchIdx + 1;
                    return (
                      <div key={benchNum} className="flex gap-1">
                        {Array.from({ length: seatsPerBench }, (_, seatIdx) => {
                          const seatNum = seatIdx + 1;
                          const isTarget = rowNum === targetRow && benchNum === targetBench && seatNum === targetSeat;
                          return (
                            <div
                              key={seatNum}
                              className="w-7 h-7 flex items-center justify-center rounded text-[9px] font-mono font-bold transition-all"
                              style={{
                                background: isTarget ? 'var(--gold)' : 'var(--glass-2)',
                                color: isTarget ? '#111' : 'var(--text-muted)',
                                border: isTarget ? '2px solid var(--gold-hover)' : '1px solid var(--glass-border)',
                                transform: isTarget ? 'scale(1.2)' : 'scale(1)',
                                boxShadow: isTarget ? 'var(--shadow-gold)' : 'none',
                              }}
                              title={`Row ${rowNum}, Bench ${benchNum}, Seat ${seatNum}`}
                            >
                              {isTarget ? '★' : seatNum}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p className="text-[9px] font-mono text-center mt-2" style={{ color: 'var(--gold)' }}>
            ★ = Your Seat
          </p>
        </div>
      </div>
    </div>
  );
}

function SeatingResult({ result }) {
  const session = SESSIONS[result.session];
  const layout = ROOM_LAYOUTS[result.roomNumber];

  const infoRows = [
    { label: 'Examination',   value: result.examName },
    { label: 'Subject',       value: `${result.subjectCode} · ${result.subjectName}` },
    { label: 'Date',          value: new Date(result.examDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: 'Session',       value: session ? `${session.label} (${result.session}) · ${session.startTime} – ${session.endTime}` : result.session },
    { label: 'Building',      value: result.buildingName },
    { label: 'Room',          value: result.roomNumber },
    { label: 'Floor',         value: result.floor },
    { label: 'Seat Position', value: `Row ${result.row} · Bench ${result.bench} · Seat ${result.seat}` },
  ];

  return (
    <div className="space-y-5">
      {/* Result card */}
      <div
        className="glass-card overflow-hidden"
        style={{ border: '1px solid var(--glass-border-strong)' }}
      >
        {/* Gold header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: 'var(--gold-light)', borderBottom: '1px solid rgba(244,180,0,0.2)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Seat Confirmed</p>
              <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {result.registrationNumber}
              </p>
            </div>
          </div>
          <GlassBadge variant="green">Found</GlassBadge>
        </div>

        {/* Info table */}
        <div className="p-5 space-y-3">
          {infoRows.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-wider shrink-0" style={{ color: 'var(--text-muted)' }}>
                {label}
              </span>
              <span className="text-sm font-medium text-right" style={{ color: 'var(--text-primary)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Seat grid */}
      {layout && (
        <div className="glass-card p-5">
          <SeatGrid
            layout={layout}
            targetRow={result.row}
            targetBench={result.bench}
            targetSeat={result.seat}
          />
        </div>
      )}
    </div>
  );
}

export default function SeatingView() {
  const { navigateTo } = useContext(AppContext);
  const [regNo, setRegNo] = useState('');
  const [examId, setExamId] = useState('');
  const [results, setResults] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleSearch = () => {
    if (!regNo.trim()) return;
    setLoading(true);
    setResults(null);
    setNotFound(false);

    // Simulate async (will be real async with Supabase)
    setTimeout(() => {
      const found = findSeatingByRegNumber(regNo, examId || null);
      setLoading(false);
      if (found.length > 0) {
        setResults(found);
      } else {
        setNotFound(true);
      }
    }, 400);
  };

  const handleQRResult = ({ regNumber, examId: scannedExamId }) => {
    setRegNo(regNumber);
    if (scannedExamId) setExamId(scannedExamId);
    setShowScanner(false);
    // Auto-search
    const found = findSeatingByRegNumber(regNumber, scannedExamId || null);
    if (found.length > 0) setResults(found);
    else setNotFound(true);
  };

  const handleReset = () => {
    setRegNo('');
    setExamId('');
    setResults(null);
    setNotFound(false);
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-2xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>
          [SEATING_SYS]
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          Exam Seating.
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Enter your registration number to find your exam hall and seat.
        </p>
      </div>

      {/* Lookup form */}
      {!results && (
        <div className="glass-card p-6 mb-6">
          <div className="space-y-4">
            <GlassInput
              id="reg-number"
              label="Registration Number"
              placeholder="e.g. 23CS1042"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              autoCapitalize="characters"
              autoFocus
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
              }
            />

            <GlassSelect
              id="exam-filter"
              label="Filter by Exam (optional)"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
            >
              <option value="">All upcoming exams</option>
              {EXAMS.map((e) => (
                <option key={e.id} value={e.id}>{e.type} — {e.name}</option>
              ))}
            </GlassSelect>

            <div className="flex gap-3">
              <GlassButton
                variant="primary"
                onClick={handleSearch}
                loading={loading}
                disabled={!regNo.trim()}
                className="flex-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                Find My Seat
              </GlassButton>

              <GlassButton
                variant="ghost"
                onClick={() => setShowScanner(true)}
                title="Scan QR code"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z"/>
                </svg>
                Scan QR
              </GlassButton>
            </div>
          </div>

          {/* Try demo */}
          <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-subtle)' }}>
            Try demo: <button
              className="font-mono underline hover:opacity-70"
              style={{ color: 'var(--gold)' }}
              onClick={() => { setRegNo('23CS1042'); }}
            >
              23CS1042
            </button>
          </p>
        </div>
      )}

      {/* Not found */}
      {notFound && (
        <div className="glass-card p-8 text-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--red-light)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No seating found</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            No seat allocation found for <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{regNo}</span>
          </p>
          <GlassButton variant="ghost" onClick={handleReset}>Try another number</GlassButton>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {results.map((r) => (
            <SeatingResult key={r.id} result={r} />
          ))}
          <div className="flex gap-3">
            <GlassButton variant="ghost" onClick={handleReset}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
              </svg>
              New Search
            </GlassButton>
            <GlassButton variant="ghost" onClick={() => navigateTo('exams')}>
              View All Exams
            </GlassButton>
          </div>
        </div>
      )}

      {/* QR Scanner */}
      {showScanner && (
        <QRScanner
          onResult={handleQRResult}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

