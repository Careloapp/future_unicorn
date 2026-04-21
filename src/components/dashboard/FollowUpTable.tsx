import { motion } from "motion/react";
import type { AuditLogEntry } from "@/utils/auditLog";

/* ── Types ────────────────────────────────────────────────────────────────── */
type StatusType = "new" | "in_progress" | "resolved";

const statusConfig: Record<StatusType, { label: string; color: string; bg: string; dot: string }> = {
  new:         { label: "New",         color: "#93c5fd", bg: "rgba(147,197,253,0.1)",  dot: "#93c5fd" },
  in_progress: { label: "In Progress", color: "#60a5fa", bg: "rgba(96,165,250,0.1)",   dot: "#60a5fa" },
  resolved:    { label: "Resolved",    color: "#00e5a0", bg: "rgba(0,229,160,0.1)",    dot: "#00e5a0" },
};

/* ── Sub-components ───────────────────────────────────────────────────────── */
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status as StatusType] ?? statusConfig.new;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-[11px] font-medium"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

const Avatar = ({ initials }: { initials: string }) => (
  <div
    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-body font-semibold flex-shrink-0"
    style={{
      background: "linear-gradient(135deg, rgba(0,229,160,0.25), rgba(37,99,235,0.25))",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "var(--text-primary)",
    }}
  >
    {initials}
  </div>
);

const Skeleton = () => (
  <div className="space-y-2 p-4">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
    ))}
  </div>
);

/* ── Props ────────────────────────────────────────────────────────────────── */
interface FollowUpTableProps {
  entries: AuditLogEntry[];
  loading?: boolean;
}

/* ── Component ────────────────────────────────────────────────────────────── */
const FollowUpTable = ({ entries, loading = false }: FollowUpTableProps) => {
  // Show only in-progress and new calls as "active follow-ups"
  const active = entries.filter((e) => e.status !== "resolved").slice(0, 8);

  return (
    <motion.div
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <div>
          <h3 className="font-body font-semibold text-sm text-[var(--text-primary)]">
            Global Follow-ups
          </h3>
          <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">
            {loading ? "Loading…" : `${active.length} active calls`}
          </p>
        </div>
        <motion.button
          className="font-body text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-white/20 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          View all
        </motion.button>
      </div>

      {loading ? (
        <Skeleton />
      ) : active.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-heading italic text-lg text-white mb-1">All caught up</p>
          <p className="font-body text-xs text-gray-500">No active follow-ups right now.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Client", "Status", "Assigned To", "Sentiment"].map((h) => (
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
              {active.map((row, i) => {
                const initials = row.callerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                const assigneeInitials = row.assignedTo
                  ? row.assignedTo.split(" ").map((n) => n[0]).join("").toUpperCase()
                  : "—";

                return (
                  <motion.tr
                    key={row.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors duration-100 cursor-default"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar initials={initials} />
                        <span className="font-body text-sm text-[var(--text-primary)]">
                          {row.callerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-3.5">
                      {row.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar initials={assigneeInitials} />
                          <span className="font-body text-sm text-[var(--text-muted)]">
                            {row.assignedTo}
                          </span>
                        </div>
                      ) : (
                        <span className="font-body text-xs text-gray-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className="font-body text-[11px] capitalize px-2 py-0.5 rounded-full"
                        style={{
                          color: row.sentiment === "urgent" ? "#f87171" : row.sentiment === "positive" ? "#00e5a0" : "#94a3b8",
                          background: row.sentiment === "urgent" ? "rgba(248,113,113,0.1)" : row.sentiment === "positive" ? "rgba(0,229,160,0.08)" : "rgba(148,163,184,0.08)",
                        }}
                      >
                        {row.sentiment}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default FollowUpTable;
