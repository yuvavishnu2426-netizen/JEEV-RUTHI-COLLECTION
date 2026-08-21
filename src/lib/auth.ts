import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

// ============================================================
// PHONE OTP AUTHENTICATION
// ============================================================

/**
 * Send OTP to phone number via Supabase (uses configured SMS provider)
 * Phone must be in E.164 format: +919876543210
 */
export async function sendPhoneOtp(phone: string): Promise<{ error: string | null }> {
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });

  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Verify phone OTP entered by user
 */
export async function verifyPhoneOtp(
  phone: string,
  token: string
): Promise<{ session: Session | null; error: string | null }> {
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token,
    type: 'sms',
  });

  if (error) {
    return { session: null, error: error.message };
  }
  return { session: data.session, error: null };
}

// ============================================================
// EMAIL OTP AUTHENTICATION
// ============================================================

/**
 * Send magic link / OTP to email address via Supabase
 */
export async function sendEmailOtp(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Verify email OTP token
 */
export async function verifyEmailOtp(
  email: string,
  token: string
): Promise<{ session: Session | null; error: string | null }> {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    return { session: null, error: error.message };
  }
  return { session: data.session, error: null };
}

// ============================================================
// GOOGLE OAUTH
// ============================================================

/**
 * Sign in with Google via OAuth
 */
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

// ============================================================
// SESSION MANAGEMENT
// ============================================================

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Get user profile from profiles table
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Update user profile (e.g. full_name)
 */
export async function updateUserProfile(
  userId: string,
  updates: { full_name?: string; mobile?: string; email?: string }
) {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return { error: error?.message ?? null };
}

/**
 * Check if current user is admin
 */
export async function checkIsAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user || !user.email) return false;

  const allowedAdmins = ['sujithjai007@gmail.com', 'yuvavishnu2426@gmail.com'];
  if (allowedAdmins.includes(user.email.toLowerCase())) {
    return true;
  }

  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .eq('is_active', true)
    .single();

  return !!data;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
