import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./CurtainOverlay.css";

export default function CurtainOverlay({ phase, onStartReveal, onComplete }) {
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // Always force closed state on mount
    gsap.set(".curtain-left", { x: "0%" });
    gsap.set(".curtain-right", { x: "0%" });

    // ❌ Do nothing until phase === "curtains"
    if (phase !== "curtains") return;
    if (hasPlayedRef.current) return;

    hasPlayedRef.current = true;

    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    tl.to(".curtain-left", { x: "-115%", duration: 1.8 });
    tl.to(".curtain-right", { x: "115%", duration: 1.8 }, "<");

    // Start site reveal shortly after motion begins
    tl.call(() => onStartReveal?.(), [], 0.35);

    tl.call(() => onComplete?.());

    return () => tl.kill();
  }, [phase, onStartReveal, onComplete]);

  return (
    <div className="curtain-overlay">
      <div className="curtain curtain-left" />
      <div className="curtain curtain-right" />
    </div>
  );
}

