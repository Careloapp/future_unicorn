import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import TaskCard, { type Task } from "@/components/dashboard/TaskCard";
import { getAuth } from "@/utils/auth";
import { getAuditLogs } from "@/services/audit";
import type { AuditLogEntry } from "@/utils/auditLog";
import { CheckCircle2, Clock, ListTodo } from "lucide-react";

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />
);

/* ── Stat pill ────────────────────────────────────────────────────────────── */
const StatPill = ({
  icon, label, value, delay,
}: {
  icon: React.ReactNode; label: string; value: number; delay: number;
}) => (
  <motion.div
    className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/8"
    style={{ background: "rgba(255,255,255,0.03)" }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{ background: "rgba(0,229,160,0.08)", color: "var(--red)" }}
    >
      {icon}
    </div>
    <div>
      <p className="font-heading italic text-xl text-[var(--text-primary)] leading-none">{value}</p>
      <p className="font-body text-[11px] text-[var(--text-muted)] mt-0.5">{label}</p>
    </div>
  </motion.div>
);

/* ── Map AuditLogEntry → Task ─────────────────────────────────────────────── */
function toTask(entry: AuditLogEntry, idx: number): Task {
  const statusMap: Record<string, Task["status"]> = {
    new: "todo",
    in_progress: "in-progress",
    resolved: "done",
  };
  return {
    id: idx + 1,
    title: entry.summary || `Follow up with ${entry.callerName}`,
    client: entry.callerName,
    status: statusMap[entry.status] ?? "todo",
    dueDate: new Date(entry.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
const StaffDashboard = () => {
  const auth = getAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [allLogs, setAllLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs().then((logs) => {
      setAllLogs(logs);
      setLoading(false);
    });
  }, []);

  // Filter to only calls assigned to this user
  const myLogs = useMemo(() => {
    if (!auth?.name) return allLogs; // show all if name unknown
    return allLogs.filter((l) => l.assignedTo === auth.name);
  }, [allLogs, auth?.name]);

  const tasks: Task[] = useMemo(() => myLogs.map(toTask), [myLogs]);

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.filter((t) => t.status === "todo").length;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-heading italic text-3xl text-[var(--text-primary)]">
            {greeting}, {auth?.name?.split(" ")[0] || "there"}.
          </h1>
          <p className="font-body text-sm text-[var(--text-muted)] mt-1">
            {loading
              ? "Loading your tasks…"
              : `You have ${pending} pending task${pending !== 1 ? "s" : ""} today.`}
          </p>
        </motion.div>

        {/* Quick stats */}
        {loading ? (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <StatPill icon={<ListTodo size={15} />} label="Total tasks" value={total} delay={0.1} />
            <StatPill icon={<CheckCircle2 size={15} />} label="Completed" value={done} delay={0.16} />
            <StatPill icon={<Clock size={15} />} label="Pending" value={pending} delay={0.22} />
          </div>
        )}

        {/* Section heading */}
        <motion.div
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          <h2 className="font-body font-semibold text-sm text-[var(--text-primary)]">
            Assigned to me
          </h2>
          <span className="font-body text-xs text-[var(--text-muted)]">{total} tasks</span>
        </motion.div>

        {/* Task list */}
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : tasks.length === 0 ? (
          <motion.div
            className="py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-heading italic text-xl text-white mb-1">All caught up</p>
            <p className="font-body text-sm text-gray-500">No tasks assigned to you right now.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
