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

    // Kill any previous hero animations to avoid stacking
    gsap.killTweensOf(".hero-enter");

    // Hero container reveal (opacity / translate / blur)
    gsap.fromTo(
      ".hero-enter",
      {
        opacity: 0,
        y: 40,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.0,
        ease: "power3.out",
        delay: 0, // Curtain controls timing
      }
    );
  }, [revealKey]);

  return (
    <div id="home" className="home-page">
      <span className="spy-marker" />

      <div className="home-container">
        <section className="home-hero">
          {/* RIGHT COLUMN (content reveal) */}
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
                revealDelay={420}
                revealKey={revealKey}
              />
            </h1>

            <h2 className="home-subtitle">
              <DecryptedText
                text="Aspiring Network Engineer & Network Technician"
                animateOn="both"
                sequential
                speed={80}
                revealDirection="center"
                revealDelay={620}
                revealKey={revealKey}
              />
            </h2>

            <div className="home-cta-row">
              <button
                type="button"
                className="btn-pill primary cursor-target"
                onClick={() => navigateAndScroll(navigate, "projects")}
              >
                View My Projects
              </button>

              <button
                type="button"
                className="btn-pill cursor-target"
                onClick={() => navigateAndScroll(navigate, "certifications")}
              >
                Certifications
              </button>

              <a
                href="mailto:mrheidarpoor7@gmail.com"
                className="btn-pill cursor-target"
                onClick={(e) => {
                  // Prevent scroll-spy confusion when leaving the page
                  e.stopPropagation();
                }}
              >
                Contact Me
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
