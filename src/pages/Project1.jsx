import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DecryptedText from "../components/DecryptedText";
import CarouselProject from "../components/CarouselProject";
import LightboxPortal from "../components/LightboxPortal";
import "./Project1.css";

export default function Project1() {
  const [activeItem, setActiveItem] = useState(null);

  /* Always enter from the top */
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  useEffect(() => {
    if (activeItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeItem]);


  const mediaItems = [
    {
      id: "p1-video-hero",
      type: "video",
      title: "Project 1 – Master Topology Walkthrough",
      caption:
        "End-to-end tour: HQ edge, branch connectivity, routing planes, security zones, and Windows services.",
      mediaSrc: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      id: "p1-img-topology",
      type: "image",
      title: "Enterprise Topology Diagram",
      caption:
        "Physical + logical view of HQ, two branches, dual ISP edges, and routed/security boundaries.",
      mediaSrc: "/Topology.png",
    },
    {
      id: "p1-img-hq-edge",
      type: "image",
      title: "HQ Perimeter – FortiGate Zones & NAT",
      caption:
        "HQ_INSIDE / DMZ / INTERNET zoning with explicit policies, NAT, and logging.",
      mediaSrc: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    },
    {
      id: "p1-img-bgp",
      type: "image",
      title: "WAN Edge – eBGP Dual-Homing",
      caption:
        "Dual upstream peering with route policy to prefer ISP1 while retaining ISP2 as failover.",
      mediaSrc: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    },
    {
      id: "p1-img-ospf",
      type: "image",
      title: "IGP – OSPF Areas & Summarization",
      caption:
        "Area 0 at HQ with branch areas and controlled redistribution boundaries.",
      mediaSrc: "https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg",
    },
  ];

  return (
    <div className="project-page" id="project-1">
      <span className="spy-marker" />

      <div className="project-container">

        {/* ================= HERO ================= */}
        <section className="project-hero">
          <div className="project-hero-inner">

            <div className="project-hero-frame">
              <div className="project-hero-video">
                <iframe
                  title="Project 1 Hero Video"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="project-title-section">
              <h1 className="project-title">
                <span className="decrypt-stable">
                  <DecryptedText
                    text="Secure Enterprise Office Network — HQ & Branches"
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
                label: "Routing",
                title: "eBGP + OSPF",
                desc: "Dual-homed WAN edge with internal IGP segmentation.",
              },
              {
                label: "Security",
                title: "FortiGate + IPsec",
                desc: "Zoned firewall policies and encrypted site-to-site overlays.",
              },
              {
                label: "Services",
                title: "AD DS / DNS / DHCP",
                desc: "Centralized identity, naming, and policy enforcement.",
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
              <img src="/Topology.png" alt="Enterprise Network Topology Diagram" />
            </div>

            <div className="cta-row project-topology-cta">
              <a className="btn-pill cursor-target">
                View full configs & GNS3 files →
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
            <Link to="/" state={{ scrollTo: "projects" }} className="btn-pill primary cursor-target">
              ← Back to Projects
            </Link>
            <Link to="/projects/2" className="btn-pill cursor-target">
              Continue to Project 2 →
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
