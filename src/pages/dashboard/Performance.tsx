import { useState, useEffect } from "react";
import { motion } from "motion/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getAuth } from "@/utils/auth";
import { getStaffMetrics, type StaffMetrics } from "@/services/dashboard";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from "recharts";

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />
);

/* ── Progress bar row ─────────────────────────────────────────────────────── */
const StatRow = ({
  label, value, max = 100, delay = 0,
}: {
  label: string; value: number; max?: number; delay?: number;
}) => {
  const pct = (value / max) * 100;
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
      <div className="flex justify-between mb-1.5">
        <span className="font-body text-xs text-[var(--text-muted)]">{label}</span>
        <span className="font-body text-xs font-medium text-[var(--text-primary)]">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #7c3aed, #00e5a0)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

/* ── Page ─────────────────────────────────────────────────────────────────── */
const Performance = () => {
  const auth = getAuth();
  const [metrics, setMetrics] = useState<StaffMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStaffMetrics().then((m) => {
      setMetrics(m);
      setLoading(false);
    });
  }, []);

  const radar = metrics?.radar ?? [];
  const breakdown = metrics?.radar ?? [];

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading italic text-3xl text-[var(--text-primary)]">Performance</h1>
          <p className="font-body text-sm text-[var(--text-muted)] mt-1">
            {auth?.name?.split(" ")[0]}'s metrics this month
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar */}
          <motion.div
            className="rounded-2xl border border-white/8 p-6"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-body font-semibold text-sm text-[var(--text-primary)] mb-4">
              Skill Radar
            </h3>
            {loading ? (
              <Skeleton className="h-[240px]" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radar}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "Barlow" }}
                  />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#00e5a0"
                    fill="#00e5a0"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,13,22,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      fontFamily: "Barlow",
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "var(--text-muted)" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Progress bars */}
          <motion.div
            className="rounded-2xl border border-white/8 p-6"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <h3 className="font-body font-semibold text-sm text-[var(--text-primary)] mb-5">
              Breakdown
            </h3>
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8" />)}
              </div>
            ) : (
              <div className="space-y-5">
                {breakdown.map((item, i) => (
                  <StatRow
                    key={item.subject}
                    label={item.subject}
                    value={item.A}
                    delay={0.2 + i * 0.05}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Performance;
