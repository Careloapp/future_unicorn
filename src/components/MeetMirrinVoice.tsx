import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VoiceOrb from "./VoiceOrb";
import { Brain, Globe } from "lucide-react";

const features = [
  { icon: Brain, title: "Contextual Intelligence", desc: "Understands the full conversation, not just the last sentence." },
  { icon: Globe, title: "Multiple Languages", desc: "Speaks to every caller in the language they're most comfortable with." },
];

const MeetMirrinVoice = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <section id="meet-agent" className="py-24 px-8 lg:px-24 max-w-7xl mx-auto">
      <motion.span
        className="font-body font-medium text-xs tracking-[0.2em] uppercase text-[var(--amber)] block mb-4 text-center"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        THE AGENT
      </motion.span>
      <motion.h2
        className="font-heading italic text-4xl md:text-5xl text-[var(--text-primary)] mb-3 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        One voice. One intelligence.
      </motion.h2>
      <motion.p
        className="font-body font-light text-[var(--text-muted)] mb-16 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Carelo speaks in a warm, professional voice — multilingual, always available, never puts anyone on hold.
      </motion.p>

      <motion.div
        className="max-w-md mx-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 flex flex-col items-center mb-12 cursor-pointer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        whileHover={{ y: -4, boxShadow: "0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,229,160,0.15)" }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate("/signup")}
      >
        <span className="font-body font-medium text-xs tracking-[0.2em] mb-6 text-[var(--red)]">
          CARELO AI
        </span>
        <VoiceOrb colorScheme="amber" isHovered={hovered} />
        <p className="font-body font-light text-sm text-white/50 mt-4 mb-4">Warm · Professional · Always On</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {["Home Care", "Multilingual", "Lead Capture", "Caregiver Support"].map((p) => (
            <span key={p} className="liquid-glass rounded-full px-3 py-1 text-xs font-body text-white/70">
              {p}
            </span>
          ))}
        </div>
        <motion.span
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(135deg, #00e5a0, #00c988)",
            color: "#05070E",
            boxShadow: "0 0 20px rgba(0,229,160,0.3)",
          }}
        >
          Hear Carelo ↗
        </motion.span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              className="bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl p-4 hover:border-[var(--amber)]/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Icon className="w-5 h-5 text-[var(--amber)] mb-2" />
              <h4 className="font-body font-medium text-sm text-[var(--text-primary)] mb-1">{f.title}</h4>
              <p className="font-body font-light text-xs text-[var(--text-muted)]">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default MeetMirrinVoice;
