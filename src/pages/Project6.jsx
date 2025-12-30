import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DecryptedText from "../components/DecryptedText";
import CarouselProject from "../components/CarouselProject";
import LightboxPortal from "../components/LightboxPortal";
import "./Project6.css";

export default function Project6() {
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeItem ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [activeItem]);

  const mediaItems = [
    {
      id: "p6-video-hero",
      type: "video",
      title: "Enterprise Ops Walkthrough",
      caption:
        "Monitoring, logging, NTP, management hardening, and recovery workflows.",
      mediaSrc: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      id: "p6-logging",
      type: "image",
      title: "Centralized Logging",
      caption: "Syslog aggregation with severity filtering.",
      mediaSrc: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    },
    {
      id: "p6-monitoring",
      type: "image",
      title: "Monitoring & Baselines",
      caption: "SNMP telemetry and threshold alerting.",
      mediaSrc: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    },
    {
      id: "p6-ntp",
      type: "image",
      title: "Time Integrity (NTP)",
      caption: "Consistent timestamps across infrastructure.",
      mediaSrc: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    },
    {
      id: "p6-hardening",
      type: "image",
      title: "Management Plane Hardening",
      caption: "AAA, SSH-only access, and management isolation.",
      mediaSrc: "https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg",
    },
  ];

  return (
    <div className="project-page" id="project-6">
      <span className="spy-marker" />

      <div className="project-container">

        {/* ================= HERO ================= */}
        <section className="project-hero">
          <div className="project-hero-inner">
            <div className="project-hero-frame">
              <div className="project-hero-video">
                <iframe
                  title="Project 6 Hero Video"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="project-title-section">
              <h1 className="project-title">
                <span className="decrypt-stable">
                  <DecryptedText
                    text="Enterprise Ops Capstone — Monitoring, Logging & Hardening"
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
                label: "Visibility",
                title: "Logging & Telemetry",
                desc: "Centralized syslog and SNMP monitoring.",
              },
              {
                label: "Control",
                title: "Management Hardening",
                desc: "Secure access to infrastructure devices.",
              },
              {
                label: "Resilience",
                title: "Backup & Recovery",
                desc: "Config backups and change control workflows.",
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
                src="/Topology-Ops.png"
                alt="Enterprise operations architecture"
              />
            </div>

            <div className="cta-row project-topology-cta">
              <a className="btn-pill cursor-target">
                View ops configs & dashboards →
              </a>
            </div>
          </div>
        </section>

        {/* ================= ARCHITECTURE ================= */}
        <section className="project-architecture">
          <h2 className="section-title">Architecture & implementation</h2>

          <h3>Logging & Monitoring</h3>
          <ul>
            <li>Central syslog collection and severity routing.</li>
            <li>SNMP telemetry and health baselines.</li>
            <li>Early warning indicators for instability.</li>
          </ul>

          <h3>Time & Management Plane</h3>
          <ul>
            <li>NTP consistency across all devices.</li>
            <li>AAA with role separation.</li>
            <li>SSH-only management access.</li>
          </ul>

          <h3>Recovery & Change Control</h3>
          <ul>
            <li>Scheduled configuration backups.</li>
            <li>Change logs with rollback plans.</li>
            <li>Recovery readiness validation.</li>
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
            <Link to="/projects/5" className="btn-pill cursor-target">
              ← Back to Project 5
            </Link>
            <Link to="/" state={{ scrollTo: "projects" }} className="btn-pill primary cursor-target">
              Return to Portfolio Overview →
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
