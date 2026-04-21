import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { ClipboardList } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import AuditLogTable from "@/components/audit/AuditLogTable";
import SidePanel from "@/components/audit/SidePanel";
import type { AuditLogEntry } from "@/utils/auditLog";
import {
  getAuditLogs,
  updateCallStatus,
  addCallNote,
} from "@/services/audit";
import { getAuth } from "@/utils/auth";

const StaffAuditLog = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [selected, setSelected] = useState<AuditLogEntry | null>(null);
  const auth = getAuth();

  useEffect(() => {
    getAuditLogs().then(setLogs);
  }, []);

  // Sync selected entry when logs update
  useEffect(() => {
    if (selected) {
      const updated = logs.find((l) => l.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [logs]);

  // Only show calls assigned to this user
  const myLogs = useMemo(() => {
    if (!auth?.name) return [];
    return logs.filter((l) => l.assignedTo === auth.name);
  }, [logs, auth?.name]);

  const handleStatusChange = (id: string, status: AuditLogEntry["status"]) => {
    updateCallStatus(id, status).then(setLogs);
  };

  const handleAddNote = (id: string, note: string) => {
    addCallNote(id, note).then(setLogs);
  };

  const pending = myLogs.filter((l) => l.status !== "resolved").length;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,229,160,0.08)", color: "#00e5a0" }}
            >
              <ClipboardList size={16} />
            </div>
            <h1 className="font-heading italic text-3xl text-white">My Queue</h1>
          </div>
          <p className="font-body text-sm text-gray-500 ml-11">
            {myLogs.length} assigned call{myLogs.length !== 1 ? "s" : ""} · {pending} need{pending !== 1 ? "" : "s"} action
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Table header */}
          <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between">
            <p className="font-body text-xs text-gray-500">
              Showing calls assigned to <span className="text-white/70 font-medium">{auth?.name || "you"}</span>
            </p>
            {myLogs.length > 0 && (
              <span
                className="font-body text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: pending > 0 ? "rgba(251,191,36,0.1)" : "rgba(0,229,160,0.08)",
                  color: pending > 0 ? "#fbbf24" : "#00e5a0",
                }}
              >
                {pending > 0 ? `${pending} pending` : "All resolved"}
              </span>
            )}
          </div>

          {/* Table */}
          <AuditLogTable
            entries={myLogs}
            isAdmin={false}
            onRowClick={setSelected}
            onTakeAction={setSelected}
          />
        </motion.div>
      </div>

      {/* Side panel */}
      <SidePanel
        entry={selected}
        onClose={() => setSelected(null)}
        onAddNote={handleAddNote}
        onStatusChange={handleStatusChange}
        isAdmin={false}
      />
    </DashboardLayout>
  );
};

export default StaffAuditLog;
