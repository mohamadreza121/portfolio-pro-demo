import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DecryptedText from "../components/DecryptedText";
import "./Projects.css";

/**
 * Notes:
 * - Add actual MP4 files under /public/projects/ and update `video` paths.
 * - If a project has no video, the card gracefully stays image-only.
 */

const projects = [
  {
    id: 1,
    title: "Enterprise Office Network",
    summary:
      "HQ + Branches with dual-ISP edge, segmented VLANs, secure routing, and Windows services.",
    tech: ["BGP", "OSPF", "FortiGate", "VLANs", "AD DS"],
    image: new URL("../assets/projects/p1-topology.png", import.meta.url).href,
    video: new URL("../assets/projects/p1-topology.mp4", import.meta.url).href,
  },
  {
    id: 2,
    title: "Multi-Branch WAN Architecture",
    summary: "OSPF internal routing with BGP redistribution and resilient WAN design.",
    tech: ["OSPF", "BGP", "Redistribution"],
    image: new URL("../assets/projects/p2-wan.png", import.meta.url).href,
    video: new URL("../assets/projects/p2-wan.mp4", import.meta.url).href,
  },
  {
    id: 3,
    title: "Firewall & VPN Security",
    summary:
      "Zone-based firewalling with site-to-site IPsec overlays and policy enforcement.",
    tech: ["FortiGate", "IPsec", "NAT"],
    image: new URL("../assets/projects/p3-firewall.png", import.meta.url).href,
    video: new URL("../assets/projects/p3-firewall.mp4", import.meta.url).href,
  },
  {
    id: 4,
    title: "Windows Server Infrastructure",
    summary: "Active Directory, DNS, DHCP, and Group Policy across enterprise sites.",
    tech: ["AD DS", "GPO", "DNS", "DHCP"],
    image: new URL("../assets/projects/p4-ad.png", import.meta.url).href,
    video: new URL("../assets/projects/p4-ad.mp4", import.meta.url).href,
  },
  {
    id: 5,
    title: "Layer-2 Network Defense",
    summary:
      "Protection against rogue devices using DHCP Snooping and Dynamic ARP Inspection.",
    tech: ["DHCP Snooping", "DAI", "Port Security"],
    image: new URL("../assets/projects/p5-l2.png", import.meta.url).href,
    video: new URL("../assets/projects/p5-l2.mp4", import.meta.url).href,
  },
  {
    id: 6,
    title: "Enterprise Operations & Hardening",
    summary: "Monitoring, logging, baselining, and operational hardening across the network.",
    tech: ["Syslog", "SNMP", "Hardening"],
    image: new URL("../assets/projects/p6-ops.png", import.meta.url).href,
    video: new URL("../assets/projects/p6-ops.mp4", import.meta.url).href,
  },
];

function usePrefersReducedMotion() {
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const apply = () => {
      reducedRef.current = !!mq.matches;
    };
    apply();

    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  return reducedRef;
}

export default function Projects() {
  const navigate = useNavigate();

  const reducedMotionRef = usePrefersReducedMotion();
  const cardsRef = useRef([]);
  const rafMagnetRef = useRef(new Map());
  const rafParallaxRef = useRef(0);

  const projectsList = useMemo(() => projects, []);

  /* =====================================================
     Magnetic hover (subtle translate, no 3D tilt)
  ===================================================== */
  const setCardOffset = useCallback((el, x, y) => {
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  }, []);

  const onCardPointerMove = useCallback(
    (e, idx) => {
      const el = cardsRef.current[idx];
      if (!el) return;

      // Disable on reduced-motion
      if (reducedMotionRef.current) return;

      // Disable on coarse pointers (mobile/touch)
      if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;

      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1

      // Calm magnetic strength (in px)
      const strength = 8;
      const tx = (px - 0.5) * strength * 2;
      const ty = (py - 0.5) * strength * 2;

      // rAF throttle per-card
      const map = rafMagnetRef.current;
      if (map.get(idx)) return;

      map.set(
        idx,
        requestAnimationFrame(() => {
          setCardOffset(el, tx, ty);
          map.delete(idx);
        })
      );
    },
    [reducedMotionRef, setCardOffset]
  );

  const onCardPointerLeave = useCallback(
    (idx) => {
      const el = cardsRef.current[idx];
      if (!el) return;

      setCardOffset(el, 0, 0);
      el.classList.remove("is-media-active");

      const vid = el.querySelector("video");
      if (vid) {
        try {
          vid.pause();
          vid.currentTime = 0;
        } catch {
          // ignore
        }
      }
    },
    [setCardOffset]
  );

  const onCardPointerEnter = useCallback(
    (idx) => {
      const el = cardsRef.current[idx];
      if (!el) return;

      // Start preview on hover (if video exists and not reduced motion)
      if (!reducedMotionRef.current) {
        const vid = el.querySelector("video");
        if (vid) {
          el.classList.add("is-media-active");
          try {
            vid.currentTime = 0;
            const p = vid.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          } catch {
            // ignore
          }
        }
      }
    },
    [reducedMotionRef]
  );

  const onCardFocus = useCallback(
    (idx) => {
      const el = cardsRef.current[idx];
      if (!el) return;

      // Keyboard focus should also preview (if video exists)
      if (!reducedMotionRef.current) {
        const vid = el.querySelector("video");
        if (vid) {
          el.classList.add("is-media-active");
          try {
            vid.currentTime = 0;
            const p = vid.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          } catch {
            // ignore
          }
        }
      }
    },
    [reducedMotionRef]
  );

  const onCardBlur = useCallback((idx) => {
    // When focus leaves the card, stop preview
    onCardPointerLeave(idx);
  }, [onCardPointerLeave]);

  /* =====================================================
     Scroll parallax (media drifts as the panel scrolls)
  ===================================================== */
  useEffect(() => {
    const root = document.getElementById("projects");
    if (!root) return;

    // In your ScrollDeck setup, the scroll container is the nearest .scroll-deck__panel
    const scrollContainer =
      root.closest(".scroll-deck__panel") || root.closest(".scroll-deck") || window;

    const maxShift = 18; // px (keep calm)

    const update = () => {
      rafParallaxRef.current = 0;

      // Disable parallax on reduced motion
      if (reducedMotionRef.current) {
        cardsRef.current.forEach((card) => {
          if (!card) return;
          card.style.setProperty("--media-y", `0px`);
        });
        return;
      }

      const viewportH =
        scrollContainer === window ? window.innerHeight : scrollContainer.clientHeight;

      const viewportMid =
        scrollContainer === window
          ? window.innerHeight / 2
          : scrollContainer.getBoundingClientRect().height / 2;

      cardsRef.current.forEach((card) => {
        if (!card) return;

        const r = card.getBoundingClientRect();

        // cardMid relative to viewport
        const cardMid = r.top + r.height / 2;

        // Normalize -1..1 based on distance from center
        const t = (cardMid - viewportMid) / viewportH;

        // Clamp and invert slightly for "cinematic" drift
        const clamped = Math.max(-1, Math.min(1, t));
        const y = -clamped * maxShift;

        card.style.setProperty("--media-y", `${y}px`);
      });
    };

    const schedule = () => {
      if (rafParallaxRef.current) return;
      rafParallaxRef.current = requestAnimationFrame(update);
    };

    // Initial
    schedule();

    if (scrollContainer === window) {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      return () => {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      };
    }

    scrollContainer.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      scrollContainer.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [reducedMotionRef]);

  /* =====================================================
     Render
  ===================================================== */
  return (
    <section id="projects" className="projects-page">
      <span className="spy-marker" />

      <div 
        className="projects-container"
        aria-label="Enterprise Network Architecture Portfolio"
      >
        {/* ==============================
           HEADER
        ============================== */}
        <header className="projects-hero">

          <h1 className="projects-title">
            <DecryptedText
              text="Enterprise Network Architecture"
              animateOn="view"
              sequential
              speed={80}
              revealDirection="center"
              encryptedClassName="encrypted"
              className="revealed"
            />
          </h1>

          <p className="projects-subtitle">
            A progressive, real-world enterprise infrastructure — designed, secured, routed,
            and operated as a unified system.
          </p>
        </header>

        {/* ==============================
           GRID
        ============================== */}
        <div className="projects-grid" role="list">
          {projectsList.map((project, idx) => (
            <article
              key={project.id}
              ref={(node) => {
                cardsRef.current[idx] = node;
              }}
              className="project-card"
              role="listitem"
              tabIndex={-1}
              onPointerEnter={() => onCardPointerEnter(idx)}
              onPointerLeave={() => onCardPointerLeave(idx)}
              onPointerMove={(e) => onCardPointerMove(e, idx)}
              onFocusCapture={() => onCardFocus(idx)}
              onBlurCapture={() => onCardBlur(idx)}
            >
              {/* Media */}
              <div className="project-media" aria-hidden="true">
                <img
                  src={project.image}
                  alt=""
                  loading="lazy"
                  className="project-img"
                  draggable="false"
                />

              {project.video ? (
                <video
                  className="project-video"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={project.video} type="video/mp4" />
                </video>
              ) : null}

                <div className="project-vignette" />
              </div>

              {/* Terminal Bar */}
              <div className="project-terminalbar" aria-hidden="true">
                <div className="term-dots">
                  <span className="term-dot dot-red" />
                  <span className="term-dot dot-yellow" />
                  <span className="term-dot dot-green" />
                </div>

                <div className="term-label">
                  {`netops@lab:~/projects$ open p${String(project.id).padStart(2, "0")}`}
                </div>

                <div className="term-spacer" />

                <div className="term-badge">
                  {project.tech?.[0] || "LAB"}
                </div>
              </div>

              {/* Content */}
              <div className="project-body">
                <div className="project-top">
                  <h2 className="project-title">{project.title}</h2>
                  <p className="project-summary">{project.summary}</p>
                </div>

                <div className="project-bottom">
                  <div className="project-tech" aria-label="Technologies used">
                    {project.tech.map((t, i) => (
                      <span key={i} className="tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="project-cta">
                    <button
                      className="btn-pill primary cursor-target"
                      onClick={() => navigate(`/projects/${project.id}`)}
                      aria-label={`View architecture for ${project.title}`}
                    >
                      View Architecture →
                    </button>
                  </div>
                </div>
              </div>

              {/* Focus ring helper */}
              <span className="project-focus-ring" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
