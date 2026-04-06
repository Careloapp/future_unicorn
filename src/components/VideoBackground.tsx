import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoBackgroundProps {
  src: string;
  poster?: string;
}

const VideoBackground = ({ src, poster }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (src.endsWith(".m3u8") && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => hls.destroy();
    } else {
      video.src = src;
      video.play().catch(() => {});
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover z-0"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
    />
  );
};

export default VideoBackground;
