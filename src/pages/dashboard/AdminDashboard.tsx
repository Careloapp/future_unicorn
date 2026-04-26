import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  Voicemail,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import FollowUpTable from "@/components/dashboard/FollowUpTable";
import { getAuth } from "@/utils/auth";
import {
  getAdminMetrics,
  getRecentVoicemails,
  type AdminMetrics,
  type VoicemailEntry,
} from "@/services/dashboard";
import { getAuditLogs } from "@/services/audit";
import type { AuditLogEntry } from "@/utils/auditLog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />
);

/* ── Status Badge ─────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; color: string }> = {
    completed: { label: "Transcribed", color: "rgba(0,229,160,0.15)" },
    pending: { label: "Pending", color: "rgba(251,191,36,0.15)" },
    processing: { label: "Processing", color: "rgba(124,58,237,0.15)" },
    failed: { label: "Failed", color: "rgba(248,113,113,0.15)" },
  };
  const { label, color } = map[status] ?? { label: status, color: "rgba(255,255,255,0.08)" };
  return (
    <span
      className="font-body text-[11px] px-2 py-0.5 rounded-full"
      style={{ background: color }}
    >
      {label}
    </span>
  );
};

/* ── Tooltip ──────────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 border border-white/10 font-body text-xs"
      style={{ background: "rgba(10,13,22,0.95)", backdropFilter: "blur(12px)" }}
    >
      <p className="text-[var(--text-muted)] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const auth = getAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [voicemails, setVoicemails] = useState<VoicemailEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminMetrics(), getAuditLogs(), getRecentVoicemails(10)]).then(
      ([m, l, v]) => {
        setMetrics(m);
        setLogs(l);
        setVoicemails(v);
        setLoading(false);
      }
    );
  }, []);

  const kpi = metrics?.kpi;
  const weekly = metrics?.weekly ?? [];

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
            {greeting}, {auth?.name?.split(" ")[0] || "Admin"}.
          </h1>
          <p className="font-body text-sm text-[var(--text-muted)] mt-1">
            Here's what's happening with your calls today.
          </p>
        </motion.div>

        {/* KPI Cards — 4 columns */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard
              label="Total Calls"
              value={kpi?.total ?? 0}
              icon={<PhoneCall size={16} />}
              delay={0.1}
            />
            <KPICard
              label="Answered"
              value={kpi?.answered ?? 0}
              icon={<PhoneIncoming size={16} />}
              delay={0.18}
            />
            <KPICard
              label="Missed"
              value={kpi?.missed ?? 0}
              icon={<PhoneMissed size={16} />}
              accentColor="rgba(248,113,113,0.6)"
              delay={0.26}
            />
            <KPICard
              label="Voicemails"
              value={kpi?.voicemails ?? 0}
              icon={<Voicemail size={16} />}
              accentColor="rgba(251,191,36,0.6)"
              delay={0.34}
            />
          </div>
        )}

        {/* Chart */}
        <motion.div
          className="rounded-2xl border border-white/8 p-6 mb-8"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-body font-semibold text-sm text-[var(--text-primary)]">
                Call Volume
              </h3>
              <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                <span className="font-body text-[11px] text-[var(--text-muted)]">Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00e5a0]" />
                <span className="font-body text-[11px] text-[var(--text-muted)]">Answered</span>
              </div>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-[180px]" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weekly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "Barlow" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "Barlow" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="calls"
                  name="Total"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  fill="url(#colorCalls)"
                />
                <Area
                  type="monotone"
                  dataKey="answered"
                  name="Answered"
                  stroke="#00e5a0"
                  strokeWidth={2}
                  fill="url(#colorAnswered)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Voicemails Section */}
        <motion.div
          className="rounded-2xl border border-white/8 p-6 mb-8"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Voicemail size={16} className="text-[var(--text-muted)]" />
              <h3 className="font-body font-semibold text-sm text-[var(--text-primary)]">
                Recent Voicemails
              </h3>
            </div>
            <span className="font-body text-[11px] text-[var(--text-muted)]">
              Last 10 received
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : voicemails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Voicemail size={28} className="text-[var(--text-muted)] opacity-40" />
              <p className="font-body text-sm text-[var(--text-muted)]">No voicemails yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="text-left border-b border-white/6">
                    <th className="pb-3 text-[11px] font-medium text-[var(--text-muted)] pr-4">#</th>
                    <th className="pb-3 text-[11px] font-medium text-[var(--text-muted)] pr-4">
                      Caller
                    </th>
                    <th className="pb-3 text-[11px] font-medium text-[var(--text-muted)] pr-4">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> Received
                      </span>
                    </th>
                    <th className="pb-3 text-[11px] font-medium text-[var(--text-muted)] pr-4">
                      Duration
                    </th>
                    <th className="pb-3 text-[11px] font-medium text-[var(--text-muted)] pr-4">
                      Status
                    </th>
                    <th className="pb-3 text-[11px] font-medium text-[var(--text-muted)]">
                      Summary
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {voicemails.map((vm, idx) => (
                    <tr
                      key={vm.id}
                      className="border-b border-white/4 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 pr-4 text-[var(--text-muted)] text-xs">{idx + 1}</td>
                      <td className="py-3 pr-4 text-[var(--text-primary)]">
                        Private Number
                      </td>
                      <td className="py-3 pr-4 text-[var(--text-muted)] text-xs whitespace-nowrap">
                        {formatDateTime(vm.received_at)}
                      </td>
                      <td className="py-3 pr-4 text-[var(--text-muted)] text-xs">
                        {formatDuration(vm.duration_seconds)}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={vm.transcript_status} />
                      </td>
                      <td className="py-3 text-[var(--text-muted)] text-xs max-w-xs truncate">
                        {vm.summary ? (
                          <span className="text-[var(--text-primary)]">{vm.summary}</span>
                        ) : vm.transcript_status === "pending" ? (
                          <span className="flex items-center gap-1 opacity-50">
                            <Loader2 size={10} className="animate-spin" /> Processing…
                          </span>
                        ) : (
                          <span className="opacity-40 italic">No summary</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Follow-up Table — driven by live audit log data */}
        <FollowUpTable entries={logs} loading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
