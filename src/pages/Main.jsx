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

    // Programmatic requests (navigate state)
    if (location.state?.scrollTo) {
      setPendingSectionId(location.state.scrollTo);
      navigate(".", { replace: true, state: null });
      return;
    }

    // Hash is used only for “nice URL” while scrolling.
    // On refresh we always start at Home, so ignore any hash and remove it.
    if (location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        location.pathname + location.search
      );
    }
  }, [location, navigate]);

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
