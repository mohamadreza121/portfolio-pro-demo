import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import gsap from "gsap";

import "./ScrollDeck.css";

/* =====================================================
   ScrollDeck

   - Presents multiple sections as full-viewport "panels".
   - The active panel is scrollable; when the user reaches the
     top/bottom and continues scrolling, we crossfade/reveal into
     the previous/next panel.

   Directional entry (professional behavior):
   - Scrolling DOWN into the next panel => next panel starts at TOP
   - Scrolling UP into the previous panel => previous panel starts at BOTTOM

   Navbar/deep-link entry:
   - Always starts at TOP of the destination panel
===================================================== */

const SECTION_ORDER = [
  { id: "home", name: "Home" },
  { id: "about", name: "About" },
  { id: "projects", name: "Projects" },
  { id: "certifications", name: "Certs" },
  { id: "services", name: "Services" },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function ScrollDeck({
  setActive,
  isQuoteOpen,
  revealKey,
  pendingSectionId,
  onPendingHandled,
  children,
}) {
  const panels = useMemo(() => React.Children.toArray(children), [children]);

  const containerRef = useRef(null);
  const panelRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const lastDirectionRef = useRef(1);
  const boundaryCooldownUntilRef = useRef(0);


  const [activeIndex, setActiveIndex] = useState(0);

  /* =====================================================
     Helpers
  ===================================================== */
  const getIndexById = useCallback((id) => {
    if (!id) return -1;
    return SECTION_ORDER.findIndex((s) => s.id === id);
  }, []);

  // Use hash as a "nice URL" while scrolling; keep path/query intact.
  const setHashQuietly = useCallback((hash) => {
    if ((window.location.hash || "") === hash) return;
    const nextUrl = `${window.location.pathname}${window.location.search}${hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, []);

  const publishDeckState = useCallback((idx) => {
    const panel = panelRefs.current[idx];
    const scrollTop = panel?.scrollTop || 0;
    const id = SECTION_ORDER[idx]?.id || "home";

    window.dispatchEvent(
      new CustomEvent("deck:state", {
        detail: { index: idx, id, scrollTop },
      })
    );
  }, []);

  const applyActive = useCallback(
    (idx) => {
      const safe = clamp(
        idx,
        0,
        Math.min(SECTION_ORDER.length - 1, panels.length - 1)
      );

      activeIndexRef.current = safe;
      setActiveIndex(safe);

      const meta = SECTION_ORDER[safe];
      if (meta) {
        setActive?.(meta.name);
        setHashQuietly(`#${meta.id}`);
      }

      publishDeckState(safe);
    },
    [panels.length, publishDeckState, setActive, setHashQuietly]
  );

  const setPanelVisibility = useCallback((idx, isVisible) => {
    const el = panelRefs.current[idx];
    if (!el) return;
    el.style.visibility = isVisible ? "visible" : "hidden";
    el.style.pointerEvents = isVisible ? "auto" : "none";
  }, []);

  /**
   * Scroll a given panel container to a desired entry position.
   * position: "top" | "bottom"
   */
  const scrollPanelTo = useCallback((idx, position = "top", behavior = "auto") => {
    const el = panelRefs.current[idx];
    if (!el) return;

    const top = 0;
    const bottom = Math.max(0, el.scrollHeight - el.clientHeight);
    const target = position === "bottom" ? bottom : top;

    try {
      el.scrollTo({ top: target, behavior });
    } catch {
      el.scrollTop = target;
    }
  }, []);

  /* =====================================================
     Initial state (post-curtain reveal)
  ===================================================== */
  useEffect(() => {
    if (!revealKey) return;

    panelRefs.current.forEach((el, idx) => {
      if (!el) return;
      el.style.opacity = idx === activeIndexRef.current ? "1" : "0";
      el.style.transform = "translate3d(0,0,0)";
      setPanelVisibility(idx, idx === activeIndexRef.current);
    });

    // Sync active label + hash (e.g., #home) once reveal happens
    applyActive(activeIndexRef.current);
  }, [revealKey, applyActive, setPanelVisibility]);

  /* =====================================================
     Body scroll lock (Main page only)
  ===================================================== */
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  /* =====================================================
     Panel transition
  ===================================================== */
  const goToIndex = useCallback(
    (nextIdx, opts = {}) => {
      const {
        resetTargetScroll = false,
        targetScrollBehavior = "auto",
        targetScrollPosition = "top", // "top" | "bottom"
      } = opts;

      const current = activeIndexRef.current;
      const maxIdx = Math.min(SECTION_ORDER.length - 1, panels.length - 1);
      const target = clamp(nextIdx, 0, maxIdx);

      // If user navigates to the same panel, still allow snapping to top/bottom
      if (target === current) {
        if (resetTargetScroll) {
          scrollPanelTo(current, targetScrollPosition, targetScrollBehavior);
          publishDeckState(current);
        }
        return;
      }

      if (isTransitioningRef.current) return;
      if (isQuoteOpen) return;

      const dir = target > current ? 1 : -1;
      lastDirectionRef.current = dir;
      isTransitioningRef.current = true;

      const currentEl = panelRefs.current[current];
      const nextEl = panelRefs.current[target];

      if (!currentEl || !nextEl) {
        isTransitioningRef.current = false;
        applyActive(target);
        return;
      }

      // Reset destination scroll BEFORE reveal begins so the panel "enters" correctly.
      if (resetTargetScroll) {
        scrollPanelTo(target, targetScrollPosition, targetScrollBehavior);
      }

      // Make next visible above current for the reveal.
      nextEl.style.zIndex = "30";
      currentEl.style.zIndex = "20";
      setPanelVisibility(target, true);

      gsap.killTweensOf([currentEl, nextEl]);

      // Cinematic tuning knobs
      const DURATION = 1.05;              // 0.95–1.15 feels calm
      const ENTER_Y = 22;                 // 16–26 feels smooth
      const EXIT_Y = 14;                  // smaller than enter
      const ENTER_BLUR = 5;               // 0–6 (lower = cleaner)
      const EXIT_BLUR = 3;                // keep subtle, avoid big blur spikes
      const OVERLAP = 0.06;               // slight overlap for softness
      const EASE = "power2.inOut";        // calmer than power3

      gsap.set(nextEl, {
        opacity: 0,
        y: dir > 0 ? ENTER_Y : -ENTER_Y,
        scale: 0.995,
        filter: `blur(${ENTER_BLUR}px)`,
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({
        defaults: { duration: DURATION, ease: EASE },
        onComplete: () => {
          // Hide old panel
          gsap.set(currentEl, { opacity: 0, y: 0, scale: 1, filter: "blur(0px)" });
          setPanelVisibility(current, false);

          // Normalize z-index
          nextEl.style.zIndex = "20";
          currentEl.style.zIndex = "10";

          isTransitioningRef.current = false;
          applyActive(target);
        },
      });

      // Let current start fading a hair later; avoids “hard cut” feel
      tl.to(
        currentEl,
        {
          opacity: 0,
          y: dir > 0 ? -EXIT_Y : EXIT_Y,
          scale: 1.002,
          filter: `blur(${EXIT_BLUR}px)`,
        },
        OVERLAP
      ).to(
        nextEl,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        },
        0
      );
    },
    [
      applyActive,
      isQuoteOpen,
      panels.length,
      publishDeckState,
      scrollPanelTo,
      setPanelVisibility,
    ]
  );

  const goToSection = useCallback(
    (id, opts) => {
      const idx = getIndexById(id);
      if (idx >= 0) goToIndex(idx, opts);
    },
    [getIndexById, goToIndex]
  );

  /* =====================================================
     Pending navigation (Navbar / deep-link)
     - Always go to TOP of destination section
  ===================================================== */
  useEffect(() => {
    if (!pendingSectionId) return;

    goToSection(pendingSectionId, {
      resetTargetScroll: true,
      targetScrollPosition: "top",
      targetScrollBehavior: "auto",
    });

    onPendingHandled?.();
  }, [pendingSectionId, goToSection, onPendingHandled]);

  /* =====================================================
     External controls
  ===================================================== */
  useEffect(() => {
    const onScrollTop = () => {
      const idx = activeIndexRef.current;
      const el = panelRefs.current[idx];
      if (!el) return;

      // If user is not on Home, jump to Home; else scroll to top of Home.
      if (idx !== 0) {
        goToIndex(0, {
          resetTargetScroll: true,
          targetScrollPosition: "top",
          targetScrollBehavior: "auto",
        });
        return;
      }

      el.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("deck:scrollToTop", onScrollTop);
    return () => window.removeEventListener("deck:scrollToTop", onScrollTop);
  }, [goToIndex]);

  /* =====================================================
     Wheel routing
     Directional entry behavior:
     - DOWN boundary => next panel enters at TOP
     - UP boundary   => previous panel enters at BOTTOM
  ===================================================== */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (isQuoteOpen) return;

      // Cooldown to absorb touchpad momentum at boundaries
      const now = performance.now();
      if (now < boundaryCooldownUntilRef.current) {
        e.preventDefault();
        return;
      }

      // If a transition is running, consume the wheel so nothing leaks/bounces.
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      const idx = activeIndexRef.current;
      const el = panelRefs.current[idx];
      if (!el) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 2) return;

      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      const maxIdx = Math.min(SECTION_ORDER.length - 1, panels.length - 1);
      const COOLDOWN_MS = 80; // choose 50–100

      if (delta > 0) {
        // Scrolling down
        if (!atBottom) return;

        // HARD STOP: already at last panel -> do not move past footer
        if (idx >= maxIdx) {
          boundaryCooldownUntilRef.current = now + COOLDOWN_MS;
          e.preventDefault();
          return;
        }

        e.preventDefault();
        goToIndex(idx + 1, {
          resetTargetScroll: true,
          targetScrollPosition: "top",
          targetScrollBehavior: "auto",
        });
      } else {
        // Scrolling up
        if (!atTop) return;

        // HARD STOP: already at first panel -> do not move past home
        if (idx <= 0) {
          boundaryCooldownUntilRef.current = now + COOLDOWN_MS;
          e.preventDefault();
          return;
        }

        e.preventDefault();
        goToIndex(idx - 1, {
          resetTargetScroll: true,
          targetScrollPosition: "bottom",
          targetScrollBehavior: "auto",
        });
      }
    };


    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [goToIndex, isQuoteOpen, panels.length]);

  /* =====================================================
     Active-panel scroll reporting (for scroll-to-top button)
  ===================================================== */
  useEffect(() => {
    const el = panelRefs.current[activeIndex];
    if (!el) return;

    const onScroll = () => {
      publishDeckState(activeIndex);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    publishDeckState(activeIndex);

    return () => el.removeEventListener("scroll", onScroll);
  }, [activeIndex, publishDeckState]);

  /* =====================================================
     Render
  ===================================================== */
  return (
    <div ref={containerRef} className="scroll-deck" role="application">
      {panels.map((panel, idx) => (
        <section
          key={SECTION_ORDER[idx]?.id || idx}
          ref={(node) => {
            panelRefs.current[idx] = node;
          }}
          className="scroll-deck__panel"
          aria-hidden={idx !== activeIndex}
        >
          <div className="scroll-deck__panelInner">{panel}</div>
        </section>
      ))}
    </div>
  );
}
