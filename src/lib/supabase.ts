import { createClient } from '@supabase/supabase-js';

// Get Supabase URL safely from Vite or Node/Vercel env
let rawUrl = (import.meta.env?.VITE_SUPABASE_URL || '').trim();
let rawKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY || '').trim();

if (!rawUrl && typeof process !== 'undefined' && process?.env) {
  rawUrl = (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
}
if (!rawKey && typeof process !== 'undefined' && process?.env) {
  rawKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
}

// Validate URL syntax to prevent ERR_INVALID_URL / TypeError
let safeUrl = 'https://placeholder.supabase.co';
if (rawUrl && rawUrl !== '""' && rawUrl !== "''") {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      safeUrl = rawUrl;
    }
  } catch (_) {
    safeUrl = 'https://placeholder.supabase.co';
  }
}

let safeKey = rawKey && rawKey !== '""' && rawKey !== "''" 
  ? rawKey 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const isSupabaseConfigured = Boolean(
  safeUrl !== 'https://placeholder.supabase.co' &&
  safeKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'
);

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type SupabaseClient = typeof supabase;


