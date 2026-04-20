import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Phone, Clock, Calendar, MessageSquarePlus, ChevronDown } from "lucide-react";
import type { AuditLogEntry, CallStatus } from "@/utils/auditLog";
import { formatTimestamp } from "@/utils/auditLog";
import StatusBadge from "./StatusBadge";
import SentimentBadge from "./SentimentBadge";

interface SidePanelProps {
  entry: AuditLogEntry | null;
  onClose: () => void;
  onAddNote: (id: string, note: string) => void;
  onStatusChange?: (id: string, status: CallStatus) => void;
  isAdmin?: boolean;
}

const STATUS_OPTIONS: { value: CallStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const SidePanel = ({ entry, onClose, onAddNote, onStatusChange, isAdmin }: SidePanelProps) => {
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const handleSaveNote = () => {
    if (!note.trim() || !entry) return;
    onAddNote(entry.id, note.trim());
    setNote("");
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  };

  const handleStatusChange = (status: CallStatus) => {
    if (!entry || !onStatusChange) return;
    onStatusChange(entry.id, status);
    setStatusOpen(false);
  };

  return (
    <AnimatePresence>
      {entry && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full z-50 flex flex-col border-l border-white/10 overflow-hidden"
            style={{
              width: 420,
              background: "rgba(8,11,20,0.97)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              boxShadow: "-24px 0 60px rgba(0,0,0,0.5)",
            }}
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-body text-[10px] font-medium text-gray-500 tracking-widest uppercase">
                    {entry.id}
                  </span>
                  <SentimentBadge sentiment={entry.sentiment} />
                </div>
                <h3 className="font-heading italic text-xl text-white leading-tight">
                  {entry.callerName}
                </h3>
              </div>
              <motion.button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8 transition-colors flex-shrink-0 mt-0.5"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">

              {/* Call details */}
              <div className="px-6 py-5 border-b border-white/6">
                <p className="font-body text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-3">
                  Call Details
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Phone size={13} className="text-gray-500 flex-shrink-0" />
                    <span className="font-body text-sm text-gray-300">{entry.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={13} className="text-gray-500 flex-shrink-0" />
                    <span className="font-body text-sm text-gray-300">{entry.duration}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar size={13} className="text-gray-500 flex-shrink-0" />
                    <span className="font-body text-sm text-gray-300">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Status row */}
                <div className="flex items-center gap-3 mt-4">
                  <StatusBadge status={entry.status} />

                  {/* Status change — available to both roles */}
                  {onStatusChange && (
                    <div className="relative">
                      <motion.button
                        onClick={() => setStatusOpen((v) => !v)}
                        className="flex items-center gap-1 font-body text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        Change
                        <ChevronDown
                          size={11}
                          style={{ transform: statusOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                        />
                      </motion.button>
                      <AnimatePresence>
                        {statusOpen && (
                          <motion.div
                            className="absolute top-full mt-1 left-0 z-10 rounded-xl border border-white/12 overflow-hidden"
                            style={{
                              background: "rgba(10,13,22,0.98)",
                              backdropFilter: "blur(20px)",
                              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                              minWidth: 140,
                            }}
                            initial={{ opacity: 0, y: -4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleStatusChange(opt.value)}
                                className="w-full px-3 py-2.5 text-left font-body text-xs transition-colors"
                                style={{
                                  color: entry.status === opt.value ? "#00e5a0" : "rgba(255,255,255,0.65)",
                                  background: entry.status === opt.value ? "rgba(0,229,160,0.06)" : "transparent",
                                }}
                                onMouseEnter={(e) => {
                                  if (entry.status !== opt.value)
                                    (e.target as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                                }}
                                onMouseLeave={(e) => {
                                  if (entry.status !== opt.value)
                                    (e.target as HTMLElement).style.background = "transparent";
                                }}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="mt-4 p-3 rounded-xl border border-white/6" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="font-body text-xs text-gray-400 leading-relaxed">{entry.summary}</p>
                </div>
              </div>

              {/* Transcript */}
              <div className="px-6 py-5 border-b border-white/6">
                <p className="font-body text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-3">
                  AI Transcript
                </p>
                <div
                  className="rounded-xl p-4 border border-white/6 max-h-56 overflow-y-auto"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  {entry.transcript.split("\n").map((line, i) => {
                    const isAgent = line.startsWith("Agent:");
                    const isCaller = line.startsWith("Caller:");
                    return (
                      <p
                        key={i}
                        className="font-body text-xs leading-relaxed mb-2 last:mb-0"
                        style={{
                          color: isAgent
                            ? "rgba(255,255,255,0.75)"
                            : isCaller
                            ? "rgba(0,229,160,0.85)"
                            : "rgba(255,255,255,0.4)",
                          fontWeight: isAgent || isCaller ? 500 : 400,
                        }}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="px-6 py-5">
                <p className="font-body text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-3">
                  Notes ({entry.notes.length})
                </p>

                {/* Existing notes */}
                {entry.notes.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {entry.notes.map((n, i) => (
                      <motion.div
                        key={i}
                        className="flex gap-2.5 p-3 rounded-xl border border-white/6"
                        style={{ background: "rgba(255,255,255,0.02)" }}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div
                          className="w-1 rounded-full flex-shrink-0 mt-0.5"
                          style={{ background: "rgba(0,229,160,0.4)", minHeight: 14 }}
                        />
                        <p className="font-body text-xs text-gray-300 leading-relaxed">{n}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Add note */}
                <div className="space-y-2">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note…"
                    rows={3}
                    className="w-full rounded-xl px-3 py-2.5 font-body text-xs text-white placeholder:text-gray-600 border border-white/10 focus:outline-none focus:border-[rgba(0,229,160,0.3)] resize-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  />
                  <motion.button
                    onClick={handleSaveNote}
                    disabled={!note.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-body text-xs font-semibold transition-all"
                    style={{
                      background: noteSaved
                        ? "rgba(0,229,160,0.12)"
                        : note.trim()
                        ? "linear-gradient(135deg, #00e5a0, #00c988)"
                        : "rgba(255,255,255,0.05)",
                      color: noteSaved ? "#00e5a0" : note.trim() ? "#05070E" : "rgba(255,255,255,0.25)",
                      boxShadow: note.trim() && !noteSaved ? "0 0 16px rgba(0,229,160,0.2)" : "none",
                      cursor: note.trim() ? "pointer" : "not-allowed",
                    }}
                    whileHover={note.trim() && !noteSaved ? { scale: 1.02 } : {}}
                    whileTap={note.trim() && !noteSaved ? { scale: 0.97 } : {}}
                  >
                    <MessageSquarePlus size={12} />
                    {noteSaved ? "Saved ✓" : "Save note"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
