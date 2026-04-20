/**
 * auditLog.ts — shared types, constants, and format utilities.
 *
 * The mock seed and localStorage helpers have been removed.
 * All data now comes from the backend API via src/services/audit.ts.
 */

export type Sentiment = "positive" | "neutral" | "urgent";
export type CallStatus = "new" | "in_progress" | "resolved";

export interface AuditLogEntry {
  id: string;
  callerName: string;
  phoneNumber: string;
  summary: string;
  duration: string;
  timestamp: string;
  sentiment: Sentiment;
  status: CallStatus;
  assignedTo: string | null;
  priority: boolean;
  transcript: string;
  notes: string[];
}

/**
 * Staff names used for the admin filter bar.
 * In production these would come from a /api/staff endpoint.
 * For now they are kept as UI config — not injected as fake call data.
 */
export const MOCK_STAFF = [
  "Sarah K.",
  "Marcus T.",
  "Priya N.",
  "James R.",
  "Elena V.",
];

/* ── Format helpers ───────────────────────────────────────────────────────── */

export const formatTimestamp = (iso: string): string => {
  const d = new Date(iso);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
