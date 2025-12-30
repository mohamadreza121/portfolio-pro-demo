import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./Carousel.css";

const clamp01 = (n) => Math.max(0, Math.min(1, n));

export default function Carousel({
  items = [],
  ariaLabel = "Carousel",
  className = "",
}) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const baseCount = items.length;

  // Triplicate for true looping. Middle copy is the “home” range.
  const loopItems = useMemo(() => {
    if (!hasItems) return [];
    if (baseCount <= 1) return items;
    return [...items, ...items, ...items];
  }, [items, hasItems, baseCount]);

  const startIndex = baseCount > 1 ? baseCount : 0; // middle copy start
  const [activeIndex, setActiveIndex] = useState(startIndex);

  const viewportRef = useRef(null);
  const itemRefs = useRef([]);
  const rafRef = useRef(0);
  const scrollEndTimeout = useRef(null);
  const isJumpingRef = useRef(false);
  const activeIndexRef = useRef(startIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const normalizeLoopIndex = useCallback(
    (idx) => {
      const len = loopItems.length;
      if (!len) return 0;
      return ((idx % len) + len) % len; // true modulo
    },
    [loopItems.length]
  );

  const scrollToIndex = useCallback(
    (idx, behavior = "smooth") => {
      const i = normalizeLoopIndex(idx);
      const el = itemRefs.current[i];
      if (!el) return;

      // Scroll the card itself into view (center)
      el.scrollIntoView({
        behavior,
        inline: "center",
        block: "nearest",
      });
    },
    [normalizeLoopIndex]
  );

  // Initial jump to the middle copy
  useEffect(() => {
    if (!hasItems) return;
    if (baseCount <= 1) return;

    requestAnimationFrame(() => {
      isJumpingRef.current = true;
      scrollToIndex(startIndex, "auto");
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
    });
  }, [hasItems, baseCount, startIndex, scrollToIndex]);

  // Measure focus (sets --focus) and choose active card (nearest to center)
  const measureAndPaint = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const vr = viewport.getBoundingClientRect();
    const centerX = vr.left + vr.width / 2;

    let bestIdx = 0;
    let bestFocus = -1;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;

      const r = el.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      const dist = Math.abs(mid - centerX);

      const half = Math.max(1, r.width / 2);
      const focus = 1 - clamp01(dist / half);

      el.style.setProperty("--focus", focus.toFixed(3));

      if (focus > bestFocus) {
        bestFocus = focus;
        bestIdx = i;
      }
    });

    if (!isJumpingRef.current) setActiveIndex(bestIdx);
  }, []);

  const schedulePaint = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(measureAndPaint);
  }, [measureAndPaint]);

  // Recenter into middle copy AFTER scroll settles (true infinite)
  const correctToMiddleCopy = useCallback(() => {
    if (!hasItems) return;
    if (baseCount <= 1) return;

    const idx = activeIndexRef.current;

    // Middle copy is [baseCount .. 2*baseCount-1]
    if (idx >= baseCount && idx < baseCount * 2) return;

    const real = ((idx % baseCount) + baseCount) % baseCount;
    const corrected = baseCount + real;

    isJumpingRef.current = true;
    scrollToIndex(corrected, "auto");

    requestAnimationFrame(() => {
      setActiveIndex(corrected);
      activeIndexRef.current = corrected;
      isJumpingRef.current = false;
      schedulePaint();
    });
  }, [hasItems, baseCount, scrollToIndex, schedulePaint]);

  // Scroll listeners: paint during scroll, correct after momentum ends
  useEffect(() => {
    if (!hasItems) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onScroll = () => {
      schedulePaint();

      clearTimeout(scrollEndTimeout.current);
      scrollEndTimeout.current = setTimeout(() => {
        correctToMiddleCopy();
      }, 120);
    };

    viewport.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedulePaint);

    schedulePaint();

    return () => {
      viewport.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedulePaint);
      clearTimeout(scrollEndTimeout.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [hasItems, schedulePaint, correctToMiddleCopy]);

  // Prev/Next (always wraps)
  const next = useCallback(() => {
    if (!hasItems) return;
    scrollToIndex(activeIndexRef.current + 1, "smooth");
  }, [hasItems, scrollToIndex]);

  const prev = useCallback(() => {
    if (!hasItems) return;
    scrollToIndex(activeIndexRef.current - 1, "smooth");
  }, [hasItems, scrollToIndex]);

  if (!hasItems) return null;

  const realActive =
    baseCount <= 0 ? 0 : ((activeIndex % baseCount) + baseCount) % baseCount;

  const rendered = baseCount <= 1 ? items : loopItems;

  return (
    <div className={`carousel ${className}`} aria-label={ariaLabel}>
      <button className="carousel__nav left" onClick={prev} aria-label="Previous">
        ‹
      </button>

      <div ref={viewportRef} className="carousel__viewport">
        <div className="carousel__track">
          {rendered.map((item, idx) => {
            const isVideo = item.type === "video";

            return (
              <article
                key={`${item.id || item.title || "item"}-${idx}`}
                className="carousel-card"
                ref={(el) => (itemRefs.current[idx] = el)}
              >
                <button
                  type="button"
                  className="carousel-card__link cursor-target"
                  onClick={(e) => {
                    e.preventDefault();
                    if (typeof item.onClick === "function") {
                      item.onClick();
                      return;
                    }
                    if (item.href) {
                      window.open(item.href, "_blank", "noopener,noreferrer");
                    }
                  }}
                  aria-label={item.title ? `Open ${item.title}` : "Open item"}
                >
                  <div className="carousel-card__media">
                    <img src={item.mediaSrc} alt={item.mediaAlt || item.title || "Certificate"} />
                    {isVideo ? (
                      <div className="carousel-card__play" aria-hidden="true">
                        <span />
                      </div>
                    ) : null}
                    {item.badge ? (
                      <div className="carousel-card__badge">
                        <span className="dot" aria-hidden="true" />
                        {item.badge}
                      </div>
                    ) : null}
                  </div>

                  <div className="carousel-card__body">
                    <h4 className="carousel-card__title">{item.title}</h4>
                    {item.caption ? (
                      <p className="carousel-card__caption">{item.caption}</p>
                    ) : null}
                    <div className="carousel-card__cta">View →</div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <button className="carousel__nav right" onClick={next} aria-label="Next">
        ›
      </button>

      <div className="carousel__dots" aria-label="Carousel pagination">
        {items.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === realActive ? "active" : ""}`}
            onClick={() => {
              if (baseCount > 1) scrollToIndex(baseCount + i, "smooth");
              else scrollToIndex(i, "smooth");
            }}
            aria-label={`Go to item ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
