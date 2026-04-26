/**
 * audit.ts — reads call_logs directly from Supabase.
 * No backend required.
 *
 * Write operations (assign, priority, status, notes) are not yet
 * stored in Supabase — those columns don't exist in call_logs.
 * They return the refreshed read list so the UI stays consistent.
 */

import { supabase } from "@/lib/supabase";
import {
  type AuditLogEntry,
  type CallStatus,
  formatTimestamp,
} from "@/utils/auditLog";

/* ── Map a raw call_logs row → AuditLogEntry ─────────────────────────────── */
function mapRow(raw: any): AuditLogEntry {
  const durationSec: number = raw.duration_seconds ?? 0;
  const mins = Math.floor(durationSec / 60);
  const secs = durationSec % 60;
  const duration = durationSec > 0 ? `${mins}m ${String(secs).padStart(2, "0")}s` : "—";

  // Derive a simple sentiment from summary text
  const summaryText: string = raw.summary ?? "";
  let sentiment: AuditLogEntry["sentiment"] = "neutral";
  if (/urgent|emergency|asap|immediately/i.test(summaryText)) sentiment = "urgent";
  else if (/thank|great|happy|satisfied|good/i.test(summaryText)) sentiment = "positive";

  // Extract transcript text from conversation JSONB array
  const conversation: any[] = Array.isArray(raw.conversation) ? raw.conversation : [];
  const transcript = conversation
    .map((msg: any) => `${msg.role ?? "unknown"}: ${msg.content ?? ""}`)
    .join("\n");

  return {
    id: raw.id,
    callerName: "Private Number",
    phoneNumber: "Encrypted",
    summary: raw.summary ?? "No summary available.",
    duration,
    timestamp: raw.call_started_at ? formatTimestamp(raw.call_started_at) : "—",
    sentiment,
    status: "new" as CallStatus,        // no status column in DB yet
    assignedTo: null,                    // no assignedTo column in DB yet
    priority: false,                     // no priority column in DB yet
    transcript,
    notes: [],                           // no notes column in DB yet
  };
}

/* ── Read ────────────────────────────────────────────────────────────────── */
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  if (!supabase) {
    console.warn("[Audit] Supabase not configured.");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("call_logs")
      .select(
        "id, call_started_at, call_ended_at, duration_seconds, conversation, summary, phone_number_encrypted"
      )
      .order("call_started_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return (data ?? []).map(mapRow);
  } catch (err) {
    console.warn("[Audit] Could not fetch audit logs:", err);
    return [];
  }
}

/* ── Mutations (UI-only — no backend persistence yet) ─────────────────────── */
// These operations update UI state optimistically but don't persist to DB
// because the call_logs table has no assign/priority/status/notes columns.
// When those columns are added to Supabase, update these functions accordingly.

export async function assignCallTo(
  _id: string,
  _assignedTo: string | null
): Promise<AuditLogEntry[]> {
  return getAuditLogs();
}

export async function toggleCallPriority(_id: string): Promise<AuditLogEntry[]> {
  return getAuditLogs();
}

export async function updateCallStatus(
  _id: string,
  _status: CallStatus
): Promise<AuditLogEntry[]> {
  return getAuditLogs();
}

export async function addCallNote(
  _id: string,
  _note: string
): Promise<AuditLogEntry[]> {
  return getAuditLogs();
}
