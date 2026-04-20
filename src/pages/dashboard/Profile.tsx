import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck, Users, Mail, Calendar, Settings,
  Activity, CheckCircle2, PhoneCall,
} from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getAuth } from "@/utils/auth";
import { Link } from "react-router-dom";
import { getAdminMetrics, getStaffMetrics } from "@/services/dashboard";

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />
);

/* ── Stat tile ────────────────────────────────────────────────────────────── */
const StatTile = ({
  icon, label, value, delay, loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delay: number;
  loading?: boolean;
}) => (
  <motion.div
    className="flex flex-col gap-2 rounded-xl p-4 border border-white/8"
    style={{ background: "rgba(255,255,255,0.03)" }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    whileHover={{ y: -2, transition: { duration: 0.15 } }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400"
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      {icon}
    </div>
    {loading ? (
      <Skeleton className="h-7 w-12" />
    ) : (
      <p className="font-heading italic text-2xl text-white leading-none">{value}</p>
    )}
    <p className="font-body text-xs text-gray-500">{label}</p>
  </motion.div>
);

/* ── Page ─────────────────────────────────────────────────────────────────── */
const Profile = () => {
  const auth = getAuth();
  const isAdmin = auth?.role === "admin";
  const initials = auth?.name
    ? auth.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const settingsPath = isAdmin ? "/dashboard/admin/settings" : "/dashboard/staff/settings";

  const [statsLoading, setStatsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({ total: 0, answered: 0, missed: 0 });
  const [staffStats, setStaffStats] = useState({ resolved: 0, in_progress: 0, total: 0, score: 0 });

  useEffect(() => {
    if (isAdmin) {
      getAdminMetrics().then((m) => {
        setAdminStats({
          total: m.kpi.total,
          answered: m.kpi.answered,
          missed: m.kpi.missed,
        });
        setStatsLoading(false);
      });
    } else {
      getStaffMetrics().then((m) => {
        setStaffStats({
          resolved: m.summary.resolved,
          in_progress: m.summary.in_progress,
          total: m.summary.total,
          score: m.summary.score,
        });
        setStatsLoading(false);
      });
    }
  }, [isAdmin]);

  return (
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto px-8 py-8">

        {/* Page header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-heading italic text-3xl text-white">Profile</h1>
          <p className="font-body text-sm text-gray-500 mt-1">Your account overview</p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="w-full rounded-2xl border border-white/8 overflow-hidden mb-5"
          style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top accent */}
          <div
            className="h-[2px] w-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,229,160,0.4), transparent)",
            }}
          />

          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              {/* Avatar + identity */}
              <div className="flex items-center gap-5">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-body font-semibold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,229,160,0.2), rgba(37,99,235,0.15))",
                    border: "1px solid rgba(0,229,160,0.2)",
                    color: "#00e5a0",
                  }}
                >
                  {initials}
                </div>
                <div>
                  <h2 className="font-heading italic text-2xl text-white leading-tight">
                    {auth?.name || "—"}
                  </h2>
                  <span
                    className="inline-flex items-center gap-1.5 font-body text-xs font-medium px-2.5 py-1 rounded-full border mt-2"
                    style={{
                      color: "#00e5a0",
                      borderColor: "rgba(0,229,160,0.3)",
                      background: "rgba(0,229,160,0.08)",
                    }}
                  >
                    {isAdmin ? <ShieldCheck size={11} /> : <Users size={11} />}
                    {isAdmin ? "Admin" : "Employee"}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <Link to={settingsPath} className="flex-shrink-0">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-medium text-sm border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Settings size={14} />
                  Edit profile
                </motion.button>
              </Link>
            </div>

            <div className="border-t border-white/6 my-6" />

            {/* Info rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <Mail size={14} className="text-gray-500 flex-shrink-0" />
                <span className="font-body text-sm text-gray-300 truncate">
                  {auth?.email || "—"}
                </span>
              </div>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <Calendar size={14} className="text-gray-500 flex-shrink-0" />
                <span className="font-body text-sm text-gray-300">
                  {auth?.email ? "Active account" : "—"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats grid — live data only */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {isAdmin ? (
            <>
              <StatTile icon={<PhoneCall size={15} />}    label="Total calls"  value={adminStats.total}    delay={0.18} loading={statsLoading} />
              <StatTile icon={<CheckCircle2 size={15} />} label="Answered"     value={adminStats.answered} delay={0.22} loading={statsLoading} />
              <StatTile icon={<Activity size={15} />}     label="Missed"       value={adminStats.missed}   delay={0.26} loading={statsLoading} />
              <StatTile icon={<Users size={15} />}        label="Voicemails"   value="—"                   delay={0.3}  loading={false} />
            </>
          ) : (
            <>
              <StatTile icon={<CheckCircle2 size={15} />} label="Resolved"    value={staffStats.resolved}    delay={0.18} loading={statsLoading} />
              <StatTile icon={<Activity size={15} />}     label="In progress" value={staffStats.in_progress} delay={0.22} loading={statsLoading} />
              <StatTile icon={<PhoneCall size={15} />}    label="Total calls"  value={staffStats.total}       delay={0.26} loading={statsLoading} />
              <StatTile icon={<ShieldCheck size={15} />}  label="Score"        value={staffStats.score > 0 ? `${staffStats.score}%` : "—"} delay={0.3} loading={statsLoading} />
            </>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;
