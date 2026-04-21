import { motion } from "motion/react";

interface KPICardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon: React.ReactNode;
  accentColor?: string;
  delay?: number;
}

const KPICard = ({
  label,
  value,
  delta,
  deltaPositive = true,
  icon,
  accentColor = "rgba(0,229,160,0.6)",
  delay = 0,
}: KPICardProps) => {
  return (
    <motion.div
      className="relative rounded-2xl p-5 border border-white/8 overflow-hidden cursor-default"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -3,
        boxShadow: `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)`,
        transition: { duration: 0.2 },
      }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: `rgba(0,229,160,0.08)`,
          border: `1px solid rgba(0,229,160,0.15)`,
          color: accentColor,
        }}
      >
        {icon}
      </div>

      {/* Value */}
      <div className="font-heading italic text-3xl text-[var(--text-primary)] mb-1">
        {value}
      </div>

      {/* Label + delta */}
      <div className="flex items-center justify-between">
        <span className="font-body text-xs text-[var(--text-muted)]">{label}</span>
        {delta && (
          <span
            className="font-body text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{
              color: deltaPositive ? "#00e5a0" : "#f87171",
              background: deltaPositive ? "rgba(0,229,160,0.1)" : "rgba(248,113,113,0.1)",
            }}
          >
            {deltaPositive ? "↑" : "↓"} {delta}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default KPICard;
