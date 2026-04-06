import { motion } from "motion/react";
import { Handshake, Heart, ClipboardList } from "lucide-react";

const cards = [
  {
    icon: Handshake,
    emoji: "🤝",
    label: "NEW CLIENT LEADS",
    quote: "Your best intake coordinator never sleeps, never misses a lead.",
    desc: "Carelo captures every new patient inquiry, qualifies the urgency, and routes it to your intake team instantly.",
    badges: ["3x more leads captured", "Instant routing"],
  },
  {
    icon: Heart,
    emoji: "💙",
    label: "EXISTING CLIENT ISSUES",
    quote: "Patient-first. Accurate. Urgent when it needs to be.",
    desc: "Carelo identifies existing client calls, flags urgency, and makes sure the right caregiver or coordinator is notified fast.",
    badges: ["Urgency detection", "Auto-assignment"],
  },
  {
    icon: ClipboardList,
    emoji: "📋",
    label: "CAREGIVER & ADMIN CALLS",
    quote: "Query answered. Task created. Nothing falls through.",
    desc: "Billing questions, scheduling changes, caregiver check-ins — every call gets captured and classified automatically.",
    badges: ["Smart classification", "Zero manual sorting"],
  },
];

const Industries = () => {
  return (
    <section id="industries" className="py-24 px-8 lg:px-24 max-w-7xl mx-auto">
      <motion.span
        className="font-body font-medium text-xs tracking-[0.2em] uppercase text-[var(--amber)] block mb-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        WHERE IT WORKS
      </motion.span>
      <motion.h2
        className="font-heading italic text-3xl md:text-5xl text-[var(--text-primary)] mb-12 max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Every home care call has a cost if it's missed.
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 hover:border-[var(--red)]/30 hover:-translate-y-1 transition-all"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{card.emoji}</span>
              <span className="font-body font-medium text-xs tracking-[0.15em] text-[var(--red)] uppercase">
                {card.label}
              </span>
            </div>
            <h3 className="font-heading italic text-lg text-[var(--text-primary)] mb-3">
              "{card.quote}"
            </h3>
            <p className="font-body font-light text-sm text-[var(--text-muted)] mb-4">
              {card.desc}
            </p>
            <div className="flex gap-2 flex-wrap">
              {card.badges.map((b) => (
                <span key={b} className="liquid-glass rounded-full px-3 py-1 text-xs font-body text-white/70">
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Industries;
