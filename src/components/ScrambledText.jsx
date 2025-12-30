import { useEffect, useRef } from "react";
import "./ScrambledText.css";

function getRandomChar(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
  children
}) {
  const rootRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    // Build text
    const text = typeof children === "string" ? children : String(children);
    container.innerHTML = "";
    const p = document.createElement("p");
    p.style.margin = 0;
    container.appendChild(p);

    const available = scrambleChars.split("");

    charsRef.current = text.split("").map((ch) => {
      if (ch === " ") {
        const space = document.createTextNode(" ");
        p.appendChild(space);
        return space;
      }
      const span = document.createElement("span");
      span.className = "scramble-char";
      span.setAttribute("data-content", ch);
      span.textContent = ch;
      p.appendChild(span);
      return span;
    });

    let raf = null;

    const handleMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        charsRef.current.forEach((c) => {
          const rect = c.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          const dist = Math.hypot(dx, dy);

          if (dist < radius) {
            const original = c.getAttribute("data-content") || "";
            const scrambled = getRandomChar(available);
            c.textContent = scrambled;

            const t = Math.max(60, Math.min(300, (dist / radius) * 300));

            setTimeout(() => {
              c.textContent = original;
            }, t);
          }
        });
      });
    };

    container.addEventListener("pointermove", handleMove);

    // 🛡 SAFE CLEANUP
    return () => {
      if (container) container.removeEventListener("pointermove", handleMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [radius, duration, speed, scrambleChars, children]);

  return (
    <div
      ref={rootRef}
      className={`text-block ${className}`}
      style={style}
    ></div>
  );
}
