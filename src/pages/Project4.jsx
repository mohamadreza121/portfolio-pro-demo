import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DecryptedText from "../components/DecryptedText";
import CarouselProject from "../components/CarouselProject";
import LightboxPortal from "../components/LightboxPortal";
import "./Project4.css";

export default function Project4() {
  const [activeItem, setActiveItem] = useState(null);

  /* Always enter from the top */
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
      id: "p4-video-hero",
      type: "video",
      title: "Active Directory Infrastructure Walkthrough",
      caption:
        "Domain design, organizational units, group policies, and service integration.",
      mediaSrc: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      id: "p4-ad-structure",
      type: "image",
      title: "Active Directory Domain Structure",
      caption:
        "OU hierarchy aligned with departments and security boundaries.",
      mediaSrc: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    },
    {
      id: "p4-gpo",
      type: "image",
      title: "Group Policy Enforcement",
      caption:
        "Centralized configuration, security baselines, and user restrictions.",
      mediaSrc: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    },
    {
      id: "p4-dns-dhcp",
      type: "image",
      title: "DNS & DHCP Integration",
      caption:
        "Name resolution and address assignment integrated with Active Directory.",
      mediaSrc: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    },
    {
      id: "p4-auth",
      type: "image",
      title: "Authentication & Authorization Flow",
      caption:
        "Kerberos authentication, ticketing, and policy application sequence.",
      mediaSrc: "https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg",
    },
  ];

  return (
    <div className="project-page" id="project-4">
      <span className="spy-marker" />

      <div className="project-container">

        {/* ================= HERO ================= */}
        <section className="project-hero">
          <div className="project-hero-inner">
            <div className="project-hero-frame">
              <div className="project-hero-video">
                <iframe
                  title="Project 4 Hero Video"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="project-title-section">
              <h1 className="project-title">
                <span className="decrypt-stable">
                  <DecryptedText
                    text="Windows Server & Active Directory Infrastructure"
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
                label: "Identity",
                title: "Active Directory DS",
                desc: "Centralized identity, authentication, and authorization.",
              },
              {
                label: "Policy",
                title: "Group Policy",
                desc: "Security baselines, restrictions, and configuration control.",
              },
              {
                label: "Services",
                title: "DNS & DHCP",
                desc: "Core naming and addressing services integrated with AD.",
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
                src="/Topology-AD.png"
                alt="Active Directory Logical Architecture"
              />
            </div>

            <div className="cta-row project-topology-cta">
              <a className="btn-pill cursor-target">
                View AD structure & GPO configuration →
              </a>
            </div>
          </div>
        </section>

        {/* ================= ARCHITECTURE ================= */}
        <section className="project-architecture">
          <h2 className="section-title">Architecture & implementation</h2>

          <h3>Active Directory design</h3>
          <ul>
            <li>Single forest, single domain architecture.</li>
            <li>OU hierarchy mapped to departments and job roles.</li>
            <li>Role-based access control using security groups.</li>
          </ul>

          <h3>Group Policy strategy</h3>
          <ul>
            <li>Baseline security policies for users and computers.</li>
            <li>Password, lockout, and audit enforcement.</li>
            <li>Administrative templates and restriction policies.</li>
          </ul>

          <h3>Core services</h3>
          <ul>
            <li>DNS integrated with AD for secure dynamic updates.</li>
            <li>DHCP scopes aligned with VLAN segmentation.</li>
            <li>Centralized service management and resiliency.</li>
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
            <Link to="/projects/3" className="btn-pill cursor-target">
              ← Back to Project 3
            </Link>
            <Link to="/projects/5" className="btn-pill primary cursor-target">
              Continue to Project 5 →
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
