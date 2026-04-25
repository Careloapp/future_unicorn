import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { handleGoogleCallback } from "@/services/auth";
import { getDashboardPath, type UserRole } from "@/utils/auth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    // Prevent double-firing in React StrictMode
    if (called.current) return;
    called.current = true;

    const role = (searchParams.get("role") as UserRole | null) ?? "admin";

    handleGoogleCallback(role).then(({ user, error }) => {
      if (error || !user) {
        // Something went wrong — send to login with an error flag
        navigate("/login?error=google_failed", { replace: true });
        return;
      }
      navigate(getDashboardPath(user.role), { replace: true });
    });
  }, [navigate, searchParams]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="grain-overlay" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Spinning ring */}
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-[var(--red)]/20 border-t-[var(--red)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
        <p className="font-body text-sm text-[var(--text-muted)]">
          Signing you in with Google…
        </p>
      </motion.div>
    </div>
  );
};

export default AuthCallback;