import { motion } from "motion/react";
import { Check } from "lucide-react";

const inclusions = [
  "Full dashboard setup included",
  "AI agent configuration included",
  "Call logs, transcripts, and alerts included",
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-8 lg:px-24 max-w-7xl mx-auto">
      <motion.span
        className="font-body font-medium text-xs tracking-[0.2em] uppercase text-[var(--amber)] block mb-4 text-center"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        SIMPLE PRICING
      </motion.span>
      <motion.h2
        className="font-heading italic text-4xl md:text-5xl text-[var(--text-primary)] mb-3 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Built around your call volume. Priced around your agency's growth.
      </motion.h2>
      <motion.p
        className="font-body font-light text-[var(--text-muted)] mb-16 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        No bloated software. No per-seat madness. Tell us your call volume and we'll show you exactly what Carelo costs — and what a missed call actually costs you.
      </motion.p>

      <motion.div
        className="max-w-2xl mx-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-10 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="font-heading italic text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
          Get a Custom Quote
        </h3>
        <p className="font-body font-light text-[var(--text-muted)] mb-8 max-w-lg mx-auto">
          Every agency has different call volume, different needs, different workflows. Tell us yours — we'll give you a straight answer.
        </p>

        <a
          href="#contact"
          className="inline-block bg-[var(--red)] hover:bg-[#00c988] text-[#0a0f0a] rounded-xl px-8 py-3 font-body font-semibold text-sm transition-colors mb-6"
        >
          Get a Custom Quote →
        </a>

        <p className="font-body font-light text-xs text-[var(--text-muted)] mb-8">
          No commitment. No sales pressure. Just a straight answer.
        </p>

        <div className="space-y-3 text-left max-w-md mx-auto">
          {inclusions.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[var(--red)] mt-0.5 flex-shrink-0" />
              <span className="font-body font-light text-sm text-[var(--text-primary)]">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Pricing;
