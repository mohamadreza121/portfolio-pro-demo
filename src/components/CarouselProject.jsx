/**
 * src/components/CarouselProject.jsx
 * --------------------------------------------------------------------
 * Purpose:
 *   Reusable UI component used across the portfolio template.
 *
 * Notes:
 *   - Native swipe scrolling is used for smoothness (no JS velocity hacks).
 *   - Swipe is enabled ONLY on mobile (<520px) via CSS.
 *   - Scroll-based animations are paused during momentum and
 *     re-synced only after scrolling settles (prevents twitching).
 *   - Swipe is disabled when a lightbox is open (isLightboxOpen=true).
 */

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./CarouselProject.css";

/* Clamp helper */
const clamp01 = (n) => Math.max(0, Math.min(1, n));

export default function CarouselProject({
  items = [],
  onOpen,
  ariaLabel = "Project media carousel",
  className = "",
  isLightboxOpen = false,
}) {
  const viewportRef = useRef(null);
  const itemRefs = useRef([]);
  const rafRef = useRef(0);
  const scrollEndTimeout = useRef(null);
  const isJumpingRef = useRef(false);

  const hasItems = items.length > 0;


  /* ---------------------------------------------------------
     Infinite buffer: [last, ...items, first]
     --------------------------------------------------------- */
  const extendedItems = useMemo(() => {
    if (!hasItems) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, hasItems]);

  const [activeIndex, setActiveIndex] = useState(1);

  /* ---------------------------------------------------------
     Sync refs
     --------------------------------------------------------- */
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, extendedItems.length);
  }, [extendedItems.length]);

  /* ---------------------------------------------------------
     Initial centering (safe for both)
     --------------------------------------------------------- */
  useEffect(() => {
    const first = itemRefs.current[1];
    if (!first) return;

    requestAnimationFrame(() => {
      // JSDOM doesn't implement scrollIntoView; guard for tests.
      if (typeof first.scrollIntoView === "function") {
        first.scrollIntoView({
          behavior: "instant",
          inline: "center",
          block: "nearest",
        });
      }
    });
  }, [extendedItems.length]);

  /* ---------------------------------------------------------
     Focus measurement (desktop only)
     - On mobile we avoid writing focus transforms to prevent
       the “jump/twitch” feel during swipe.
     --------------------------------------------------------- */
  const measureAndPaint = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    // Mobile: just pick the best index (for dots), but do NOT animate focus.
    if (typeof window !== "undefined" && window.innerWidth < 520) {
      const rect = viewport.getBoundingClientRect();
      const center = rect.left + rect.width / 2;

      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const dist = Math.abs(c - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });

      if (!isJumpingRef.current) setActiveIndex(bestIdx);
      return;
    }

    // Desktop: full focus painting
    const rect = viewport.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const half = Math.max(1, rect.width / 2);

    let bestIdx = 0;
    let bestFocus = -1;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const focus = 1 - clamp01(Math.abs(c - center) / half);

      el.style.setProperty("--focus", focus.toFixed(3));

      if (focus > bestFocus) {
        bestFocus = focus;
        bestIdx = i;
      }
    });

    if (!isJumpingRef.current) setActiveIndex(bestIdx);
  }, [setActiveIndex]);

  const schedulePaint = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(measureAndPaint);
  }, [measureAndPaint]);

  /* ---------------------------------------------------------
     Scroll listener (momentum-safe)
     --------------------------------------------------------- */
  useEffect(() => {
    if (!hasItems) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    schedulePaint();

    const onScroll = () => {
      if (isLightboxOpen) return;

      clearTimeout(scrollEndTimeout.current);
      scrollEndTimeout.current = setTimeout(() => {
        schedulePaint();
      }, 80);
    };

    viewport.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedulePaint);

    return () => {
      viewport.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedulePaint);
      clearTimeout(scrollEndTimeout.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [hasItems, isLightboxOpen, schedulePaint]);

  /* ---------------------------------------------------------
     Infinite correction (DESKTOP ONLY)
     - Mobile has snap disabled, so correction is unnecessary
       and can introduce hitching.
     --------------------------------------------------------- */
  useEffect(() => {
    if (!hasItems) return;

    // ✅ mobile: do nothing
    if (typeof window !== "undefined" && window.innerWidth < 520) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    if (activeIndex === 0 || activeIndex === items.length + 1) {
      isJumpingRef.current = true;
      viewport.style.scrollSnapType = "none";

      requestAnimationFrame(() => {
        const target =
          activeIndex === 0
            ? itemRefs.current[items.length]
            : itemRefs.current[1];

        target?.scrollIntoView({
          behavior: "instant",
          inline: "center",
          block: "nearest",
        });

        requestAnimationFrame(() => {
          viewport.style.scrollSnapType = "";
          isJumpingRef.current = false;
          schedulePaint();
        });
      });
    }
  }, [activeIndex, items.length, hasItems, schedulePaint]);

  /* ---------------------------------------------------------
     Navigation helpers
     --------------------------------------------------------- */
  const scrollToIndex = (idx) => {
    const el = itemRefs.current[idx];
    if (!el) return;

    const mobile =
      typeof window !== "undefined" && window.innerWidth < 520;

    el.scrollIntoView({
      behavior: mobile ? "instant" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const next = () => scrollToIndex(activeIndex + 1);
  const prev = () => scrollToIndex(activeIndex - 1);

  if (!hasItems) return null;

  const realActive =
    activeIndex === 0
      ? items.length - 1
      : activeIndex === items.length + 1
      ? 0
      : activeIndex - 1;

  return (
    <div className={`carousel-project ${className}`} aria-label={ariaLabel}>
      <button
        className="carousel-project__nav left"
        onClick={prev}
        aria-label="Previous"
        disabled={isLightboxOpen}
      >
        ‹
      </button>

      <div
        ref={viewportRef}
        className={`carousel-project__viewport ${
          isLightboxOpen ? "is-locked" : ""
        }`}
        aria-hidden={isLightboxOpen ? "true" : "false"}
      >
        <div className="carousel-project__track">
          {extendedItems.map((item, idx) => (
            <article
              key={`${item.id}-${idx}`}
              className="carousel-project__card"
              ref={(el) => (itemRefs.current[idx] = el)}
            >
              <button
                type="button"
                className="carousel-project__link cursor-target"
                onClick={() => onOpen?.(item)}
                disabled={isLightboxOpen}
              >
                <div className="carousel-project__media">
                  <img src={item.mediaSrc} alt={item.title} />
                </div>

                <div className="carousel-project__body">
                  <h4>{item.title}</h4>
                  <p>{item.caption}</p>
                  <span className="cta">View →</span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      <button
        className="carousel-project__nav right"
        onClick={next}
        aria-label="Next"
        disabled={isLightboxOpen}
      >
        ›
      </button>

      <div className="carousel-project__dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === realActive ? "active" : ""}`}
            onClick={() => scrollToIndex(i + 1)}
            disabled={isLightboxOpen}
          />
        ))}
      </div>
    </div>
  );
}
