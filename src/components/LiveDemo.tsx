import { motion } from "motion/react";
import { Mic } from "lucide-react";
import { useState } from "react";

type VoiceStatus = "idle" | "listening" | "thinking" | "speaking";

const statusLabels: Record<VoiceStatus, string> = {
  idle: "Ready to talk...",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
};

const LiveDemo = () => {
  const [selectedVoice, setSelectedVoice] = useState<"m" | "f">("m");
  const [status] = useState<VoiceStatus>("idle");
  const [sessionsRemaining] = useState(2);

  if (sessionsRemaining <= 0) {
    return (
      <section id="demo" className="py-24 px-8 lg:px-24 text-center">
        <h2 className="font-heading italic text-4xl text-[var(--text-primary)] mb-6">
          Loved it? Let's make it yours.
        </h2>
        <a href="#contact" className="inline-block bg-[var(--red)] hover:bg-[#00c988] text-[#0a0f0a] rounded-xl px-8 py-3 font-body font-semibold text-sm transition-colors">
          Contact Us →
        </a>
      </section>
    );
  }

  return (
    <section id="demo" className="py-24 px-8 lg:px-24 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.span
          className="font-body font-medium text-xs tracking-[0.2em] uppercase text-[var(--red)] block mb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          LIVE · RIGHT NOW
        </motion.span>
        <motion.h2
          className="font-heading italic text-4xl md:text-6xl text-[var(--text-primary)] mb-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Stop reading. Start hearing.
        </motion.h2>
        <motion.p
          className="font-body font-light text-[var(--text-muted)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Two free conversations. No signup. No friction. Just press and speak.
        </motion.p>
      </div>

      <motion.div
        className="max-w-[580px] mx-auto bg-[var(--bg-card)] border border-[var(--border-bright)] rounded-3xl p-8 liquid-glass"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="font-body font-medium text-xs tracking-[0.15em] text-[var(--text-primary)]">EDUVOX</span>
          <span className="font-body font-medium text-xs text-[var(--text-muted)]">·</span>
          <span className="font-body font-medium text-xs text-[var(--text-primary)]">ONLINE</span>
          <span className="w-2 h-2 rounded-full bg-green-500" style={{ animation: "pulse-dot 2s infinite" }} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            className={`rounded-xl p-4 text-left border transition-colors ${
              selectedVoice === "m" ? "border-[var(--red)] bg-[var(--red)]/10" : "border-[var(--border-color)] hover:border-[var(--border-bright)]"
            }`}
            onClick={() => setSelectedVoice("m")}
          >
            <span className="font-body font-medium text-xs tracking-[0.1em] text-[var(--red)]">MIRRIN · M</span>
          </button>
          <button
            className={`rounded-xl p-4 text-left border transition-colors ${
              selectedVoice === "f" ? "border-[var(--amber)] bg-[var(--amber)]/10" : "border-[var(--border-color)] hover:border-[var(--border-bright)]"
            }`}
            onClick={() => setSelectedVoice("f")}
          >
            <span className="font-body font-medium text-xs tracking-[0.1em] text-[var(--amber)]">MIRRIN · F</span>
          </button>
        </div>

        <p className="font-body font-light text-xs text-white/40 text-center mb-6">
          Speaks multiple languages — just talk.
        </p>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            {status === "listening" && (
              <>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="absolute inset-0 rounded-full border border-[var(--red)]/60"
                    style={{ animation: `ripple 1.2s ease-out ${i * 0.4}s infinite` }} />
                ))}
              </>
            )}
            <button className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
              status === "idle" ? "bg-[var(--bg-elevated)] border-2 border-[var(--red)]"
              : status === "listening" ? "bg-[var(--red)]"
              : status === "thinking" ? "bg-[var(--amber)]"
              : "bg-[var(--red)]"
            }`}>
              {status === "speaking" ? (
                <span className="flex items-center gap-[3px]">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="w-[3px] bg-white rounded-full"
                      style={{ animation: `waveform-bar 0.5s ease-in-out ${i * 0.1}s infinite`, height: "8px" }} />
                  ))}
                </span>
              ) : (
                <Mic className="w-7 h-7 text-white" />
              )}
            </button>
          </div>
          <span className="font-body font-light text-sm text-[var(--text-muted)]">{statusLabels[status]}</span>
        </div>

        <div className="mb-4">
          <span className="font-body font-medium text-[10px] tracking-[0.15em] text-[var(--text-muted)] block mb-2">TRANSCRIPT</span>
          <div className="bg-[var(--bg-base)] rounded-xl p-4 min-h-[60px]">
            <p className="font-body font-light text-sm text-[var(--text-muted)]">...</p>
          </div>
        </div>

        <div className="mb-4">
          <span className="font-body font-medium text-[10px] tracking-[0.15em] text-[var(--red)] block mb-2">EDUVOX</span>
          <div className="bg-[var(--bg-base)] rounded-xl p-4 min-h-[60px]">
            <p className="font-body font-light text-sm text-[var(--text-muted)]">...</p>
          </div>
        </div>

        <p className="font-body font-light text-xs text-white/30 text-center">
          {sessionsRemaining} conversations remaining
        </p>
      </motion.div>

      <p className="font-body font-light text-xs text-white/25 text-center mt-6">
        No account needed · Sessions are private · Powered by proprietary voice AI
      </p>
    </section>
  );
};

export default LiveDemo;
