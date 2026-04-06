import { useEffect, useState } from "react";
import { Mic, MicOff, Volume2, PhoneOff } from "lucide-react";

const PhoneMockup = () => {
  const [seconds, setSeconds] = useState(42);
  const [statusText, setStatusText] = useState("Responding...");

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const toggle = setInterval(() => {
      setStatusText((prev) => (prev === "Listening..." ? "Responding..." : "Listening..."));
    }, 3000);
    return () => clearInterval(toggle);
  }, []);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative w-[220px] sm:w-[260px] mx-auto">
      <div className="absolute -inset-10 z-[-1] rounded-full bg-[#00e5a0]/10 blur-3xl" />

      <div className="relative rounded-[44px] border-[3px] border-white/20 overflow-hidden shadow-2xl">
        <div className="bg-[#0a0f0a] aspect-[9/19.5] p-4 flex flex-col items-center justify-between">
          <div className="flex items-center justify-between text-[10px] text-white/60 px-1 w-full">
            <span className="font-body font-light">23:00</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 rounded-sm border border-white/40 flex items-center justify-end pr-[1px]">
                <div className="w-2.5 h-1 rounded-[1px] bg-white/70" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="font-body font-semibold text-xs tracking-[0.2em] text-[var(--text-primary)]">CARELO</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
            </div>
            <span className="font-body font-light text-[10px] text-white/40">AI Call Capture</span>
          </div>

          <div className="flex-1 flex items-center justify-center w-full">
            <div className="flex items-center gap-[3px] h-12">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className="w-[2px] rounded-full bg-[#00e5a0]"
                  style={{
                    animation: `phone-wave 1.8s ease-in-out ${i * 0.09}s infinite`,
                    height: "6px",
                  }}
                />
              ))}
            </div>
          </div>

          <span className="font-mono text-lg text-white tracking-widest">
            {mins}:{secs}
          </span>

          <span className="font-body font-light text-[10px] text-[#00e5a0]/60 mt-1 transition-opacity duration-700">
            {statusText}
          </span>

          <div className="flex items-center gap-6 mt-6 mb-2">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <MicOff className="w-4 h-4 text-white/50" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-white/50" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#3a2020] flex items-center justify-center">
              <PhoneOff className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
