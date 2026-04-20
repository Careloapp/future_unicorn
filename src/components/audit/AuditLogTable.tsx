import { motion } from "motion/react";
import type { AuditLogEntry, CallStatus } from "@/utils/auditLog";
import { formatTimestamp } from "@/utils/auditLog";
import SentimentBadge from "./SentimentBadge";
import StatusBadge from "./StatusBadge";
import AssignDropdown from "./AssignDropdown";
import PriorityToggle from "./PriorityToggle";
import { Phone, Clock } from "lucide-react";

interface AuditLogTableProps {
  entries: AuditLogEntry[];
  isAdmin: boolean;
  onRowClick: (entry: AuditLogEntry) => void;
  onAssign?: (id: string, name: string | null) => void;
  onTogglePriority?: (id: string) => void;
  onTakeAction?: (entry: AuditLogEntry) => void;
}

/* ── Empty state ── */
const EmptyState = () => (
  <motion.div
    className="flex flex-col items-center justify-center py-20 px-8"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    {/* Minimal illustration */}
    <div className="relative mb-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(0,229,160,0.06)",
          border: "1px solid rgba(0,229,160,0.12)",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,229,160,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
      <div
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
        style={{ background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.2)" }}
      />
    </div>
    <p className="font-heading italic text-xl text-white mb-1">All caught up</p>
    <p className="font-body text-sm text-gray-500 text-center max-w-xs">
      No calls match the current filter. Check back later or adjust your filters.
    </p>
  </motion.div>
);

/* ── Table ── */
const AuditLogTable = ({
  entries,
  isAdmin,
  onRowClick,
  onAssign,
  onTogglePriority,
  onTakeAction,
}: AuditLogTableProps) => {
  if (entries.length === 0) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/6">
            {isAdmin ? (
              <>
                <th className="audit-th">Caller</th>
                <th className="audit-th">Summary</th>
                <th className="audit-th">Duration</th>
                <th className="audit-th">Sentiment</th>
                <th className="audit-th">Status</th>
                <th className="audit-th">Assigned To</th>
                <th className="audit-th text-center">Priority</th>
              </>
            ) : (
              <>
                <th className="audit-th">Caller</th>
                <th className="audit-th">Summary</th>
                <th className="audit-th">Time</th>
                <th className="audit-th">Status</th>
                <th className="audit-th" />
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <motion.tr
              key={entry.id}
              className="border-b border-white/5 last:border-0 cursor-pointer group"
              style={{ background: "transparent" }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileHover={{ background: "rgba(255,255,255,0.025)" }}
              onClick={() => onRowClick(entry)}
            >
              {isAdmin ? (
                <>
                  {/* Caller */}
                  <td className="audit-td">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-body font-semibold flex-shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        {entry.callerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium text-white/90 truncate max-w-[130px]">
                          {entry.callerName}
                        </p>
                        <p className="font-body text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone size={9} />
                          {entry.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Summary */}
                  <td className="audit-td max-w-[220px]">
                    <p className="font-body text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {entry.summary}
                    </p>
                  </td>

                  {/* Duration + Time */}
                  <td className="audit-td whitespace-nowrap">
                    <p className="font-body text-sm text-white/80 flex items-center gap-1">
                      <Clock size={11} className="text-gray-500" />
                      {entry.duration}
                    </p>
                    <p className="font-body text-[11px] text-gray-500 mt-0.5">
                      {formatTimestamp(entry.timestamp)}
                    </p>
                  </td>

                  {/* Sentiment */}
                  <td className="audit-td">
                    <SentimentBadge sentiment={entry.sentiment} />
                  </td>

                  {/* Status */}
                  <td className="audit-td">
                    <StatusBadge status={entry.status} />
                  </td>

                  {/* Assigned To */}
                  <td className="audit-td" onClick={(e) => e.stopPropagation()}>
                    {onAssign && (
                      <AssignDropdown
                        assignedTo={entry.assignedTo}
                        onAssign={(name) => onAssign(entry.id, name)}
                      />
                    )}
                  </td>

                  {/* Priority */}
                  <td className="audit-td text-center" onClick={(e) => e.stopPropagation()}>
                    {onTogglePriority && (
                      <PriorityToggle
                        priority={entry.priority}
                        onToggle={() => onTogglePriority(entry.id)}
                      />
                    )}
                  </td>
                </>
              ) : (
                <>
                  {/* Caller */}
                  <td className="audit-td">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-body font-semibold flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                      >
                        {entry.callerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium text-white/90 truncate max-w-[140px]">
                          {entry.callerName}
                        </p>
                        <p className="font-body text-[11px] text-gray-500 mt-0.5">{entry.phoneNumber}</p>
                      </div>
                    </div>
                  </td>

                  {/* Summary */}
                  <td className="audit-td max-w-[240px]">
                    <p className="font-body text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {entry.summary}
                    </p>
                  </td>

                  {/* Time */}
                  <td className="audit-td whitespace-nowrap">
                    <p className="font-body text-sm text-white/80">{formatTimestamp(entry.timestamp)}</p>
                    <p className="font-body text-[11px] text-gray-500 mt-0.5">{entry.duration}</p>
                  </td>

                  {/* Status */}
                  <td className="audit-td">
                    <StatusBadge status={entry.status} />
                  </td>

                  {/* Action */}
                  <td className="audit-td" onClick={(e) => e.stopPropagation()}>
                    <motion.button
                      onClick={() => onTakeAction?.(entry)}
                      className="px-3 py-1.5 rounded-lg font-body text-xs font-semibold border transition-all"
                      style={{
                        background: "rgba(0,229,160,0.08)",
                        borderColor: "rgba(0,229,160,0.25)",
                        color: "#00e5a0",
                      }}
                      whileHover={{ scale: 1.04, boxShadow: "0 0 12px rgba(0,229,160,0.15)" }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Take Action
                    </motion.button>
                  </td>
                </>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
