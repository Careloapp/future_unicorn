import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", agencyName: "", email: "", password: "", confirmPassword: "", role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  const inputClass = "w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-[var(--border-bright)]";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "var(--bg-base)" }}>
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
          Create your agency account.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className={inputClass} required />
          <input name="agencyName" placeholder="Agency Name" value={form.agencyName} onChange={handleChange} className={inputClass} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputClass} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className={inputClass} required />
          <select name="role" value={form.role} onChange={handleChange} className={`${inputClass} appearance-none`} required>
            <option value="">Role</option>
            <option value="owner">Owner</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>

          <button
            type="submit"
            className="w-full bg-[var(--red)] hover:bg-[#00c988] text-[#0a0f0a] rounded-xl py-3 font-body font-semibold text-sm transition-colors"
          >
            Create Account →
          </button>
        </form>

        <p className="mt-6 text-center font-body font-light text-sm text-[var(--text-muted)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--red)] font-medium hover:underline">
            Login →
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
