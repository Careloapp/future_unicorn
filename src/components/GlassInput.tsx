import { forwardRef, InputHTMLAttributes } from "react";
import { motion } from "motion/react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, icon, className = "", ...props }, ref) => {
    return (
      <div className="relative group">
        {label && (
          <label className="block font-body text-xs text-[var(--text-muted)] mb-1.5 ml-1 tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--red)] transition-colors duration-200">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full
              bg-white/10
              border border-white/20
              group-focus-within:border-[var(--red)]/60
              group-focus-within:bg-white/12
              rounded-xl
              px-4 py-3
              ${icon ? "pl-10" : ""}
              text-white
              placeholder:text-white/35
              font-body text-sm
              focus:outline-none
              focus:ring-1 focus:ring-[rgba(0,229,160,0.3)]
              transition-all duration-200
              shadow-inner
              ${className}
            `}
            {...props}
          />
          {/* Focus glow line */}
          <motion.div
            className="absolute bottom-0 left-1/2 h-[1px] bg-[var(--red)] rounded-full opacity-0 group-focus-within:opacity-100"
            initial={{ width: 0, x: "-50%" }}
            whileFocus={{ width: "80%" }}
            style={{ originX: "50%" }}
          />
        </div>
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

export default GlassInput;
