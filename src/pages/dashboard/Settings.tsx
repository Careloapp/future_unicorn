import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, Save, CheckCircle2, Lock, Bell, Moon, Globe } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import GlassInput from "@/components/GlassInput";
import { getAuth, saveAuth } from "@/utils/auth";

/* ─── Reusable section wrapper ─── */
const Section = ({
  title,
  description,
  children,
  delay = 0,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    className="w-full rounded-2xl border border-white/8 overflow-hidden"
    style={{
      background: "rgba(255,255,255,0.025)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    }}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Section header */}
    <div className="px-8 py-5 border-b border-white/6">
      <h2 className="font-body font-semibold text-base text-white">{title}</h2>
      <p className="font-body text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
    {/* Section body */}
    <div className="px-8 py-6">{children}</div>
  </motion.div>
);

/* ─── Toggle row ─── */
const ToggleRow = ({
  icon,
  label,
  description,
  defaultOn = false,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  defaultOn?: boolean;
}) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          {icon}
        </div>
        <div>
          <p className="font-body text-sm font-medium text-gray-200">{label}</p>
          <p className="font-body text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <motion.button
        onClick={() => setOn((v) => !v)}
        className="relative w-10 h-5.5 rounded-full flex-shrink-0 transition-colors duration-200"
        style={{
          background: on ? "rgba(0,229,160,0.8)" : "rgba(255,255,255,0.12)",
          width: 40,
          height: 22,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: on ? 20 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      </motion.button>
    </div>
  );
};

/* ─── Main component ─── */
const Settings = () => {
  const auth = getAuth();
  const [name, setName] = useState(auth?.name ?? "");
  const [email, setEmail] = useState(auth?.email ?? "");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    saveAuth({ name, email, role: auth.role });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

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
          <h1 className="font-heading italic text-3xl text-white">Settings</h1>
          <p className="font-body text-sm text-gray-500 mt-1">
            Manage your account, security, and preferences
          </p>
        </motion.div>

        <div className="space-y-5">

          {/* ── Section 1: Profile Information ── */}
          <Section
            title="Profile Information"
            description="Update your name and email address"
            delay={0.08}
          >
            {/* Avatar row */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-body font-semibold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(0,229,160,0.2), rgba(37,99,235,0.15))",
                  border: "1px solid rgba(0,229,160,0.2)",
                  color: "#00e5a0",
                }}
              >
                {initials}
              </div>
              <div>
                <p className="font-body font-medium text-sm text-gray-200">{name || "Your Name"}</p>
                <p className="font-body text-xs text-gray-500 mt-0.5 capitalize">{auth?.role ?? "user"}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Full Name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User size={15} />}
                  required
                />
                <GlassInput
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={15} />}
                  required
                />
              </div>

              {/* Role — read only */}
              <div>
                <label className="block font-body text-xs text-gray-500 mb-1.5 ml-1 tracking-wide uppercase">
                  Role
                </label>
                <div
                  className="w-full sm:w-1/2 rounded-xl px-4 py-3 font-body text-sm border border-white/10 capitalize text-gray-500"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  {auth?.role ?? "—"}
                </div>
              </div>

              <div className="pt-1">
                <motion.button
                  type="submit"
                  disabled={loading || saved}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm transition-all"
                  style={{
                    background: saved
                      ? "rgba(0,229,160,0.12)"
                      : "linear-gradient(135deg, #00e5a0, #00c988)",
                    color: saved ? "#00e5a0" : "#05070E",
                    border: saved ? "1px solid rgba(0,229,160,0.25)" : "none",
                    boxShadow: saved ? "none" : "0 0 20px rgba(0,229,160,0.25)",
                  }}
                  whileHover={!saved ? { scale: 1.02, boxShadow: "0 0 28px rgba(0,229,160,0.4)" } : {}}
                  whileTap={!saved ? { scale: 0.97 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span key="saved" className="flex items-center gap-2"
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <CheckCircle2 size={15} /> Saved
                      </motion.span>
                    ) : loading ? (
                      <motion.span key="loading" className="flex items-center gap-2"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.span
                          className="w-3.5 h-3.5 border-2 border-[#05070E]/30 border-t-[#05070E] rounded-full inline-block"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                        />
                        Saving…
                      </motion.span>
                    ) : (
                      <motion.span key="idle" className="flex items-center gap-2"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Save size={15} /> Save changes
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>
          </Section>

          {/* ── Section 2: Security ── */}
          <Section
            title="Security"
            description="Manage your password and account access"
            delay={0.14}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={15} />}
                />
                <GlassInput
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={15} />}
                />
              </div>
              <div className="sm:w-1/2">
                <GlassInput
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={15} />}
                />
              </div>
              <div className="pt-1">
                <motion.button
                  type="button"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Lock size={14} />
                  Update password
                </motion.button>
              </div>
            </div>
          </Section>

          {/* ── Section 3: Preferences ── */}
          <Section
            title="Preferences"
            description="Customize your notifications and display settings"
            delay={0.2}
          >
            <div>
              <ToggleRow
                icon={<Bell size={15} />}
                label="Email Notifications"
                description="Receive updates about calls and tasks via email"
                defaultOn={true}
              />
              <ToggleRow
                icon={<Moon size={15} />}
                label="Dark Mode"
                description="Always enabled for this platform"
                defaultOn={true}
              />
              <ToggleRow
                icon={<Globe size={15} />}
                label="Language Detection"
                description="Auto-detect caller language for AI responses"
                defaultOn={true}
              />
            </div>
          </Section>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
