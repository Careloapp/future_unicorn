import { motion } from "motion/react";
import { Star } from "lucide-react";

interface PriorityToggleProps {
  priority: boolean;
  onToggle: () => void;
}

const PriorityToggle = ({ priority, onToggle }: PriorityToggleProps) => (
  <motion.button
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
    style={{
      background: priority ? "rgba(251,191,36,0.12)" : "transparent",
      color: priority ? "#fbbf24" : "rgba(255,255,255,0.2)",
    }}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.85 }}
    title={priority ? "Remove priority" : "Mark as priority"}
  >
    <Star
      size={14}
      fill={priority ? "#fbbf24" : "none"}
      strokeWidth={priority ? 0 : 1.5}
    />
  </motion.button>
);

export default PriorityToggle;
