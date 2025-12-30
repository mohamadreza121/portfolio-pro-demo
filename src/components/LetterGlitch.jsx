import { useRef, useEffect } from "react";

const LetterGlitch = ({
  theme = "night",
  className = "",
  glitchSpeed = 90,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789",
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const letters = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef(null);

  // Keep as number (ms), but do NOT initialize with Date.now() (purity rule)
  const lastGlitchTime = useRef(0);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const interpolateColor = (start, end, factor) => {
    return `rgb(${Math.round(start.r + (end.r - start.r) * factor)}, ${Math.round(
      start.g + (end.g - start.g) * factor
    )}, ${Math.round(start.b + (end.b - start.b) * factor)})`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    context.current = ctx;

    const symbols = Array.from(characters);

    const palettes = {
      night: ["#2b4539", "#61dca3", "#61b3dc"],
      day: ["#ff7b54", "#ffb347", "#e85d04"],
    };

    const colors = palettes[theme] ?? palettes.night;

    const getRandomChar = () =>
      symbols[Math.floor(Math.random() * symbols.length)];

    const getRandomColor = () =>
      colors[Math.floor(Math.random() * colors.length)];

    const calculateGrid = (width, height) => ({
      columns: Math.ceil(width / charWidth),
      rows: Math.ceil(height / charHeight),
    });

    const initializeLetters = (columns, rows) => {
      grid.current = { columns, rows };
      const total = columns * rows;
      letters.current = Array.from({ length: total }, () => ({
        char: getRandomChar(),
        color: getRandomColor(),
        targetColor: getRandomColor(),
        colorProgress: 1,
      }));
    };

    const drawLetters = () => {
      if (!context.current || letters.current.length === 0) return;

      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";

      letters.current.forEach((letter, index) => {
        const x = (index % grid.current.columns) * charWidth;
        const y = Math.floor(index / grid.current.columns) * charHeight;
        ctx.fillStyle = letter.color;
        ctx.fillText(letter.char, x, y);
      });
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Keep drawing in CSS pixel space
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const { columns, rows } = calculateGrid(rect.width, rect.height);
      initializeLetters(columns, rows);
      drawLetters();
    };

    const updateLetters = () => {
      if (!letters.current || letters.current.length === 0) return;

      const count = Math.max(1, Math.floor(letters.current.length * 0.05));

      for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * letters.current.length);
        const letter = letters.current[index];
        if (!letter) continue;

        letter.char = getRandomChar();
        letter.targetColor = getRandomColor();

        if (!smooth) {
          letter.color = letter.targetColor;
          letter.colorProgress = 1;
        } else {
          letter.colorProgress = 0;
        }
      }
    };

    const handleSmoothTransitions = () => {
      let redraw = false;

      letters.current.forEach((letter) => {
        if (letter.colorProgress < 1) {
          letter.colorProgress += 0.05;
          if (letter.colorProgress > 1) letter.colorProgress = 1;

          const start = hexToRgb(letter.color);
          const end = hexToRgb(letter.targetColor);

          if (start && end) {
            letter.color = interpolateColor(start, end, letter.colorProgress);
            redraw = true;
          }
        }
      });

      if (redraw) drawLetters();
    };

    /**
     * Long-term purity-safe timing:
     * - Use requestAnimationFrame timestamp param (ms)
     * - No Date.now()
     * - No eslint-disable needed
     */
    const animate = (t) => {
      // First frame: initialize time base
      if (lastGlitchTime.current === 0) lastGlitchTime.current = t;

      if (t - lastGlitchTime.current >= glitchSpeed) {
        updateLetters();
        drawLetters();
        lastGlitchTime.current = t;
      }

      if (smooth) handleSmoothTransitions();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    // Reset time base whenever we re-initialize (theme/speed/characters changes)
    lastGlitchTime.current = 0;
    animationRef.current = requestAnimationFrame(animate);

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current);
        resizeCanvas();
        lastGlitchTime.current = 0;
        animationRef.current = requestAnimationFrame(animate);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [glitchSpeed, smooth, theme, characters]);

  const containerStyle = {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    background:
      theme === "night"
        ? "#000000"
        : "linear-gradient(135deg, #fefefe 0%, #f5f5f5 100%)",
    transition: "background 0.5s ease",
    overflow: "hidden",
    zIndex: 0,
    pointerEvents: "none",
  };

  const canvasStyle = {
    display: "block",
    width: "100%",
    height: "100%",
    opacity: theme === "night" ? 0.22 : 0.4,
    mixBlendMode: theme === "night" ? "screen" : "multiply",
    transition: "opacity 0.5s ease, mix-blend-mode 0.5s ease",
  };

  // Restore correct vignette overlays (minimal, no logic changes)
  const outerVignetteStyle = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      theme === "night"
        ? "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)"
        : "radial-gradient(circle, rgba(255,255,255,0) 60%, rgba(240,240,240,0.9) 100%)",
    transition: "background 0.5s ease",
  };

  const centerVignetteStyle = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      theme === "night"
        ? "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)"
        : "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
    transition: "background 0.5s ease",
  };

  return (
    <div style={containerStyle} className={className}>
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette && <div style={outerVignetteStyle} />}
      {centerVignette && <div style={centerVignetteStyle} />}
    </div>
  );
};

export default LetterGlitch;
