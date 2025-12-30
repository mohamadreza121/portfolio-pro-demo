import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Preloader.css";

/* =====================================================
   PRELOADER TIMING CONSTANTS (STABLE)
===================================================== */
const TOTAL_PULSES = 5;
const PULSE_DURATION = 0.6;
const TOTAL_PULSE_TIME = TOTAL_PULSES * PULSE_DURATION * 2;

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* =========================================
       PRELOADER-ONLY THEME (ISOLATED)
       ========================================= */
    let currentTheme = "night";
    container.setAttribute("data-preloader-theme", currentTheme);

    const progress = { value: 0 };

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    /* =========================================
       INITIAL STATE
       ========================================= */
    gsap.set(container, { opacity: 1 });
    gsap.set(titleRef.current, { opacity: 0, scale: 0.95 });

    /* =========================================
       TITLE PULSES (LOCAL THEME TOGGLE)
       ========================================= */
    for (let i = 0; i < TOTAL_PULSES; i++) {
      tl.to(titleRef.current, {
        opacity: 1,
        scale: 1,
        duration: PULSE_DURATION,
      });

      tl.to(titleRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: PULSE_DURATION,
      });

      if (i < TOTAL_PULSES - 1) {
        tl.call(() => {
          currentTheme = currentTheme === "night" ? "day" : "night";
          container.setAttribute("data-preloader-theme", currentTheme);
        });
      }
    }

    /* =========================================
       PROGRESS COUNTER (SYNCED)
       ========================================= */
    tl.to(
      progress,
      {
        value: 100,
        duration: TOTAL_PULSE_TIME,
        onUpdate: () => {
          if (progressRef.current) {
            progressRef.current.textContent = `${Math.round(progress.value)}%`;
          }
        },
      },
      0
    );

    /* =========================================
       FADE OUT PRELOADER COMPLETELY
       ========================================= */
    tl.to(container, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    /* =========================================
       SIGNAL COMPLETION (HAND OFF TO CURTAINS)
       ========================================= */
    tl.call(() => {
      onComplete?.();
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div className="preloader" ref={containerRef}>
      <h1 className="preloader-title" ref={titleRef}>
        Welcome to My Portfolio
      </h1>

      <div className="preloader-progress">
        loading… <span ref={progressRef}>0%</span>
      </div>
    </div>
  );
}
