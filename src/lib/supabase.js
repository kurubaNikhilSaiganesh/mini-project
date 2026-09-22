// ================================================================
// ALTS — SUPABASE CLIENT
// Only initialised when VITE_SUPABASE_URL is present in environment.
// The app works completely without Supabase using local data.
// ================================================================

let supabase = null;

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (isSupabaseConfigured) {
  // Dynamically import to avoid bundling Supabase when not needed
  // Install: npm install @supabase/supabase-js
  import('@supabase/supabase-js')
    .then(({ createClient }) => {
      supabase = createClient(supabaseUrl, supabaseKey);
    })
    .catch(() => {
      console.warn('[ALTS] Supabase client could not be initialised.');
    });
}

export function getSupabaseClient() {
  return supabase;
}

export default supabase;
