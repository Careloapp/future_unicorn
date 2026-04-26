/**
 * CallLogs page — reads directly from Supabase `call_logs` table.
 * No backend required.
 */
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PhoneCall, PhoneIncoming, PhoneMissed, PhoneOff } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { formatTimestamp } from "@/utils/auditLog";

/* ── Types ────────────────────────────────────────────────────────────────── */
type CallType = "Inbound" | "Outbound" | "Missed" | "Voicemail";

interface DisplayLog {
  id: string;
  caller: string;
  number: string;
  type: CallType;
  duration: string;
  time: string;
  summary: string | null;
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const typeConfig: Record<CallType, { icon: React.ReactNode; color: string; bg: string }> = {
  Inbound:   { icon: <PhoneIncoming size={13} />, color: "#00e5a0", bg: "rgba(0,229,160,0.1)" },
  Outbound:  { icon: <PhoneCall size={13} />,     color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  Missed:    { icon: <PhoneMissed size={13} />,   color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  Voicemail: { icon: <PhoneOff size={13} />,      color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
};

/** Map a raw call_logs DB row → display-friendly shape */
function mapRow(raw: any, index: number): DisplayLog {
  const hasConversation = Array.isArray(raw.conversation) && raw.conversation.length > 0;
  const hasEnded = raw.call_ended_at !== null && (raw.duration_seconds ?? 0) > 0;

  let type: CallType;
  if (hasEnded && hasConversation) type = "Inbound";
  else if (hasEnded && !hasConversation) type = "Outbound";
  else type = "Missed";

  const durationSec: number = raw.duration_seconds ?? 0;
  const mins = Math.floor(durationSec / 60);
  const secs = durationSec % 60;
  const duration = durationSec > 0 ? `${mins}m ${String(secs).padStart(2, "0")}s` : "—";

  return {
    id: raw.id ?? String(index),
    caller: "Private Number",
    number: "Encrypted",
    type,
    duration,
    time: raw.call_started_at ? formatTimestamp(raw.call_started_at) : "—",
    summary: raw.summary ?? null,
  };
}

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="space-y-2 p-4">
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
    ))}
  </div>
);

/* ── Page ─────────────────────────────────────────────────────────────────── */
const CallLogs = () => {
  const [logs, setLogs] = useState<DisplayLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    supabase
      .from("call_logs")
      .select("id, call_started_at, call_ended_at, duration_seconds, conversation, summary, phone_number_encrypted")
      .order("call_started_at", { ascending: false })
      .limit(100)
      .then(({ data, error: err }) => {
        if (err) {
          console.error("[CallLogs] Supabase error:", err);
          setError(`Failed to load call logs: ${err.message}`);
        } else {
          setLogs((data ?? []).map(mapRow));
        }
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading italic text-3xl text-[var(--text-primary)]">Call Logs</h1>
          <p className="font-body text-sm text-[var(--text-muted)] mt-1">
            {loading ? "Loading…" : error ? error : `${logs.length} calls`}
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <Skeleton />
          ) : error ? (
            <div className="py-16 text-center">
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-heading italic text-xl text-white mb-1">No calls yet</p>
              <p className="font-body text-sm text-gray-500">
                Call logs will appear here once calls are received.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Caller", "Number", "Type", "Duration", "Time", "Summary"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left font-body text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const cfg = typeConfig[log.type];
                  return (
                    <motion.tr
                      key={log.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors cursor-default"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.03 }}
                    >
                      <td className="px-6 py-3.5 font-body text-sm text-[var(--text-primary)]">
                        {log.caller}
                      </td>
                      <td className="px-6 py-3.5 font-body text-xs text-[var(--text-muted)]">
                        {log.number}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-[11px] font-medium"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.icon}
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-body text-sm text-[var(--text-muted)]">
                        {log.duration}
                      </td>
                      <td className="px-6 py-3.5 font-body text-sm text-[var(--text-muted)] whitespace-nowrap">
                        {log.time}
                      </td>
                      <td className="px-6 py-3.5 font-body text-xs text-[var(--text-muted)] max-w-xs truncate">
                        {log.summary ?? (
                          <span className="opacity-40 italic">No summary</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CallLogs;
