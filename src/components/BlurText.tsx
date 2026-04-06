import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  highlightWord?: string;
  highlightColor?: string;
}

const BlurText = ({ text, className, delay = 0, highlightWord, highlightColor = "var(--red)" }: BlurTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  if (!text) return null;
  const words = text.split(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("flex flex-wrap justify-center", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.3em] transition-all duration-700 ease-out"
          style={{
            transitionDelay: `${delay + i * 100}ms`,
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? "blur(0px)" : "blur(10px)",
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            color: highlightWord && word.replace(/[^a-zA-Z]/g, "") === highlightWord ? highlightColor : undefined,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default BlurText;
