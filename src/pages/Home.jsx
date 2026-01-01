import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

import DecryptedText from "../components/DecryptedText";
import { navigateAndScroll } from "../utils/scrollToSection";

import "./HomeModern.css";
import "../components/TargetCursor.css";

export default function Home({ revealKey }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!revealKey) return;

    gsap.killTweensOf(".hero-enter");

    gsap.fromTo(
      ".hero-enter",
      { opacity: 0, y: 40, filter: "blur(12px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.0,
        ease: "power3.out",
        delay: 0,
        clearProps: "filter",
      }
    );
  }, [revealKey]);

  const openQuote = (service = "") => {
    window.dispatchEvent(
      new CustomEvent("openQuoteModal", { detail: { service } })
    );
  };

  return (
    <div id="home" className="home-page">
      <span className="spy-marker" />

      <div className="home-container">
        <section className="home-hero">
          <div className="hero-right hero-enter">
            <h1 className="home-title">
              <DecryptedText
                text="Mohammadreza Heidarpoor"
                animateOn="both"
                sequential
                speed={150}
                revealDirection="center"
                encryptedClassName="encrypted"
                className="revealed"
                revealDelay={260}
                revealKey={revealKey}
              />
            </h1>

            <h2 className="home-subtitle">
              <DecryptedText
                text="Network Engineer & Network Technician"
                animateOn="both"
                sequential
                speed={80}
                revealDirection="center"
                revealDelay={420}
                revealKey={revealKey}
              />
            </h2>

            {/* Optional minimal “value line” (kept short + serious) */}
            <p className="home-tagline">
              Secure, scalable network design. Clean documentation. Real-world labs.
            </p>

            <div className="home-cta-row">
              <button
                type="button"
                className="btn-pill primary cursor-target"
                onClick={() => navigateAndScroll(navigate, "projects")}
              >
                Projects
              </button>

              <button
                type="button"
                className="btn-pill cursor-target"
                onClick={() => navigateAndScroll(navigate, "services")}
              >
                Services
              </button>

              <button
                type="button"
                className="btn-pill cursor-target"
                onClick={() => openQuote("")}
              >
                Request a Quote
              </button>

              <a
                href="mailto:mrheidarpoor7@gmail.com"
                className="btn-pill cursor-target"
                onClick={(e) => e.stopPropagation()}
              >
                Contact
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
