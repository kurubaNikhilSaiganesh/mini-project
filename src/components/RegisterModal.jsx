import { useState, useRef, useEffect } from 'react';

export default function RegisterModal({ event, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', rollNo: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const firstInputRef = useRef(null);

  // Focus trap
  useEffect(() => {
    firstInputRef.current?.focus();
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim())      errs.name    = 'Name is required';
    if (!form.email.trim())     errs.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.rollNo.trim())    errs.rollNo  = 'Roll number is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Register for ${event.title}`}
    >
      <div
        className="modal-content w-full max-w-md border-2 border-[#111111] dark:border-white bg-white dark:bg-[#141414]"
        style={{ boxShadow: '8px 8px 0 #111111' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-[#111111] dark:border-[#333333] flex items-start justify-between">
          <div>
            <p className="font-mono text-[9px] text-[var(--navigo-yellow)] uppercase tracking-widest mb-1">
              EVENT REGISTRATION
            </p>
            <h2 className="font-display text-xl font-bold uppercase leading-tight">{event.title}</h2>
            <p className="font-mono text-[10px] text-gray-500 mt-1">
              {event.date} · {event.time} · {event.venueName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-[#E5E7EB] dark:border-[#2A2A2A] text-gray-500 hover:border-[#111111] hover:text-[#111111] dark:hover:border-white dark:hover:text-white transition-colors shrink-0"
            aria-label="Close modal"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="px-6 py-12 text-center">
            <div
              className="w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-[var(--navigo-green)]"
              style={{ background: 'var(--navigo-green)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold uppercase mb-2">Registered!</h3>
            <p className="text-gray-500 text-sm mb-1">
              <strong>{form.name}</strong>, you&apos;re registered for
            </p>
            <p className="font-bold">{event.title}</p>
            <p className="font-mono text-xs text-gray-400 mt-1">{event.date} · {event.time}</p>
            <p className="font-mono text-[10px] text-gray-400 mt-4">
              Confirmation details will be sent to {form.email}
            </p>
            <button
              onClick={onClose}
              className="btn-primary mt-6 w-full"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} noValidate>
            <div className="px-6 py-5 space-y-4">
              {/* Name */}
              <div>
                <label className="font-mono text-[9px] text-gray-500 uppercase tracking-wider block mb-1.5" htmlFor="reg-name">
                  Full Name *
                </label>
                <input
                  ref={firstInputRef}
                  id="reg-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your full name"
                  className={`input-field ${errors.name ? 'border-[#FF4757]' : ''}`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'reg-name-err' : undefined}
                />
                {errors.name && (
                  <p id="reg-name-err" className="font-mono text-[10px] text-[#FF4757] mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="font-mono text-[9px] text-gray-500 uppercase tracking-wider block mb-1.5" htmlFor="reg-email">
                  Email Address *
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@campus.edu"
                  className={`input-field ${errors.email ? 'border-[#FF4757]' : ''}`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'reg-email-err' : undefined}
                />
                {errors.email && (
                  <p id="reg-email-err" className="font-mono text-[10px] text-[#FF4757] mt-1">{errors.email}</p>
                )}
              </div>

              {/* Roll No */}
              <div>
                <label className="font-mono text-[9px] text-gray-500 uppercase tracking-wider block mb-1.5" htmlFor="reg-roll">
                  Roll Number *
                </label>
                <input
                  id="reg-roll"
                  type="text"
                  value={form.rollNo}
                  onChange={(e) => handleChange('rollNo', e.target.value)}
                  placeholder="e.g. BCA22001"
                  className={`input-field font-mono ${errors.rollNo ? 'border-[#FF4757]' : ''}`}
                  aria-invalid={!!errors.rollNo}
                  aria-describedby={errors.rollNo ? 'reg-roll-err' : undefined}
                />
                {errors.rollNo && (
                  <p id="reg-roll-err" className="font-mono text-[10px] text-[#FF4757] mt-1">{errors.rollNo}</p>
                )}
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="font-mono text-[9px] text-gray-500 uppercase tracking-wider block mb-1.5" htmlFor="reg-phone">
                  Phone (optional)
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Register Now →
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-6"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
