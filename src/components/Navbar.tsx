import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-4 left-0 right-0 z-50 px-8 lg:px-16 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl bg-[var(--bg-base)]/70 border-b border-[var(--border-color)]" : ""
        }`}
      >
        <div className="flex items-center justify-between py-3">
          <a href="#" className="font-body font-semibold text-[var(--text-primary)] tracking-[0.15em] text-lg">
            CAREL<span className="relative">O<span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--red)]" /></span>
          </a>

          <div className="hidden md:flex items-center gap-1 liquid-glass rounded-full px-6 py-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group text-sm font-body font-normal text-white/80 px-3.5 py-1.5 rounded-full hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span className="w-1 h-1 rounded-full bg-[var(--red)] scale-0 group-hover:scale-100 transition-transform" />
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={() => navigate("/login")}
              className="font-body font-medium text-sm text-white/60 hover:text-white transition-colors"
              whileHover={{ opacity: 1 }}
              whileTap={{ scale: 0.97 }}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => navigate("/signup")}
              className="font-body font-semibold text-sm px-4 py-2 rounded-full flex items-center gap-1.5"
              style={{
                background: "linear-gradient(135deg, #00e5a0, #00c988)",
                color: "#05070E",
                boxShadow: "0 0 18px rgba(0,229,160,0.25)",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(0,229,160,0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              Sign Up
              <span>→</span>
            </motion.button>
          </div>

          <button className="md:hidden flex flex-col gap-1.5" onClick={() => setMobileOpen(true)}>
            <span className="w-5 h-[1.5px] bg-[var(--text-primary)]" />
            <span className="w-4 h-[1.5px] bg-[var(--text-primary)]" />
            <span className="w-3 h-[1.5px] bg-[var(--text-primary)]" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 bg-[var(--bg-card)] border-l border-[var(--border-color)] z-[70] p-8 flex flex-col gap-6"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <button className="self-end text-[var(--text-muted)] font-body text-sm" onClick={() => setMobileOpen(false)}>Close</button>
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="font-body text-lg text-[var(--text-primary)] hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
              <button onClick={() => { setMobileOpen(false); navigate("/login"); }} className="font-body text-lg text-white/70 hover:text-white transition-colors text-left">
                Login
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate("/signup"); }}
                className="font-body font-semibold text-sm px-5 py-3 rounded-full mt-4 text-left"
                style={{ background: "linear-gradient(135deg, #00e5a0, #00c988)", color: "#05070E" }}
              >
                Sign Up →
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
