import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import "./ScrollDeck.css";

/* =====================================================
   ScrollDeck

   - Full-viewport panels; active panel is scrollable.
   - At top/bottom boundary, continue scrolling transitions to prev/next.

   Directional entry (professional behavior):
   - Scrolling DOWN into the next panel => next panel starts at TOP
   - Scrolling UP into the previous panel => previous panel starts at BOTTOM

   Navbar/deep-link entry:
   - Always starts at TOP of destination panel

   Mobile-safe behavior:
   - Do not attach wheel routing on coarse pointers (phones/tablets)
   - Reduce/disable expensive blur on coarse pointers
   - Reduced-motion: skip GSAP transitions entirely
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
     Runtime flags (mobile + reduced motion)
  ===================================================== */
  const prefersReducedMotionRef = useRef(false);
  const isCoarsePointerRef = useRef(false);

  useEffect(() => {
    const mqReduce =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    const mqCoarse =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(pointer: coarse)")
        : null;

    const apply = () => {
      prefersReducedMotionRef.current = !!mqReduce?.matches;
      isCoarsePointerRef.current = !!mqCoarse?.matches;
    };

    apply();

    // Listen for changes (rare but correct)
    if (mqReduce?.addEventListener) mqReduce.addEventListener("change", apply);
    else if (mqReduce?.addListener) mqReduce.addListener(apply);

    if (mqCoarse?.addEventListener) mqCoarse.addEventListener("change", apply);
    else if (mqCoarse?.addListener) mqCoarse.addListener(apply);

    return () => {
      if (mqReduce?.removeEventListener) mqReduce.removeEventListener("change", apply);
      else if (mqReduce?.removeListener) mqReduce.removeListener(apply);

      if (mqCoarse?.removeEventListener) mqCoarse.removeEventListener("change", apply);
      else if (mqCoarse?.removeListener) mqCoarse.removeListener(apply);
    };
  }, []);

  /* =====================================================
     Helpers
  ===================================================== */
  const getIndexById = useCallback((id) => {
    if (!id) return -1;
    return SECTION_ORDER.findIndex((s) => s.id === id);
  }, []);

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
      el.style.filter = "blur(0px)";
      setPanelVisibility(idx, idx === activeIndexRef.current);
    });

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
        targetScrollPosition = "top",
      } = opts;

      const current = activeIndexRef.current;
      const maxIdx = Math.min(SECTION_ORDER.length - 1, panels.length - 1);
      const target = clamp(nextIdx, 0, maxIdx);

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

      // Reset destination scroll before reveal begins
      if (resetTargetScroll) {
        scrollPanelTo(target, targetScrollPosition, targetScrollBehavior);
      }

      // Reduced motion: no GSAP, just switch
      if (prefersReducedMotionRef.current) {
        gsap.killTweensOf([currentEl, nextEl]);
        setPanelVisibility(current, false);
        setPanelVisibility(target, true);

        // Ensure visual reset
        currentEl.style.opacity = "0";
        currentEl.style.transform = "translate3d(0,0,0)";
        currentEl.style.filter = "blur(0px)";

        nextEl.style.opacity = "1";
        nextEl.style.transform = "translate3d(0,0,0)";
        nextEl.style.filter = "blur(0px)";

        nextEl.style.zIndex = "20";
        currentEl.style.zIndex = "10";

        isTransitioningRef.current = false;
        applyActive(target);
        return;
      }

      // Make next visible above current for the reveal.
      nextEl.style.zIndex = "30";
      currentEl.style.zIndex = "20";
      setPanelVisibility(target, true);

      gsap.killTweensOf([currentEl, nextEl]);

      // Cinematic tuning knobs
      const isMobile = isCoarsePointerRef.current;

      const DURATION = isMobile ? 0.62 : 1.05;
      const ENTER_Y = isMobile ? 14 : 22;
      const EXIT_Y = isMobile ? 10 : 14;

      // Blur is expensive on mobile: disable there
      const ENTER_BLUR = isMobile ? 0 : 5;
      const EXIT_BLUR = isMobile ? 0 : 3;

      const OVERLAP = isMobile ? 0.03 : 0.06;
      const EASE = isMobile ? "power2.out" : "power2.inOut";

      gsap.set(nextEl, {
        opacity: 0,
        y: dir > 0 ? ENTER_Y : -ENTER_Y,
        scale: 0.997,
        filter: `blur(${ENTER_BLUR}px)`,
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({
        defaults: { duration: DURATION, ease: EASE },
        onComplete: () => {
          gsap.set(currentEl, { opacity: 0, y: 0, scale: 1, filter: "blur(0px)" });
          setPanelVisibility(current, false);

          nextEl.style.zIndex = "20";
          currentEl.style.zIndex = "10";

          isTransitioningRef.current = false;
          applyActive(target);
        },
      });

      tl.to(
        currentEl,
        {
          opacity: 0,
          y: dir > 0 ? -EXIT_Y : EXIT_Y,
          scale: 1.001,
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
     Wheel routing (desktop only)
  ===================================================== */
  useEffect(() => {
    // Phones/tablets: let native touch scrolling handle everything.
    if (isCoarsePointerRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (isQuoteOpen) return;

      const now = performance.now();
      if (now < boundaryCooldownUntilRef.current) {
        e.preventDefault();
        return;
      }

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
      const COOLDOWN_MS = 80;

      if (delta > 0) {
        if (!atBottom) return;

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
        if (!atTop) return;

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
     Active-panel scroll reporting
  ===================================================== */
  useEffect(() => {
    const el = panelRefs.current[activeIndex];
    if (!el) return;

    const onScroll = () => publishDeckState(activeIndex);

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
