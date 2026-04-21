import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Search, X, UserCheck } from "lucide-react";
import { MOCK_STAFF } from "@/utils/auditLog";

interface AssignDropdownProps {
  assignedTo: string | null;
  onAssign: (name: string | null) => void;
}

const AssignDropdown = ({ assignedTo, onAssign }: AssignDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = MOCK_STAFF.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (name: string | null) => {
    onAssign(name);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-body text-xs font-medium border transition-all duration-150 max-w-[140px]"
        style={
          assignedTo
            ? {
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.8)",
              }
            : {
                background: "rgba(248,113,113,0.06)",
                borderColor: "rgba(248,113,113,0.2)",
                color: "#f87171",
              }
        }
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {assignedTo ? (
          <>
            <UserCheck size={11} className="flex-shrink-0" />
            <span className="truncate">{assignedTo}</span>
          </>
        ) : (
          <span className="audit-pulse">Unassigned</span>
        )}
        <ChevronDown
          size={11}
          className="flex-shrink-0 ml-auto transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full mt-1.5 left-0 z-50 w-48 rounded-xl border border-white/12 overflow-hidden"
            style={{
              background: "rgba(10,13,22,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset",
            }}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Search */}
            <div className="px-3 py-2 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Search size={11} className="text-gray-500 flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search staff…"
                  className="flex-1 bg-transparent font-body text-xs text-white placeholder:text-gray-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Options */}
            <div className="py-1 max-h-44 overflow-y-auto">
              {/* Unassign option */}
              {assignedTo && (
                <button
                  onClick={() => handleSelect(null)}
                  className="w-full flex items-center gap-2 px-3 py-2 font-body text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/8 transition-colors text-left"
                >
                  <X size={11} />
                  Remove assignment
                </button>
              )}

              {filtered.length === 0 ? (
                <p className="px-3 py-3 font-body text-xs text-gray-600 text-center">
                  No staff found
                </p>
              ) : (
                filtered.map((name) => (
                  <motion.button
                    key={name}
                    onClick={() => handleSelect(name)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 font-body text-xs text-left transition-colors"
                    style={{
                      color: assignedTo === name ? "#00e5a0" : "rgba(255,255,255,0.75)",
                      background: assignedTo === name ? "rgba(0,229,160,0.06)" : "transparent",
                    }}
                    whileHover={{
                      background: assignedTo === name
                        ? "rgba(0,229,160,0.1)"
                        : "rgba(255,255,255,0.04)",
                    }}
                  >
                    {/* Avatar */}
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        color: assignedTo === name ? "#00e5a0" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    {name}
                    {assignedTo === name && (
                      <span className="ml-auto text-[#00e5a0]">✓</span>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignDropdown;
