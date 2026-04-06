import { useRef, useEffect } from "react";

interface VoiceOrbProps {
  colorScheme: "red" | "amber";
  isHovered: boolean;
  isSpeaking?: boolean;
}

const VoiceOrb = ({ colorScheme, isHovered, isSpeaking = false }: VoiceOrbProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([]);

  const color = colorScheme === "red" ? "#00b37a" : "#00e5a0";
  const radii = colorScheme === "red" ? [60, 90, 120] : [70, 105, 140];
  const dotsPerRing = [14, 18, 22];
  const baseSpeeds = [0.008, 0.005, 0.003];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 260;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let prevHovered = false;
    let animId: number;

    const draw = () => {
      frameRef.current++;
      const frame = frameRef.current;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const speedMul = isHovered ? 3 : 1;
      const dotOpacity = isHovered ? 1.0 : 0.4;
      const dotRadius = isHovered ? 3 : 2;

      // Spawn burst particles on hover enter
      if (isHovered && !prevHovered) {
        for (let p = 0; p < 20; p++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          particlesRef.current.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
          });
        }
      }
      prevHovered = isHovered;

      // Draw rings
      radii.forEach((baseR, ri) => {
        const r = isSpeaking ? baseR + Math.sin(frame * 0.05 + ri) * 10 : baseR;
        const dots = dotsPerRing[ri];
        const speed = baseSpeeds[ri] * speedMul;

        for (let d = 0; d < dots; d++) {
          const angle = (d / dots) * Math.PI * 2 + frame * speed;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = dotOpacity;
          ctx.fill();
        }
      });

      // Center core
      ctx.globalAlpha = 0.6 + Math.sin(frame * 0.05) * 0.4;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Burst particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) return false;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, isSpeaking, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[260px] h-[260px]"
      style={{ width: 260, height: 260 }}
    />
  );
};

export default VoiceOrb;
