const OrbBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Purple orb — top left */}
    <div
      className="absolute rounded-full opacity-20"
      style={{
        width: 600,
        height: 600,
        top: "-15%",
        left: "-10%",
        background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
        filter: "blur(120px)",
      }}
    />
    {/* Teal orb — center right */}
    <div
      className="absolute rounded-full opacity-15"
      style={{
        width: 500,
        height: 500,
        top: "30%",
        right: "-8%",
        background: "radial-gradient(circle, #00e5a0 0%, transparent 70%)",
        filter: "blur(120px)",
      }}
    />
    {/* Blue orb — bottom left */}
    <div
      className="absolute rounded-full opacity-15"
      style={{
        width: 450,
        height: 450,
        bottom: "-10%",
        left: "20%",
        background: "radial-gradient(circle, #2563eb 0%, transparent 70%)",
        filter: "blur(120px)",
      }}
    />
  </div>
);

export default OrbBackground;
