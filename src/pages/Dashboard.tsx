import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="grain-overlay" />
      <div className="relative z-10 text-center">
        <span className="font-body font-semibold text-[var(--text-primary)] tracking-[0.15em] text-lg block mb-8">
          CAREL<span className="relative">O<span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--red)]" /></span>
        </span>
        <h1 className="font-heading italic text-4xl text-[var(--text-primary)] mb-4">Dashboard</h1>
        <p className="font-body font-light text-[var(--text-muted)] mb-8">
          Your call capture dashboard is coming soon.
        </p>
        <Link to="/" className="font-body font-medium text-sm text-[var(--red)] hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
