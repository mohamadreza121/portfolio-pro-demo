'use client';

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Home from "./Home";
import About from "./About";
import Projects from "./Projects";
import Certifications from "./Certifications";
import Services from "./Services";
import Footer from "../components/footer";
import "../components/TargetCursor.css";

import ScrollDeck from "../components/ScrollDeck";

export default function Main({
  setActive,
  revealKey,
  onRequestQuote,
  isQuoteOpen
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [pendingSectionId, setPendingSectionId] = useState(null);

  /* =====================================================
    NAV REQUESTS (Navbar clicks / deep-links)
  ===================================================== */
  useEffect(() => {
    if (location.pathname !== "/") return;

    const stateScrollTo = location.state?.scrollTo || null;

    // Ignore hash on refresh; remove it so we always start at Home.
    if (location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        location.pathname + location.search
      );
    }

    // Only handle programmatic requests (navigate state)
    if (!stateScrollTo) return;

    const run = () => {
      setPendingSectionId(stateScrollTo);
      navigate(".", { replace: true, state: null }); // clear so it doesn't retrigger
    };

    // Avoid synchronous setState in effect
    if (typeof queueMicrotask === "function") queueMicrotask(run);
    else Promise.resolve().then(run);
  }, [location.pathname, location.search, location.hash, location.state?.scrollTo, navigate]);


  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="main-page">
      <ScrollDeck
        setActive={setActive}
        isQuoteOpen={isQuoteOpen}
        revealKey={revealKey}
        pendingSectionId={pendingSectionId}
        onPendingHandled={() => setPendingSectionId(null)}
      >
        <Home revealKey={revealKey} />
        <About />
        <Projects />
        <Certifications />
        <>
          <Services onRequestQuote={onRequestQuote} />
          <Footer onRequestQuote={onRequestQuote} />
        </>
      </ScrollDeck>
    </div>
  );
}
