import { motion } from "motion/react";
import { MOCK_STAFF } from "@/utils/auditLog";
import { SlidersHorizontal } from "lucide-react";

export type FilterType = "all" | "unassigned" | "urgent" | string; // string = staff name

interface FilterBarProps {
  active: FilterType;
  onChange: (f: FilterType) => void;
  counts: { all: number; unassigned: number; urgent: number };
}

const STATIC_FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unassigned", label: "Unassigned" },
  { key: "urgent", label: "Urgent" },
];

const FilterBar = ({ active, onChange, counts }: FilterBarProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-gray-500 mr-1">
        <SlidersHorizontal size={13} />
        <span className="font-body text-xs">Filter</span>
      </div>

      {STATIC_FILTERS.map(({ key, label }) => {
        const isActive = active === key;
        const count = counts[key as keyof typeof counts];
        return (
          <motion.button
            key={key}
            onClick={() => onChange(key)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs font-medium border transition-all duration-150"
            style={{
              background: isActive ? "rgba(0,229,160,0.1)" : "rgba(255,255,255,0.04)",
              borderColor: isActive ? "rgba(0,229,160,0.35)" : "rgba(255,255,255,0.08)",
              color: isActive ? "#00e5a0" : "rgba(255,255,255,0.45)",
              boxShadow: isActive ? "0 0 12px rgba(0,229,160,0.1)" : "none",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            {label}
            {count > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  background: isActive ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.08)",
                  color: isActive ? "#00e5a0" : "rgba(255,255,255,0.4)",
                }}
              >
                {count}
              </span>
            )}
          </motion.button>
        );
      })}

      {/* Divider */}
      <div className="w-px h-4 bg-white/10 mx-1" />

      {/* Staff filters */}
      {MOCK_STAFF.map((name) => {
        const isActive = active === name;
        const initials = name.split(" ").map((n) => n[0]).join("");
        return (
          <motion.button
            key={name}
            onClick={() => onChange(isActive ? "all" : name)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-body text-xs font-medium border transition-all duration-150"
            style={{
              background: isActive ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.04)",
              borderColor: isActive ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.08)",
              color: isActive ? "#a78bfa" : "rgba(255,255,255,0.45)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{
                background: isActive ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.08)",
              }}
            >
              {initials}
            </span>
            {name}
          </motion.button>
        );
      })}
    </div>
  );
};

export default FilterBar;
