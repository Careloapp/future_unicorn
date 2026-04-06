import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="grain-overlay" />
      <motion.div
        className="relative z-10 w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <span className="font-body font-semibold text-[var(--text-primary)] tracking-[0.15em] text-lg">
            CAREL<span className="relative">O<span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--red)]" /></span>
          </span>
        </div>

        <h1 className="font-heading italic text-3xl text-[var(--text-primary)] mb-8 text-center">
          Welcome back.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-[var(--border-bright)]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-[var(--border-bright)]"
            required
          />

          <button
            type="submit"
            className="w-full bg-[var(--red)] hover:bg-[#00c988] text-[#0a0f0a] rounded-xl py-3 font-body font-semibold text-sm transition-colors"
          >
            Login →
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="font-body font-light text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            Forgot password?
          </a>
        </div>

        <p className="mt-6 text-center font-body font-light text-sm text-[var(--text-muted)]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[var(--red)] font-medium hover:underline">
            Sign up →
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
