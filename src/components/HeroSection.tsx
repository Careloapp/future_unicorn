import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import VideoBackground from "./VideoBackground";
import PhoneMockup from "./PhoneMockup";

const tickerItems = [
  "Missed Call Capture",
  "AI Transcription",
  "Auto Classification",
  "Smart Assignment",
  "Callback Tracking",
  "SMS Alerts",
  "Dashboard Inbox",
  "Instant Setup",
];

const WaveformBars = () => (
  <span className="inline-flex items-center gap-[2px] h-4 ml-2">
    {[0, 1, 2, 3].map((i) => (
      <span
        key={i}
        className="w-[2px] bg-[var(--red)] rounded-full"
        style={{
          animation: `waveform-bar 0.6s ease-in-out ${i * 0.15}s infinite`,
          height: "4px",
        }}
      />
    ))}
  </span>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <VideoBackground
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
        poster="/images/hero_bg.jpeg"
      />
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 pt-24 pb-16">
        <PhoneMockup />

        <motion.span
          className="font-body font-medium text-xs tracking-[0.25em] uppercase text-[var(--red)] block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          LIVE · ALWAYS ON · ZERO MISSED CALLS
        </motion.span>

        <motion.h1
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic leading-[0.85] tracking-[-3px] text-white text-center"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Your Call Comes In.<br />
          We Capture It.<br />
          <span className="text-[var(--red)]">Every. Single. Time.</span>
        </motion.h1>

        <motion.p
          className="font-body font-light text-sm md:text-base text-white/60 text-center max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          Carelo is an AI-powered call capture system built for home care agencies. Every missed call is recorded, transcribed, classified, and assigned — so your team never loses a lead or a client again.
        </motion.p>

        <motion.div
          className="flex items-center gap-6 mt-2"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-sm font-body font-normal text-white/70 hover:text-white/90 transition-colors"
          >
            See How It Works
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
          <a
            href="#contact"
            className="group liquid-glass-strong rounded-full px-6 py-3 text-sm font-body font-medium text-[var(--text-primary)] flex items-center gap-1 hover:bg-white/10 transition-colors"
          >
            Book a Demo
            <WaveformBars />
          </a>
        </motion.div>

        <motion.div
          className="w-screen overflow-hidden mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="flex" style={{ animation: "marquee 30s linear infinite" }}>
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="flex-shrink-0 text-xs font-body font-light text-white/40 tracking-widest mx-6"
              >
                ✦ {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
