import type { Sentiment } from "@/utils/auditLog";

const config: Record<Sentiment, { label: string; color: string; bg: string; border: string; glow?: string }> = {
  positive: {
    label: "Positive",
    color: "#00e5a0",
    bg: "rgba(0,229,160,0.08)",
    border: "rgba(0,229,160,0.2)",
  },
  neutral: {
    label: "Neutral",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.2)",
  },
  urgent: {
    label: "Urgent",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.25)",
    glow: "0 0 10px rgba(248,113,113,0.2)",
  },
};

const SentimentBadge = ({ sentiment }: { sentiment: Sentiment }) => {
  const c = config[sentiment];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-[11px] font-medium whitespace-nowrap"
      style={{
        color: c.color,
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: c.glow,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: c.color }}
      />
      {c.label}
    </span>
  );
};

export default SentimentBadge;
