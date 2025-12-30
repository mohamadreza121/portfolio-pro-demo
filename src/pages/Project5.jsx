import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DecryptedText from "../components/DecryptedText";
import CarouselProject from "../components/CarouselProject";
import LightboxPortal from "../components/LightboxPortal";
import "./Project5.css";

export default function Project5() {
  const [activeItem, setActiveItem] = useState(null);

  /* Always enter from the top */
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  /* Lock scroll on lightbox */
  useEffect(() => {
    document.body.style.overflow = activeItem ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [activeItem]);

  const mediaItems = [
    {
      id: "p5-video-hero",
      type: "video",
      title: "Layer 2 Defense Walkthrough",
      caption:
        "DHCP Snooping and Dynamic ARP Inspection protecting the access layer.",
      mediaSrc: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      id: "p5-dhcp",
      type: "image",
      title: "DHCP Snooping Policy",
      caption:
        "Trusted uplinks, untrusted access ports, and binding table creation.",
      mediaSrc: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    },
    {
      id: "p5-dai",
      type: "image",
      title: "Dynamic ARP Inspection",
      caption:
        "ARP validation using DHCP Snooping bindings to block spoofing.",
      mediaSrc: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    },
    {
      id: "p5-attack",
      type: "image",
      title: "Attack Simulation",
      caption:
        "Rogue DHCP and ARP spoof attempts blocked at the switch.",
      mediaSrc: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    },
    {
      id: "p5-rate",
      type: "image",
      title: "Rate Limiting & Violations",
      caption:
        "DHCP and ARP rate limits with enforcement actions.",
      mediaSrc: "https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg",
    },
  ];

  return (
    <div className="project-page" id="project-5">
      <span className="spy-marker" />

      <div className="project-container">

        {/* ================= HERO ================= */}
        <section className="project-hero">
          <div className="project-hero-inner">
            <div className="project-hero-frame">
              <div className="project-hero-video">
                <iframe
                  title="Project 5 Hero Video"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="project-title-section">
              <h1 className="project-title">
                <span className="decrypt-stable">
                  <DecryptedText
                    text="Layer 2 Defense — DHCP Snooping & Dynamic ARP Inspection"
                    animateOn="view"
                    sequential
                    speed={55}
                    revealDirection="start"
                    className="revealed"
                    encryptedClassName="encrypted"
                  />
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* ================= OVERVIEW ================= */}
        <section className="project-overview">
          <h2 className="section-title">Project overview</h2>

          <div className="project-overview-grid">
            {[
              {
                label: "Threat",
                title: "Rogue DHCP & MITM",
                desc: "Blocks unauthorized DHCP servers and gateway impersonation.",
              },
              {
                label: "Control",
                title: "DHCP Snooping",
                desc: "Builds trusted IP–MAC bindings per VLAN.",
              },
              {
                label: "Enforcement",
                title: "Dynamic ARP Inspection",
                desc: "Drops spoofed ARP packets at wire speed.",
              },
            ].map((item, i) => (
              <div key={i} className="project-overview-card">
                <div className="project-overview-label">{item.label}</div>
                <div className="project-overview-title">{item.title}</div>
                <div className="meta project-overview-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TOPOLOGY ================= */}
        <section className="project-topology">
          <div className="project-section-inner">
            <div className="project-topology-image">
              <img
                src="/Topology-L2Defense.png"
                alt="Layer 2 defense topology"
              />
            </div>

            <div className="cta-row project-topology-cta">
              <a className="btn-pill cursor-target">
                View switch configs & validation output →
              </a>
            </div>
          </div>
        </section>

        {/* ================= ARCHITECTURE ================= */}
        <section className="project-architecture">
          <h2 className="section-title">Architecture & implementation</h2>

          <h3>DHCP Snooping</h3>
          <ul>
            <li>Enable on user VLANs and mark uplinks as trusted.</li>
            <li>Block DHCP offers on untrusted access ports.</li>
            <li>Maintain per-VLAN binding tables.</li>
          </ul>

          <h3>Dynamic ARP Inspection</h3>
          <ul>
            <li>Validate ARP packets against DHCP Snooping bindings.</li>
            <li>Apply inspection limits and violation handling.</li>
            <li>Prevent ARP-based MITM attacks.</li>
          </ul>

          <h3>Hardening</h3>
          <ul>
            <li>Rate-limit DHCP and ARP packets.</li>
            <li>Explicit trust on trunk ports.</li>
            <li>Complement with Port Security and STP protections.</li>
          </ul>
        </section>

        {/* ================= GALLERY ================= */}
        <section className="project-gallery">
          <h2 className="section-title">Implementation gallery</h2>

          <CarouselProject
            items={mediaItems}
            onOpen={(item) => setActiveItem(item)}
            isLightboxOpen={!!activeItem}
          />
        </section>

        {/* ================= NAV ================= */}
        <section className="project-navigation">
          <div className="cta-row">
            <Link to="/projects/4" className="btn-pill cursor-target">
              ← Back to Project 4
            </Link>
            <Link to="/projects/6" className="btn-pill primary cursor-target">
              Continue to Project 6 →
            </Link>
          </div>
        </section>

        {activeItem && (
          <LightboxPortal>
            <div
              className="lightbox-project"
              role="dialog"
              aria-modal="true"
              onClick={() => setActiveItem(null)}
            >
              <div
                className="lightbox-project-inner"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={activeItem.mediaSrc} alt={activeItem.title} />
              </div>
            </div>
          </LightboxPortal>
        )}
      </div>
    </div>
  );
}
