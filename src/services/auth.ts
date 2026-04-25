/**
 * Auth service — wraps Supabase Auth with a localStorage fallback.
 *
 * RULES:
 *  - signUp()  → creates the Supabase user, does NOT log them in, does NOT
 *                touch localStorage. Caller must redirect to /login.
 *  - signIn()  → authenticates, writes to localStorage, returns AuthUser.
 *  - signOut() → clears Supabase session + localStorage.
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { saveAuth, clearAuth, getAuth, type AuthUser, type UserRole } from "@/utils/auth";

export interface SignInParams {
  email: string;
  password: string;
  role: UserRole;
}

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

export interface SignUpResult {
  error: string | null;
}

/* ── Sign Up ─────────────────────────────────────────────────────────────── */
/**
 * Creates a Supabase account.
 * Does NOT log the user in — they must go to /login after this.
 * Does NOT write to localStorage.
 */
export async function signUp({ email, password, name, role }: SignUpParams): Promise<SignUpResult> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
      },
    });

    if (error) return { error: error.message };
    if (!data.user) return { error: "Sign up failed — no user returned." };

    // Explicitly sign out any session Supabase may have auto-created
    await supabase.auth.signOut();

    return { error: null };
  }

  // ── Fallback: no Supabase configured (local dev without keys) ──
  // Still do NOT log them in — just confirm success.
  return { error: null };
}

/* ── Sign In ─────────────────────────────────────────────────────────────── */
export async function signIn({ email, password, role }: SignInParams): Promise<AuthResult> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: "Sign in failed — no user returned." };

    const name =
      (data.user.user_metadata?.full_name as string | undefined) ??
      (data.user.user_metadata?.name as string | undefined) ??
      email.split("@")[0];

    const authUser: AuthUser = { name, email, role };
    saveAuth(authUser);
    return { user: authUser, error: null };
  }

  // ── Fallback ──
  const name = email.split("@")[0];
  const authUser: AuthUser = { name, email, role };
  saveAuth(authUser);
  return { user: authUser, error: null };
}

/* ── Sign Out ────────────────────────────────────────────────────────────── */
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.auth.signOut();
  }
  clearAuth();
}

/* ── Get current session ─────────────────────────────────────────────────── */
export async function getSession(): Promise<AuthUser | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;

    const existing = getAuth();
    if (existing) return existing;

    const user = data.session.user;
    const name =
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email?.split("@")[0] ??
      "User";
    const role = (user.user_metadata?.role as UserRole | undefined) ?? "employee";
    const email = user.email ?? "";
    const authUser: AuthUser = { name, email, role };
    saveAuth(authUser);
    return authUser;
  }

  return getAuth();
}

/* ── Get JWT for API calls ───────────────────────────────────────────────── */
export async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}


/* ── Google OAuth Sign-In / Sign-Up ───────────────────────────────────────
 *
 * This triggers a redirect to Google. The user will be sent back to
 * /auth/callback where handleGoogleCallback() picks up the session.
 *
 * The `role` param is stored in the OAuth state so we can write it
 * to localStorage after the redirect completes.
 */
export async function signInWithGoogle(role: UserRole = "admin"): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: "Supabase is not configured. Add your .env.local keys." };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  return { error: error?.message ?? null };
}

/* ── Handle the OAuth redirect back from Google ───────────────────────────
 *
 * Call this inside the /auth/callback page.
 * It reads the Supabase session from the URL hash/search params,
 * writes the user to localStorage in the same format as signIn(),
 * and returns the AuthUser so the caller can redirect.
 */
export async function handleGoogleCallback(role: UserRole = "admin"): Promise<AuthResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { user: null, error: "Supabase is not configured." };
  }

  // Supabase automatically exchanges the code in the URL for a session
  // because detectSessionInUrl is true in the client config.
  const { data, error } = await supabase.auth.getSession();

  if (error) return { user: null, error: error.message };
  if (!data.session) return { user: null, error: "No session found after Google sign-in." };

  const supaUser = data.session.user;

  const name =
    (supaUser.user_metadata?.full_name as string | undefined) ??
    (supaUser.user_metadata?.name as string | undefined) ??
    supaUser.email?.split("@")[0] ??
    "User";

  const email = supaUser.email ?? "";

  const authUser: AuthUser = { name, email, role };
  saveAuth(authUser);

  return { user: authUser, error: null };
}
