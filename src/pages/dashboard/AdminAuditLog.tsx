import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { ClipboardList } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import AuditLogTable from "@/components/audit/AuditLogTable";
import FilterBar, { type FilterType } from "@/components/audit/FilterBar";
import SidePanel from "@/components/audit/SidePanel";
import type { AuditLogEntry } from "@/utils/auditLog";
import {
  getAuditLogs,
  assignCallTo,
  toggleCallPriority,
  updateCallStatus,
  addCallNote,
} from "@/services/audit";

const AdminAuditLog = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selected, setSelected] = useState<AuditLogEntry | null>(null);

  // Load on mount — tries API first, falls back to localStorage
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

  // Filter counts
  const counts = useMemo(() => ({
    all: logs.length,
    unassigned: logs.filter((l) => !l.assignedTo).length,
    urgent: logs.filter((l) => l.sentiment === "urgent").length,
  }), [logs]);

  // Filtered entries
  const filtered = useMemo(() => {
    if (filter === "all") return logs;
    if (filter === "unassigned") return logs.filter((l) => !l.assignedTo);
    if (filter === "urgent") return logs.filter((l) => l.sentiment === "urgent");
    // staff name
    return logs.filter((l) => l.assignedTo === filter);
  }, [logs, filter]);

  const handleAssign = (id: string, name: string | null) => {
    assignCallTo(id, name).then(setLogs);
  };

  const handleTogglePriority = (id: string) => {
    toggleCallPriority(id).then(setLogs);
  };

  const handleStatusChange = (id: string, status: AuditLogEntry["status"]) => {
    updateCallStatus(id, status).then(setLogs);
  };

  const handleAddNote = (id: string, note: string) => {
    addCallNote(id, note).then(setLogs);
  };

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
            <h1 className="font-heading italic text-3xl text-white">Audit Log</h1>
          </div>
          <p className="font-body text-sm text-gray-500 ml-11">
            {logs.length} calls captured · {counts.unassigned} unassigned · {counts.urgent} urgent
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
          {/* Filter bar */}
          <div className="px-6 py-4 border-b border-white/6">
            <FilterBar active={filter} onChange={setFilter} counts={counts} />
          </div>

          {/* Table */}
          <AuditLogTable
            entries={filtered}
            isAdmin={true}
            onRowClick={setSelected}
            onAssign={handleAssign}
            onTogglePriority={handleTogglePriority}
          />
        </motion.div>
      </div>

      {/* Side panel */}
      <SidePanel
        entry={selected}
        onClose={() => setSelected(null)}
        onAddNote={handleAddNote}
        onStatusChange={handleStatusChange}
        isAdmin={true}
      />
    </DashboardLayout>
  );
};

export default AdminAuditLog;
