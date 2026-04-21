/**
 * Audit service — fetches and mutates audit log data.
 *
 * All operations go to the FastAPI backend.
 * On error → return [] (empty state). NEVER inject mock/seed data.
 */

import { api, ApiError } from "@/services/api";
import {
  type AuditLogEntry,
  type CallStatus,
} from "@/utils/auditLog";

/* ── Read ────────────────────────────────────────────────────────────────── */

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    return await api.get<AuditLogEntry[]>("/api/call-logs");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      console.warn("[Audit] Unauthorized — session may have expired.");
    } else {
      console.warn("[Audit] Could not fetch audit logs:", err);
    }
    return [];
  }
}

/* ── Assign ──────────────────────────────────────────────────────────────── */

export async function assignCallTo(
  id: string,
  assignedTo: string | null
): Promise<AuditLogEntry[]> {
  try {
    await api.patch(`/api/call-logs/${id}/assign`, { assignedTo });
    return await getAuditLogs();
  } catch (err) {
    console.warn("[Audit] assign failed:", err);
    return await getAuditLogs();
  }
}

/* ── Priority ────────────────────────────────────────────────────────────── */

export async function toggleCallPriority(id: string): Promise<AuditLogEntry[]> {
  try {
    await api.patch(`/api/call-logs/${id}/priority`, {});
    return await getAuditLogs();
  } catch (err) {
    console.warn("[Audit] priority toggle failed:", err);
    return await getAuditLogs();
  }
}

/* ── Status ──────────────────────────────────────────────────────────────── */

export async function updateCallStatus(
  id: string,
  status: CallStatus
): Promise<AuditLogEntry[]> {
  try {
    await api.patch(`/api/call-logs/${id}/status`, { status });
    return await getAuditLogs();
  } catch (err) {
    console.warn("[Audit] status update failed:", err);
    return await getAuditLogs();
  }
}

/* ── Notes ───────────────────────────────────────────────────────────────── */

export async function addCallNote(
  id: string,
  note: string
): Promise<AuditLogEntry[]> {
  try {
    await api.post(`/api/call-logs/${id}/notes`, { note });
    return await getAuditLogs();
  } catch (err) {
    console.warn("[Audit] add note failed:", err);
    return await getAuditLogs();
  }
}
