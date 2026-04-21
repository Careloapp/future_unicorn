import { motion } from "motion/react";
import Sidebar from "@/components/dashboard/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="grain-overlay" />

      {/* Ambient background — deep blue/indigo only, no green interference */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Indigo — top right corner */}
        <div className="dash-orb-indigo" />
        {/* Deep blue — bottom left corner */}
        <div className="dash-orb-blue" />
        {/* Charcoal center — very subtle depth */}
        <div className="dash-orb-charcoal" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <motion.main
        className="flex-1 ml-60 relative z-10 min-h-screen"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
