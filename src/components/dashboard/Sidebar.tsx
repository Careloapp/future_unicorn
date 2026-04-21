import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  PhoneCall,
  BarChart3,
  Settings,
  User,
  CheckSquare,
  TrendingUp,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { getAuth } from "@/utils/auth";
import { signOut } from "@/services/auth";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={16} />, to: "/dashboard/admin" },
  { label: "Audit Log", icon: <ClipboardList size={16} />, to: "/dashboard/admin/audit" },
  { label: "Call Logs", icon: <PhoneCall size={16} />, to: "/dashboard/admin/calls" },
  { label: "Analytics", icon: <BarChart3 size={16} />, to: "/dashboard/admin/analytics" },
  { label: "Settings", icon: <Settings size={16} />, to: "/dashboard/admin/settings" },
  { label: "Profile", icon: <User size={16} />, to: "/dashboard/admin/profile" },
];

const staffNav: NavItem[] = [
  { label: "My Tasks", icon: <CheckSquare size={16} />, to: "/dashboard/staff" },
  { label: "My Queue", icon: <ClipboardList size={16} />, to: "/dashboard/staff/audit" },
  { label: "Performance", icon: <TrendingUp size={16} />, to: "/dashboard/staff/performance" },
  { label: "Settings", icon: <Settings size={16} />, to: "/dashboard/staff/settings" },
  { label: "Profile", icon: <User size={16} />, to: "/dashboard/staff/profile" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const isAdmin = auth?.role === "admin";
  const navItems = isAdmin ? adminNav : staffNav;

  const handleLogout = () => {
    signOut().then(() => navigate("/login"));
  };

  const initials = auth?.name
    ? auth.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <motion.aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-40 border-r border-white/8"
      style={{
        background: "rgba(5,7,14,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/8">
        <span className="font-body font-semibold text-[var(--text-primary)] tracking-[0.15em] text-base">
          CAREL
          <span className="relative">
            O
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--red)]" />
          </span>
        </span>
        <div className="mt-1">
          <span
            className="font-body text-[10px] font-medium px-2 py-0.5 rounded-full border"
            style={{
              color: "var(--red)",
              borderColor: "rgba(0,229,160,0.3)",
              background: "rgba(0,229,160,0.08)",
            }}
          >
            {isAdmin ? "Admin" : "Employee"}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i + 0.1 }}
          >
            <NavLink
              to={item.to}
              end={item.to === "/dashboard/admin" || item.to === "/dashboard/staff"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-150 group ${
                  isActive
                    ? "text-[var(--red)] bg-[rgba(0,229,160,0.08)] border border-[rgba(0,229,160,0.15)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="transition-colors duration-150"
                    style={{ color: isActive ? "var(--red)" : undefined }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="ml-auto w-1 h-1 rounded-full"
                      style={{ background: "var(--red)" }}
                      layoutId="activeIndicator"
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/8 space-y-2">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-semibold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(0,229,160,0.3), rgba(0,229,160,0.1))",
              border: "1px solid rgba(0,229,160,0.3)",
              color: "var(--red)",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-body text-xs font-medium text-[var(--text-primary)] truncate">
              {auth?.name || "User"}
            </p>
            <p className="font-body text-[10px] text-[var(--text-muted)] truncate">
              {auth?.email || ""}
            </p>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/8 transition-all duration-150"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
        >
          <LogOut size={15} />
          Sign out
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
