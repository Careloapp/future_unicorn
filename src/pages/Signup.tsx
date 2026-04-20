import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, Lock, Building2, ShieldCheck, Users, ArrowLeft } from "lucide-react";
import OrbBackground from "@/components/OrbBackground";
import GlassInput from "@/components/GlassInput";
import { type UserRole } from "@/utils/auth";
import { signUp } from "@/services/auth";

const Logo = () => (
  <span className="font-body font-semibold text-[var(--text-primary)] tracking-[0.15em] text-lg">
    CAREL
    <span className="relative">
      O
      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--red)]" />
    </span>
  </span>
);

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("admin");
  const [form, setForm] = useState({
    fullName: "",
    agencyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error: authError } = await signUp({
      email: form.email,
      password: form.password,
      name: form.fullName,
      role,
    });
    setLoading(false);
    if (authError) {
      setError(authError);
      return;
    }
    // ✅ Do NOT log in — redirect to login with a success flag
    navigate("/login?registered=true");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="grain-overlay" />
      <OrbBackground />

      {/* Back arrow → landing */}
      <motion.button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 font-body text-sm text-white/50 hover:text-white/90 transition-colors"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={16} />
        Home
      </motion.button>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Card */}
        <div
          className="rounded-2xl border border-white/10"
          style={{
            background: "rgba(10,13,22,0.75)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.07) inset, 0 32px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-[2px] w-full rounded-t-2xl"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,229,160,0.5), transparent)",
            }}
          />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <Logo />
            </div>

            {/* Heading */}
            <motion.h1
              className="font-heading italic text-3xl text-white text-center mb-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              Create your account.
            </motion.h1>
            <motion.p
              className="font-body text-sm text-gray-400 text-center mb-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              Choose your role to get started
            </motion.p>

            {/* Role Toggle */}
            <motion.div
              className="relative flex rounded-xl p-1 mb-7 border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)" }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Sliding pill */}
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(0,229,160,0.18), rgba(0,229,160,0.06))",
                  border: "1px solid rgba(0,229,160,0.35)",
                  boxShadow: "0 0 20px rgba(0,229,160,0.1)",
                }}
                animate={{ left: role === "admin" ? 4 : "calc(50%)" }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
              <button
                type="button"
                onClick={() => setRole("admin")}
                className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-body text-sm font-medium transition-colors duration-200"
                style={{ color: role === "admin" ? "#00e5a0" : "rgba(255,255,255,0.4)" }}
              >
                <ShieldCheck size={15} />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("employee")}
                className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-body text-sm font-medium transition-colors duration-200"
                style={{ color: role === "employee" ? "#00e5a0" : "rgba(255,255,255,0.4)" }}
              >
                <Users size={15} />
                Employee
              </button>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <GlassInput
                  name="fullName"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={handleChange}
                  icon={<User size={15} />}
                  required
                />
              </motion.div>

              <AnimatePresence>
                {role === "admin" && (
                  <motion.div
                    key="agencyName"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <GlassInput
                      name="agencyName"
                      placeholder="Agency name"
                      value={form.agencyName}
                      onChange={handleChange}
                      icon={<Building2 size={15} />}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassInput
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  icon={<Mail size={15} />}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <GlassInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  icon={<Lock size={15} />}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassInput
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  icon={<Lock size={15} />}
                  required
                />
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
                className="relative w-full rounded-xl py-3 font-body font-semibold text-sm overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #00e5a0, #00c988)",
                  color: "#05070E",
                  boxShadow: loading ? "none" : "0 0 24px rgba(0,229,160,0.3)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 36px rgba(0,229,160,0.45)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="w-4 h-4 border-2 border-[#05070E]/30 border-t-[#05070E] rounded-full inline-block"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    />
                    Creating account…
                  </span>
                ) : (
                  `Create ${role === "admin" ? "Admin" : "Employee"} Account →`
                )}
              </motion.button>
            </form>

            <motion.p
              className="mt-6 text-center font-body font-light text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium hover:underline transition-colors"
                style={{ color: "var(--red)" }}
              >
                Sign in →
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
