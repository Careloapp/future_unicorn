import type { CallStatus } from "@/utils/auditLog";

const config: Record<CallStatus, { label: string; color: string; bg: string; border: string }> = {
  new: {
    label: "New",
    color: "#93c5fd",
    bg: "rgba(147,197,253,0.08)",
    border: "rgba(147,197,253,0.2)",
  },
  in_progress: {
    label: "In Progress",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
  },
  resolved: {
    label: "Resolved",
    color: "#00e5a0",
    bg: "rgba(0,229,160,0.08)",
    border: "rgba(0,229,160,0.2)",
  },
};

const StatusBadge = ({ status }: { status: CallStatus }) => {
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-[11px] font-medium whitespace-nowrap"
      style={{
        color: c.color,
        background: c.bg,
        border: `1px solid ${c.border}`,
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

export default StatusBadge;
