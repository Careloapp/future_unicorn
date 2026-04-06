import { motion } from "motion/react";

const Proof = () => {
  return (
    <section className="py-24 px-8 lg:px-24 max-w-7xl mx-auto">
      <motion.span
        className="font-body font-medium text-xs tracking-[0.2em] uppercase text-[var(--amber)] block mb-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        PROOF
      </motion.span>
      <motion.h2
        className="font-heading italic text-3xl md:text-5xl text-[var(--text-primary)] mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Numbers don't lie. Neither does the system.
      </motion.h2>

      <motion.div
        className="flex flex-col md:flex-row gap-12 justify-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {[
          { value: "100%", color: "var(--red)", label: "Call Capture Rate" },
          { value: "< 2 min", color: "var(--amber)", label: "Transcription & Summary Time" },
          { value: "5", color: "var(--text-primary)", label: "Auto-classified Call Categories" },
        ].map((stat) => (
          <div key={stat.label} className="text-center flex-1">
            <span className="font-heading italic text-6xl md:text-8xl" style={{ color: stat.color }}>
              {stat.value}
            </span>
            <p className="font-body font-light text-sm text-[var(--text-muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Proof;
