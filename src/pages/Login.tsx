import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, ShieldCheck, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import OrbBackground from "@/components/OrbBackground";
import GlassInput from "@/components/GlassInput";
import { getDashboardPath, type UserRole } from "@/utils/auth";
import { signIn } from "@/services/auth";

const Logo = () => (
  <span className="font-body font-semibold text-[var(--text-primary)] tracking-[0.15em] text-lg">
    CAREL
    <span className="relative">
      O
      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--red)]" />
    </span>
  </span>
);

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [role, setRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const { user, error: authError } = await signIn({ email, password, role });
    setLoading(false);
    if (authError || !user) {
      setError(authError ?? "Sign in failed. Please try again.");
      return;
    }
    navigate(getDashboardPath(role));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="grain-overlay" />
      <OrbBackground />

      {/* Back arrow */}
      <motion.button
        onClick={() => navigate("/signup")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 font-body text-sm text-white/50 hover:text-white/90 transition-colors"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={16} />
        Sign up
      </motion.button>

      <div className="relative z-10 w-full max-w-md">
        {/* Floating logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
        </motion.div>

        <motion.div
          className="rounded-2xl border border-white/10"
          style={{
            background: "rgba(10,13,22,0.75)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.07) inset, 0 32px 64px rgba(0,0,0,0.5)",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          {/* Top accent bar */}
          <div
            className="h-[2px] w-full rounded-t-2xl"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,229,160,0.5), transparent)",
            }}
          />

          <div className="p-8">
            {/* Registration success banner */}
            <AnimatePresence>
              {justRegistered && (
                <motion.div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-6 border"
                  style={{
                    background: "rgba(0,229,160,0.08)",
                    borderColor: "rgba(0,229,160,0.25)",
                  }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 size={15} style={{ color: "#00e5a0", flexShrink: 0 }} />
                  <p className="font-body text-xs text-[#00e5a0]">
                    Account created — sign in to continue.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.h1
              className="font-heading italic text-3xl text-white mb-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              Welcome back.
            </motion.h1>
            <motion.p
              className="font-body text-sm text-gray-400 mb-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Sign in to your workspace
            </motion.p>

            {/* Role selector */}
            <motion.div
              className="flex gap-2 mb-7"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
            >
              {(["admin", "employee"] as UserRole[]).map((r) => (
                <motion.button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setError(""); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-body text-xs font-medium border transition-all duration-200"
                  style={{
                    background: role === r ? "rgba(0,229,160,0.12)" : "rgba(255,255,255,0.05)",
                    borderColor: role === r ? "rgba(0,229,160,0.4)" : "rgba(255,255,255,0.12)",
                    color: role === r ? "#00e5a0" : "rgba(255,255,255,0.5)",
                    boxShadow: role === r ? "0 0 16px rgba(0,229,160,0.12)" : "none",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {r === "admin" ? <ShieldCheck size={13} /> : <Users size={13} />}
                  {r === "admin" ? "Admin" : "Employee"}
                </motion.button>
              ))}
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
              >
                <GlassInput
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  icon={<Mail size={15} />}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.33 }}
              >
                <GlassInput
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  icon={<Lock size={15} />}
                  required
                />
              </motion.div>

              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.36 }}
              >
                <a
                  href="#"
                  className="font-body text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Forgot password?
                </a>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    className="font-body text-xs text-red-400 text-center"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 font-body font-semibold text-sm"
                style={{
                  background: "linear-gradient(135deg, #00e5a0, #00c988)",
                  color: "#05070E",
                  boxShadow: loading ? "none" : "0 0 24px rgba(0,229,160,0.3)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 36px rgba(0,229,160,0.45)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="w-4 h-4 border-2 border-[#05070E]/30 border-t-[#05070E] rounded-full inline-block"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    />
                    Signing in…
                  </span>
                ) : (
                  "Sign in →"
                )}
              </motion.button>
            </form>

            <motion.p
              className="mt-6 text-center font-body font-light text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium hover:underline"
                style={{ color: "var(--red)" }}
              >
                Create one →
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
