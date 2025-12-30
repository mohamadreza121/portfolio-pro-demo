import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DecryptedText from "../components/DecryptedText";
import CarouselProject from "../components/CarouselProject";
import LightboxPortal from "../components/LightboxPortal";
import "./Project2.css";

export default function Project2() {
  const [activeItem, setActiveItem] = useState(null);

  /* Always enter from top */
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  /* Lock body scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = activeItem ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [activeItem]);

  /* ================= MEDIA ================= */
  const mediaItems = [
    {
      id: "p2-video-hero",
      type: "video",
      title: "Project 2 – OSPF & BGP Enterprise Walkthrough",
      caption:
        "Multi-area OSPF design with BGP redistribution boundaries and resilient WAN routing.",
      mediaSrc: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      id: "p2-img-wan",
      type: "image",
      title: "Enterprise WAN Architecture",
      caption:
        "HQ core with multiple branches connected through routed WAN links.",
      mediaSrc: "/Topology-Project2.png",
    },
    {
      id: "p2-img-ospf",
      type: "image",
      title: "OSPF Area Design",
      caption:
        "Backbone Area 0 with branch areas and controlled summarization.",
      mediaSrc: "https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg",
    },
    {
      id: "p2-img-bgp",
      type: "image",
      title: "BGP Redistribution Edge",
      caption:
        "Clear demarcation between IGP and EGP using route policies.",
      mediaSrc: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    },
    {
      id: "p2-img-failover",
      type: "image",
      title: "Routing Resiliency & Failover",
      caption:
        "Deterministic failover paths and fast convergence behavior.",
      mediaSrc: "https://i.ytimg.com/vi/fRh_vgS2dFE/hqdefault.jpg",
    },
  ];

  return (
    <div className="project-page" id="project-2">
      <span className="spy-marker" />

      <div className="project-container">

        {/* ================= HERO ================= */}
        <section className="project-hero">
          <div className="project-hero-inner">
            <div className="project-hero-frame">
              <div className="project-hero-video">
                <iframe
                  title="Project 2 Hero Video"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="project-title-section">
              <h1 className="project-title">
                <span className="decrypt-stable">
                  <DecryptedText
                    text="Multi-Branch Enterprise Network — OSPF & BGP"
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
                label: "IGP",
                title: "Multi-Area OSPF",
                desc: "Hierarchical area design with summarization at ABRs.",
              },
              {
                label: "EGP",
                title: "BGP Integration",
                desc: "Controlled redistribution at the enterprise edge.",
              },
              {
                label: "Resiliency",
                title: "Fast Convergence",
                desc: "Deterministic failover across WAN paths.",
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
                src="/Topology-Project2.png"
                alt="Project 2 Enterprise Routing Topology"
              />
            </div>

            <div className="cta-row project-topology-cta">
              <a className="btn-pill cursor-target">
                View routing policies & configs →
              </a>
            </div>
          </div>
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
            <Link to="/projects/1" className="btn-pill cursor-target">
              ← Back to Project 1
            </Link>
            <Link to="/projects/3" className="btn-pill primary cursor-target">
              Continue to Project 3 →
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
                <img
                  src={activeItem.mediaSrc}
                  alt={activeItem.title}
                />
              </div>
            </div>
          </LightboxPortal>
        )}
      </div>
    </div>
  );
}
