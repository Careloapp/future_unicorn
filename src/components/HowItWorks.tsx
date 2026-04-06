import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Mic, Brain, Calendar } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Mic,
    title: "The Call Arrives",
    body: "A patient or family member calls your agency. If no one picks up, Carelo steps in instantly. No voicemail black hole. No missed opportunity.",
  },
  {
    num: "02",
    icon: Brain,
    title: "AI Takes Over",
    body: "Carelo greets the caller, collects their name, reason for calling, and urgency. The audio is recorded, transcribed, and summarized automatically.",
  },
  {
    num: "03",
    icon: Calendar,
    title: "Your Team Acts",
    body: "The right staff member gets an SMS alert with a full AI summary. They open the dashboard, see everything, and mark it done once they call back.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 px-8 lg:px-24 max-w-7xl mx-auto" ref={sectionRef}>
      <motion.span
        className="font-body font-medium text-xs tracking-[0.2em] uppercase text-[var(--amber)] block mb-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        THE PROCESS
      </motion.span>
      <motion.h2
        className="font-heading italic text-4xl md:text-5xl text-[var(--text-primary)] mb-3"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Three moments. Zero missed calls.
      </motion.h2>
      <motion.p
        className="font-body font-light text-[var(--text-muted)] mb-16 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        From the first ring to the completed callback — fully handled.
      </motion.p>

      <div className="relative">
        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" preserveAspectRatio="none">
          <motion.line
            x1="15%" y1="15%" x2="50%" y2="50%"
            stroke="var(--red)" strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.line
            x1="50%" y1="50%" x2="85%" y2="85%"
            stroke="var(--red)" strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
          />
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                className="relative"
                style={{
                  marginTop: i === 0 ? 0 : i === 1 ? "60px" : "120px",
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="absolute -top-12 -left-4 font-heading italic text-[140px] leading-none text-white opacity-[0.04] select-none pointer-events-none">
                  {step.num}
                </span>

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[var(--red)]/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[var(--red)]" />
                  </div>
                  <h3 className="font-heading italic text-xl text-[var(--text-primary)] mb-2">{step.title}</h3>
                  <p className="font-body font-light text-sm text-[var(--text-muted)] max-w-[280px]">{step.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
