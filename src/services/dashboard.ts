/**
 * Dashboard service — fetches KPI metrics and chart data directly from Supabase.
 *
 * Answered  = call_logs rows where call_ended_at IS NOT NULL AND duration_seconds > 0
 * Missed    = call_logs rows where call_ended_at IS NULL  OR  duration_seconds = 0
 * Voicemails = voicemails table row count
 */

import { supabase } from "@/lib/supabase";

/* ── Shared types ─────────────────────────────────────────────────────────── */

export interface DayMetric {
  day: string;
  calls: number;
  answered: number;
}

export interface AdminMetrics {
  kpi: {
    total: number;
    answered: number;
    missed: number;
    voicemails: number;
  };
  weekly: DayMetric[];
}

export interface RadarMetric {
  subject: string;
  A: number;
}

export interface StaffMetrics {
  summary: {
    total: number;
    resolved: number;
    in_progress: number;
    new: number;
    score: number;
  };
  radar: RadarMetric[];
}

export interface VoicemailEntry {
  id: string;
  received_at: string;
  duration_seconds: number;
  summary: string | null;
  transcript_status: string;
  summary_status: string;
}

/* ── Empty / fallback states ──────────────────────────────────────────────── */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EMPTY_ADMIN: AdminMetrics = {
  kpi: { total: 0, answered: 0, missed: 0, voicemails: 0 },
  weekly: DAYS.map((day) => ({ day, calls: 0, answered: 0 })),
};

const EMPTY_STAFF: StaffMetrics = {
  summary: { total: 0, resolved: 0, in_progress: 0, new: 0, score: 0 },
  radar: [
    { subject: "Response Time", A: 0 },
    { subject: "Task Completion", A: 0 },
    { subject: "Follow-ups", A: 0 },
    { subject: "Notes Quality", A: 0 },
    { subject: "Punctuality", A: 0 },
  ],
};

/* ── Admin metrics (KPIs + weekly chart) ──────────────────────────────────── */

export async function getAdminMetrics(): Promise<AdminMetrics> {
  if (!supabase) {
    console.warn("[Dashboard] Supabase not configured, using empty state.");
    return EMPTY_ADMIN;
  }

  console.log("[Dashboard] supabase client is ready, running queries...");

  try {
    // ── KPI counts ────────────────────────────────────────────────────────
    const [
      { count: total, error: e1 },
      { count: answered, error: e2 },
      { count: voicemails, error: e3 },
    ] = await Promise.all([
      supabase.from("call_logs").select("*", { count: "exact", head: true }),
      supabase
        .from("call_logs")
        .select("*", { count: "exact", head: true })
        .not("call_ended_at", "is", null)
        .gt("duration_seconds", 0),
      supabase.from("voicemails").select("*", { count: "exact", head: true }),
    ]);

    console.log("[Dashboard] RAW query results:", {
      total, e1,
      answered, e2,
      voicemails, e3,
    });

    const totalCount = total ?? 0;
    const answeredCount = answered ?? 0;
    const missedCount = Math.max(0, totalCount - answeredCount);
    const voicemailCount = voicemails ?? 0;

    // ── Weekly chart data (last 7 days) ───────────────────────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: recentCalls } = await supabase
      .from("call_logs")
      .select("call_started_at, call_ended_at, duration_seconds")
      .gte("call_started_at", sevenDaysAgo.toISOString());

    // Build a slot for each of the last 7 days
    const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekly = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        day: DAY_LABELS[d.getDay()],
        dateStr: d.toDateString(),
        calls: 0,
        answered: 0,
      };
    });

    (recentCalls ?? []).forEach((call) => {
      const slot = weekly.find(
        (w) => w.dateStr === new Date(call.call_started_at).toDateString()
      );
      if (!slot) return;
      slot.calls += 1;
      if (call.call_ended_at && (call.duration_seconds ?? 0) > 0) {
        slot.answered += 1;
      }
    });

    return {
      kpi: {
        total: totalCount,
        answered: answeredCount,
        missed: missedCount,
        voicemails: voicemailCount,
      },
      weekly: weekly.map(({ day, calls, answered }) => ({ day, calls, answered })),
    };
  } catch (err) {
    console.warn("[Dashboard] admin metrics unavailable, using empty state.", err);
    return EMPTY_ADMIN;
  }
}

/* ── Recent voicemails list ───────────────────────────────────────────────── */

export async function getRecentVoicemails(limit = 10): Promise<VoicemailEntry[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("voicemails")
      .select("id, received_at, duration_seconds, summary, transcript_status, summary_status")
      .order("received_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn("[Dashboard] voicemails unavailable.", err);
    return [];
  }
}

/* ── Staff metrics ────────────────────────────────────────────────────────── */

export async function getStaffMetrics(): Promise<StaffMetrics> {
  // Staff metrics are not yet sourced from Supabase — return empty state.
  return EMPTY_STAFF;
}
