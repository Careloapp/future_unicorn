import { useState, useEffect } from "react";
import { motion } from "motion/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getAdminMetrics, type AdminMetrics } from "@/services/dashboard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const PIE_COLORS = ["#00e5a0", "#f87171"];

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />
);

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

const Analytics = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminMetrics().then((m) => {
      setMetrics(m);
      setLoading(false);
    });
  }, []);

  const weeklyData = metrics?.weekly ?? [];
  const pieData = metrics
    ? [
        { name: "Answered", value: metrics.kpi.answered },
        { name: "Missed",   value: metrics.kpi.missed },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading italic text-3xl text-[var(--text-primary)]">Analytics</h1>
          <p className="font-body text-sm text-[var(--text-muted)] mt-1">Performance overview</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar chart */}
          <motion.div
            className="lg:col-span-2 rounded-2xl border border-white/8 p-6"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-body font-semibold text-sm text-[var(--text-primary)] mb-5">
              Weekly Calls
            </h3>
            {loading ? (
              <Skeleton className="h-[200px]" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                  <Bar dataKey="calls" name="Calls" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Pie chart */}
          <motion.div
            className="rounded-2xl border border-white/8 p-6"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <h3 className="font-body font-semibold text-sm text-[var(--text-primary)] mb-5">
              Answer Rate
            </h3>
            {loading ? (
              <Skeleton className="h-[200px]" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => (
                      <span
                        style={{ color: "var(--text-muted)", fontFamily: "Barlow", fontSize: 11 }}
                      >
                        {value}
                      </span>
                    )}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
