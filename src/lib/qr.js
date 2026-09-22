// ================================================================
// ALTS — QR CODE UTILITIES
// Generate and parse QR codes for exam seating lookup.
// ================================================================

/**
 * Generate a URL-based QR payload for exam seating lookup.
 * The QR code contains a URL — not raw student data.
 * When scanned, opens ALTS and auto-fills the reg number.
 *
 * Format: https://your-site.com/#/seating?reg=23CS1042
 */
export function generateSeatingQRPayload(regNumber, examId = '') {
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set('reg', regNumber.trim().toUpperCase());
  if (examId) params.set('exam', examId);
  return `${base}#/seating?${params.toString()}`;
}

/**
 * Parse QR payload from a scanned URL or raw string.
 * Returns { regNumber, examId } or null if unrecognised.
 */
export function parseQRPayload(raw) {
  if (!raw) return null;

  try {
    // Try parsing as a URL with our seating params
    const url = new URL(raw);
    const params = new URLSearchParams(url.hash.split('?')[1] || url.search);
    const reg = params.get('reg');
    const exam = params.get('exam');
    if (reg) return { regNumber: reg.toUpperCase(), examId: exam || null };
  } catch {
    // Not a URL — try treating as a plain registration number
    const cleaned = raw.trim().replace(/\s+/g, '');
    if (/^[A-Z0-9]{6,15}$/i.test(cleaned)) {
      return { regNumber: cleaned.toUpperCase(), examId: null };
    }
  }
  return null;
}

/**
 * Generate a QR code image Data URL using the 'qrcode' package.
 * Falls back gracefully if qrcode is not installed.
 */
export async function generateQRDataURL(text, options = {}) {
  try {
    const QRCode = (await import('qrcode')).default;
    return await QRCode.toDataURL(text, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0F0F12',
        light: '#FFFFFF',
      },
      ...options,
    });
  } catch {
    console.warn('[ALTS] qrcode package not available. Run: npm install qrcode');
    return null;
  }
}
