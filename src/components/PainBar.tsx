import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useRef, useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
}

const AnimatedNumber = ({ value, prefix = "", suffix = "", color }: AnimatedNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [spring]);

  return (
    <span ref={ref} className="font-heading italic text-5xl md:text-6xl" style={{ color }}>
      {prefix}{display}{suffix}
    </span>
  );
};

const stats = [
  { value: 22, suffix: "%", color: "var(--red)", label: "of home care calls go unanswered during business hours" },
  { value: 60, suffix: "%", color: "var(--amber)", label: "of missed callers never call back — they call your competitor" },
];

const PainBar = () => {
  return (
    <section id="about" className="w-full bg-[var(--bg-card)] border-y border-[var(--border-color)] py-10">
      <div className="max-w-7xl mx-auto px-8 mb-4">
        <motion.span
          className="font-body font-medium text-xs tracking-[0.2em] uppercase text-[var(--amber)] block mb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          THE PROBLEM
        </motion.span>
        <motion.h2
          className="font-heading italic text-3xl md:text-4xl text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          The calls your agency can't afford to miss.
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className={`flex flex-col items-center text-center py-6 px-4 ${
              i < stats.length - 1 ? "sm:border-r border-[var(--border-color)]" : ""
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
          >
            <AnimatedNumber
              value={stat.value}
              suffix={stat.suffix}
              color={stat.color}
            />
            <p className="font-body font-light text-sm text-white/50 mt-2 max-w-[280px]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="max-w-7xl mx-auto px-8 font-body font-light text-sm text-[var(--text-muted)] mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Every missed call is a potential client, a worried family member, or a caregiver in need. Missing it doesn't just cost a callback — it costs the relationship.
      </motion.p>
    </section>
  );
};

export default PainBar;
