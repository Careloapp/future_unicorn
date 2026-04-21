import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PhoneCall, PhoneIncoming, PhoneMissed, Voicemail } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import FollowUpTable from "@/components/dashboard/FollowUpTable";
import { getAuth } from "@/utils/auth";
import { getAdminMetrics, type AdminMetrics } from "@/services/dashboard";
import { getAuditLogs } from "@/services/audit";
import type { AuditLogEntry } from "@/utils/auditLog";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />
);

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminMetrics(), getAuditLogs()]).then(([m, l]) => {
      setMetrics(m);
      setLogs(l);
      setLoading(false);
    });
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

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
                <Area type="monotone" dataKey="calls" name="Total" stroke="#7c3aed" strokeWidth={2} fill="url(#colorCalls)" />
                <Area type="monotone" dataKey="answered" name="Answered" stroke="#00e5a0" strokeWidth={2} fill="url(#colorAnswered)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Follow-up Table — driven by live audit log data */}
        <FollowUpTable entries={logs} loading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
