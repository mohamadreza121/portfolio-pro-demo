import { useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* =====================================================
   SHARED SCROLL-SPY + ROUTING HOOK (FINAL, FIXED)
===================================================== */

export function useScrollSpyRouter(setActive, enabled = true) {
  const location = useLocation();
  const navigate = useNavigate();

  /* =====================================================
     INTERNAL REFS (NO RERENDERS)
  ===================================================== */
  const isProgrammaticScrollRef = useRef(false);
  const hasUserScrolledRef = useRef(false);
  const idleTimerRef = useRef(null);

  /* =====================================================
     STABLE SECTION MAP
  ===================================================== */
  const sections = useMemo(
    () => [
      { id: "home", name: "Home" },
      { id: "about", name: "About" },
      { id: "projects", name: "Projects" },
      { id: "certifications", name: "Certs" },
      { id: "services", name: "Services" },
    ],
    []
  );

  /* =====================================================
     UTILITIES
  ===================================================== */
  const setHashQuietly = useCallback((hash) => {
    if ((window.location.hash || "") === hash) return;
    window.history.replaceState(window.history.state, "", hash);
  }, []);

  const setActiveById = useCallback(
    (id) => {
      const match = sections.find((s) => s.id === id);
      if (match) {
        setActive(match.name);
        setHashQuietly(`#${id}`);
      }
    },
    [sections, setActive, setHashQuietly]
  );

  /* =====================================================
     PROGRAMMATIC SCROLL LOCK
  ===================================================== */
  const lockDuringSmoothScroll = useCallback(() => {
    isProgrammaticScrollRef.current = true;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    const unlockWhenIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        window.removeEventListener("scroll", unlockWhenIdle);
      }, 180);
    };

    unlockWhenIdle();
    window.addEventListener("scroll", unlockWhenIdle, { passive: true });
  }, []);

  /* =====================================================
     ARM USER SCROLL (PREVENT INITIAL NOISE)
  ===================================================== */
  useEffect(() => {
    const arm = () => {
      hasUserScrolledRef.current = true;
      window.removeEventListener("scroll", arm);
    };

    window.addEventListener("scroll", arm, { passive: true });
    return () => window.removeEventListener("scroll", arm);
  }, []);

  /* =====================================================
     HASH → SCROLL (DEEP LINKS)
     🚨 DISABLED WHILE MODAL IS OPEN
  ===================================================== */
  useEffect(() => {
    if (!enabled) return;
    if (location.pathname !== "/") return;
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    lockDuringSmoothScroll();
    setActiveById(id);

    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [
    enabled,
    location.pathname,
    location.hash,
    lockDuringSmoothScroll,
    setActiveById,
  ]);

  /* =====================================================
     ROUTER STATE → SCROLL
     🚨 DISABLED WHILE MODAL IS OPEN
  ===================================================== */
  useEffect(() => {
    if (!enabled) return;
    if (!location.state?.scrollTo) return;
    if (location.pathname !== "/") return;

    const id = location.state.scrollTo;
    const el = document.getElementById(id);

    if (!el) {
      navigate(".", { replace: true, state: null });
      return;
    }

    lockDuringSmoothScroll();
    setActiveById(id);

    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    navigate(".", { replace: true, state: null });
  }, [
    enabled,
    location,
    navigate,
    lockDuringSmoothScroll,
    setActiveById,
  ]);

  /* =====================================================
     INTERSECTION OBSERVER (SCROLL-SPY)
     🚨 DISABLED WHILE MODAL IS OPEN
  ===================================================== */
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;
        if (!hasUserScrolledRef.current) return;

        if (window.scrollY <= 2) {
          setActive("Home");
          setHashQuietly("#home");
          return;
        }

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          )[0];

        if (!visible) return;

        const section = sections.find(
          (s) => s.id === visible.target.dataset.section
        );

        if (section) {
          setActive(section.name);
          setHashQuietly(`#${section.id}`);
        }
      },
      {
        threshold: 0,
        rootMargin: "-120px 0px -55% 0px",
      }
    );

    sections.forEach(({ id }) => {
      const marker = document.querySelector(`#${id} .spy-marker`);
      if (marker) {
        marker.dataset.section = id;
        observer.observe(marker);
      }
    });

    return () => observer.disconnect();
  }, [enabled, sections, setActive, setHashQuietly]);

  /* =====================================================
     SCROLL-TO-TOP INTEGRATION
  ===================================================== */
  useEffect(() => {
    const onScrollTopClick = () => {
      lockDuringSmoothScroll();
      setActive("Home");
      setHashQuietly("#home");
    };

    window.addEventListener("scrollToTop", onScrollTopClick);
    return () =>
      window.removeEventListener("scrollToTop", onScrollTopClick);
  }, [lockDuringSmoothScroll, setActive, setHashQuietly]);
}
