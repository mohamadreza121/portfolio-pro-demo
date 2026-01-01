import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

const styles = {
  wrapper: { display: "inline-block", whiteSpace: "pre-wrap" },
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    border: 0,
  },
};

// Defers work so we don’t call setState synchronously inside an effect body.
// This satisfies react-hooks/set-state-in-effect without silencing anything.
function defer(fn) {
  if (typeof queueMicrotask === "function") queueMicrotask(fn);
  else Promise.resolve().then(fn);
}

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 12,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  revealDelay = 0,
  revealKey,
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());

  const containerRef = useRef(null);
  const viewTimerRef = useRef(null);

  const hasAnimatedRef = useRef(false);
  const revealableCountRef = useRef(0);

  // Track text changes without synchronous setState in the effect body.
  useEffect(() => {
    revealableCountRef.current = text.split("").filter((c) => c !== " ").length;
    hasAnimatedRef.current = false;

    let cancelled = false;
    defer(() => {
      if (cancelled) return;
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsHovering(false);
      setIsScrambling(false);
    });

    return () => {
      cancelled = true;
    };
  }, [text]);

  const availableChars = useMemo(() => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.split(""))).filter((c) => c !== " ");
    }
    return characters.split("");
  }, [useOriginalCharsOnly, characters, text]);

  const scrambleOnce = useCallback(
    (originalText, currentRevealed) =>
      originalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join(""),
    [availableChars]
  );

  // Scramble / reveal engine
  useEffect(() => {
    let interval;
    let currentIteration = 0;
    let cancelled = false;

    const getNextIndex = (revealedSet) => {
      const L = text.length;
      switch (revealDirection) {
        case "start":
          for (let i = 0; i < L; i++) if (!revealedSet.has(i) && text[i] !== " ") return i;
          return null;
        case "end":
          for (let i = L - 1; i >= 0; i--) if (!revealedSet.has(i) && text[i] !== " ") return i;
          return null;
        case "center": {
          const mid = Math.floor(L / 2);
          for (let off = 0; off <= mid; off++) {
            const i1 = mid + off;
            const i2 = mid - off;
            if (i1 < L && !revealedSet.has(i1) && text[i1] !== " ") return i1;
            if (i2 >= 0 && !revealedSet.has(i2) && text[i2] !== " ") return i2;
          }
          return null;
        }
        default:
          return null;
      }
    };

    if (isHovering) {
      // no synchronous setState inside effect body
      defer(() => {
        if (!cancelled) setIsScrambling(true);
      });

      interval = setInterval(() => {
        setRevealedIndices((prev) => {
          const nextSet = new Set(prev);

          if (sequential) {
            if (nextSet.size < revealableCountRef.current) {
              const nextIndex = getNextIndex(nextSet);
              if (nextIndex !== null) nextSet.add(nextIndex);
              setDisplayText(scrambleOnce(text, nextSet));
              return nextSet;
            }

            clearInterval(interval);
            defer(() => {
              if (cancelled) return;
              setIsScrambling(false);
              setDisplayText(text);
              setIsHovering(false);
            });
            return nextSet;
          }

          // non-sequential
          setDisplayText(scrambleOnce(text, prev));
          currentIteration += 1;

          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            defer(() => {
              if (cancelled) return;
              setIsScrambling(false);
              setDisplayText(text);
            });
          }

          return prev;
        });
      }, speed);
    } else {
      // stop/reset without synchronous setState in effect body
      defer(() => {
        if (cancelled) return;
        setDisplayText(text);
        setRevealedIndices(new Set());
        setIsScrambling(false);
      });
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, scrambleOnce]);

  // Explicit reveal (revealKey): pre-scramble immediately, then start
  useEffect(() => {
    if (!revealKey) return;

    if (viewTimerRef.current) clearTimeout(viewTimerRef.current);

    viewTimerRef.current = setTimeout(() => {
      const empty = new Set();
      setRevealedIndices(empty);
      setDisplayText(scrambleOnce(text, empty));
      setIsHovering(true);
    }, revealDelay);

    return () => {
      if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    };
  }, [revealKey, revealDelay, text, scrambleOnce]);

  // View-based reveal (when no revealKey): pre-scramble on trigger
  useEffect(() => {
    if (revealKey) return;
    if (animateOn !== "view" && animateOn !== "both") return;

    const el = containerRef.current;
    if (!el) return;

    const panel = el.closest?.(".scroll-deck__panel") || null;
    const root = panel || null;

    const panelIsActive = () => {
      if (!panel) return true;
      return panel.getAttribute("aria-hidden") !== "true";
    };

    const trigger = () => {
      if (hasAnimatedRef.current) return;
      if (!panelIsActive()) return;

      hasAnimatedRef.current = true;

      const empty = new Set();
      setRevealedIndices(empty);
      setDisplayText(scrambleOnce(text, empty));

      if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
      viewTimerRef.current = setTimeout(() => setIsHovering(true), revealDelay);
    };

    const manualCheck = () => {
      if (hasAnimatedRef.current) return;
      if (!panelIsActive()) return;

      const r = el.getBoundingClientRect();
      const rr = root ? root.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
      if (r.bottom > rr.top && r.top < rr.bottom) trigger();
    };

    if (typeof IntersectionObserver === "undefined") {
      requestAnimationFrame(manualCheck);
      return () => {
        if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && trigger()),
      { root, threshold: 0.25 }
    );

    observer.observe(el);

    const onDeckState = () => requestAnimationFrame(manualCheck);
    window.addEventListener("deck:state", onDeckState);
    window.addEventListener("deck:active", onDeckState);
    window.addEventListener("resize", onDeckState);
    if (panel) panel.addEventListener("scroll", onDeckState, { passive: true });

    requestAnimationFrame(manualCheck);

    return () => {
      observer.disconnect();
      window.removeEventListener("deck:state", onDeckState);
      window.removeEventListener("deck:active", onDeckState);
      window.removeEventListener("resize", onDeckState);
      if (panel) panel.removeEventListener("scroll", onDeckState);
      if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    };
  }, [animateOn, text, revealDelay, revealKey, scrambleOnce]);

  // Hover support: pre-scramble immediately (no jump)
  const hoverProps =
    animateOn === "hover" || animateOn === "both"
      ? {
          onMouseEnter: () => {
            const empty = new Set();
            setRevealedIndices(empty);
            setDisplayText(scrambleOnce(text, empty));
            setIsHovering(true);
          },
          onMouseLeave: () => setIsHovering(false),
        }
      : {};

  return (
    <motion.span
      className={parentClassName}
      ref={containerRef}
      style={styles.wrapper}
      {...hoverProps}
      {...props}
    >
      <span style={styles.srOnly}>{displayText}</span>

      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealedOrDone =
            revealedIndices.has(index) || !isScrambling || !isHovering;

          return (
            <span
              key={index}
              className={isRevealedOrDone ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
