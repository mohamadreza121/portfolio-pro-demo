import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DecryptedText from "../components/DecryptedText";
import CarouselProject from "../components/CarouselProject";
import LightboxPortal from "../components/LightboxPortal";
import "./Project3.css";

export default function Project3() {
  const [activeItem, setActiveItem] = useState(null);

  /* Always enter from the top */
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  /* Lock scroll when lightbox is open */
  useEffect(() => {
    if (activeItem) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeItem]);

  const mediaItems = [
    {
      id: "p3-video-hero",
      type: "video",
      title: "Firewall & VPN Architecture Walkthrough",
      caption:
        "End-to-end security flow: perimeter zoning, policy enforcement, and encrypted overlays.",
      mediaSrc: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      id: "p3-fw-zones",
      type: "image",
      title: "Firewall Zoning Model",
      caption:
        "Explicit INSIDE / DMZ / VPN / INTERNET zones with least-privilege policies.",
      mediaSrc: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    },
    {
      id: "p3-fw-policy",
      type: "image",
      title: "Stateful Policy Enforcement",
      caption:
        "Inbound, outbound, and inter-zone policies with logging and inspection.",
      mediaSrc: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    },
    {
      id: "p3-ipsec",
      type: "image",
      title: "Site-to-Site IPsec Tunnels",
      caption:
        "Encrypted tunnels between HQ and branches with routing over the overlay.",
      mediaSrc: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    },
    {
      id: "p3-ssl",
      type: "image",
      title: "Remote Access VPN",
      caption:
        "SSL/IPsec remote user access with identity-based policy control.",
      mediaSrc: "https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg",
    },
  ];

  return (
    <div className="project-page" id="project-3">
      <span className="spy-marker" />

      <div className="project-container">
        {/* ================= HERO ================= */}
        <section className="project-hero">
          <div className="project-hero-inner">
            <div className="project-hero-frame">
              <div className="project-hero-video">
                <iframe
                  title="Project 3 Hero Video"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="project-title-section">
              <h1 className="project-title">
                <span className="decrypt-stable">
                  <DecryptedText
                    text="Firewall Enforcement & Secure VPN Architecture"
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
                label: "Firewall",
                title: "Zone-Based Security",
                desc: "Explicit trust boundaries with least-privilege access control.",
              },
              {
                label: "VPN",
                title: "IPsec + SSL",
                desc: "Encrypted tunnels for branches and remote workforce.",
              },
              {
                label: "Inspection",
                title: "Stateful Policies",
                desc: "Session awareness, logging, and traffic inspection.",
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
              <img src="/Topology-Security.png" alt="Firewall and VPN Topology Diagram" />
            </div>

            <div className="cta-row project-topology-cta">
              <a className="btn-pill cursor-target">
                View firewall configs & VPN setup →
              </a>
            </div>
          </div>
        </section>

        {/* ================= GALLERY ================= */}
        <section className="project-gallery">
          <h2 className="section-title">Implementation gallery</h2>

          <CarouselProject items={mediaItems} onOpen={(item) => setActiveItem(item)} isLightboxOpen={!!activeItem}/>
        </section>

        {/* ================= NAV ================= */}
        <section className="project-navigation">
          <div className="cta-row">
            <Link to="/projects/2" className="btn-pill primary cursor-target">
              ← Back to Project 2
            </Link>
            <Link to="/projects/4" className="btn-pill cursor-target">
              Continue to Project 4 →
            </Link>
          </div>
        </section>

        {/* ================= LIGHTBOX ================= */}
        {activeItem && (
          <LightboxPortal>
            <div
              className="lightbox-project"
              role="dialog"
              aria-modal="true"
              onClick={() => setActiveItem(null)}
            >
              <div className="lightbox-project-inner" onClick={(e) => e.stopPropagation()}>
                <img src={activeItem.mediaSrc} alt={activeItem.title} />
              </div>
            </div>
          </LightboxPortal>
        )}
      </div>
    </div>
  );
}
