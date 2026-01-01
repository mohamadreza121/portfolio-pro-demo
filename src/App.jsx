import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { sendQuoteMessage } from "./services/messaging";

import Router from "./routes/Router";
import LetterGlitch from "./components/LetterGlitch";
import TargetCursor from "./components/TargetCursor";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import CurtainOverlay from "./components/CurtainOverlay";
import QuoteModal from "./components/QuoteModal";


import "./index.css";

export default function App() {
  /* =====================================================
     ROUTING
  ===================================================== */
  const location = useLocation();

  /* =====================================================
     GLOBAL STATE
  ===================================================== */
  const [theme, setTheme] = useState("night");
  const [active, setActive] = useState("Home");

  /* =====================================================
     PHASE STATE
  ===================================================== */
  const [phase, setPhase] = useState("preloader");
  // preloader → curtains → ready

  /* =====================================================
     REVEAL KEY
  ===================================================== */
  const [revealKey, setRevealKey] = useState(0);

  /* =====================================================
     INTERNAL GUARDS
  ===================================================== */
  const hasInitialRevealRef = useRef(false);

  /* =====================================================
     UI STATE
  ===================================================== */
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* =====================================================
     QUOTE MODAL STATE
  ===================================================== */
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteService, setQuoteService] = useState("");

  useEffect(() => {
    const onOpen = (e) => {
      const svc = e?.detail?.service ?? "";
      setQuoteService(svc);
      setQuoteOpen(true);
    };

    window.addEventListener("openQuoteModal", onOpen);
    return () => window.removeEventListener("openQuoteModal", onOpen);
  }, []);

  /* =====================================================
     DISABLE BROWSER SCROLL RESTORATION (CRITICAL)
  ===================================================== */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, [location.pathname]);

  /* =====================================================
     FORCE HARD SCROLL RESET ON FIRST LOAD
  ===================================================== */
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  /* =====================================================
     PHASE ATTRIBUTE
  ===================================================== */
  useEffect(() => {
    document.documentElement.setAttribute("data-phase", phase);
  }, [phase]);

  /* =====================================================
     THEME ATTRIBUTE
  ===================================================== */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "night" ? "day" : "night"));
  };

  /* =====================================================
     PRELOADER → CURTAINS
  ===================================================== */
  const handlePreloaderComplete = useCallback(() => {
    setPhase("curtains");
  }, []);

  /* =====================================================
     CURTAINS START → REVEAL
  ===================================================== */
  const handleCurtainsStartReveal = useCallback(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setRevealKey((k) => k + 1);
  }, []);

  /* =====================================================
     CURTAINS → READY
  ===================================================== */
  const handleCurtainsComplete = useCallback(() => {
    setPhase("ready");
  }, []);

  /* =====================================================
     ENSURE HOME IS ACTIVE AFTER BOOT
  ===================================================== */
  useEffect(() => {
    if (phase !== "ready") return;

    requestAnimationFrame(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setActive("Home");
    });
  }, [phase]);

  /* =====================================================
     RE-TRIGGER REVEAL WHEN RETURNING TO "/"
  ===================================================== */
  useEffect(() => {
    if (phase !== "ready") return;
    if (location.pathname !== "/") return;

    if (!hasInitialRevealRef.current) {
      hasInitialRevealRef.current = true;
      return;
    }

    requestAnimationFrame(() => {
      setRevealKey((k) => k + 1);
    });
  }, [location.pathname, phase]);



  /* =====================================================
    CLEAR SECTION HASH OUTSIDE MAIN ROUTE
  ===================================================== */
  useEffect(() => {
    if (location.pathname !== "/" && window.location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        location.pathname + location.search
      );
    }
  }, [location.pathname, location.search]);


  /* =====================================================
     SCROLL-TOP VISIBILITY
  ===================================================== */
  useEffect(() => {
    // Main uses ScrollDeck (internal scroller). Project pages use window.
    if (location.pathname === "/") {
      const onDeckState = (e) => {
        const d = e?.detail || {};
        const idx = Number(d.index || 0);
        const top = Number(d.scrollTop || 0);
        setShowScrollTop(idx > 0 || top > 240);
      };

      window.addEventListener("deck:state", onDeckState);
      return () => window.removeEventListener("deck:state", onDeckState);
    }

    const onScroll = () => setShowScrollTop(window.scrollY > 240);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname, location.search]); // keep both if you reference both

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="app-root">
      {(phase === "preloader" || phase === "curtains") && (
        <CurtainOverlay
          phase={phase}
          onStartReveal={handleCurtainsStartReveal}
          onComplete={handleCurtainsComplete}
        />
      )}

      {phase === "preloader" && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {(phase === "curtains" || phase === "ready") && (
        <>
          <Navbar
            active={active}
            onSetActive={setActive}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          {showScrollTop && (
            <button
              className="scroll-top-btn cursor-target"
              onClick={() => {
                if (location.pathname === "/") {
                  window.dispatchEvent(new Event("deck:scrollToTop"));
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }

                // Kept for backward-compat / any listeners elsewhere
                window.dispatchEvent(new Event("scrollToTop"));
              }}
            >
              <FaArrowUp size={22} />
            </button>
          )}
        </>
      )}

      <LetterGlitch
        theme={theme}
        glitchSpeed={50}
        centerVignette={false}
        outerVignette
        smooth
      />

      <TargetCursor spinDuration={2.2} hideDefaultCursor parallaxOn />

      <div
        className={[
          "site-shell",
          revealKey > 0 ? "site-visible" : "site-hidden",
          phase === "ready" ? "site-unlocked" : "site-locked",
        ].join(" ")}
      >
        <Router
          theme={theme}
          toggleTheme={toggleTheme}
          active={active}
          setActive={setActive}
          revealKey={revealKey}
          onRequestQuote={(service) => {
            setQuoteService(service || "");
            setQuoteOpen(true);
          }}
          isQuoteOpen={quoteOpen}
        />

        <QuoteModal
          open={quoteOpen}
          service={quoteService}
          onClose={() => setQuoteOpen(false)}
          onSubmit={(data) => sendQuoteMessage(data, quoteService)}
        />
      </div>
    </div>
  );
}
