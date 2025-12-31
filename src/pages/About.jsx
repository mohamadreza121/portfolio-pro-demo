import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DecryptedText from "../components/DecryptedText";
import ProfileCard from "../components/ProfileCard";
import "./AboutModern.css";

/**
 * Small, lightweight reveal-on-view helper (no GSAP).
 * - Works inside ScrollDeck panels because it observes viewport visibility.
 * - Respects reduced-motion by skipping transforms.
 *
 * IMPORTANT (lint):
 * - Return a tuple so the render layer uses plain identifiers (heroRef, heroInView),
 *   avoiding "ref-like" property access that triggers react-hooks/refs.
 */
function useRevealOnView(
  { threshold = 0.12, rootMargin = "0px 0px -10% 0px" } = {}
) {
  const ref = useRef(null);

  const reduce = useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // If reduced motion is enabled, start revealed (no effect-time setState).
  const [inView, setInView] = useState(() => reduce);

  useEffect(() => {
    if (reduce) return;
    if (inView) return;

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [reduce, inView, threshold, rootMargin]);

  return [ref, inView];
}

export default function About() {
  const CHAPTERS = useMemo(
    () => [
      { id: "about-story", label: "Story" },
      { id: "about-now", label: "Now" },
      { id: "about-capabilities", label: "Capabilities" },
      { id: "about-proof", label: "Proof" },
    ],
    []
  );

  const [activeChapter, setActiveChapter] = useState("about-story");

  const scrollToChapter = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    setActiveChapter(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Keep the active pill in sync as user scrolls (subtle, lightweight).
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) return;

    const ids = CHAPTERS.map((c) => c.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible?.target?.id) setActiveChapter(visible.target.id);
      },
      { threshold: [0.18, 0.28, 0.38], rootMargin: "-10% 0px -55% 0px" }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [CHAPTERS]);

  // Reveal blocks (tuple form avoids react-hooks/refs render-property access)
  const [heroRef, heroInView] = useRevealOnView({ threshold: 0.08 });
  const [storyRef, storyInView] = useRevealOnView();
  const [nowRef, nowInView] = useRevealOnView();
  const [capsRef, capsInView] = useRevealOnView();
  const [proofRef, proofInView] = useRevealOnView();

  return (
    <div id="about" className="about-page">
      <span className="spy-marker" />

      <div className="about-container">
        {/* =====================================================
           HERO
        ===================================================== */}
        <header
          ref={heroRef}
          className={`about-hero ${heroInView ? "is-inview" : ""}`}
        >
          <h1 className="about-title">
            <DecryptedText
              text="About Me"
              animateOn="view"
              sequential
              speed={80}
              encryptedClassName="encrypted"
              className="revealed"
            />
          </h1>

          <p className="about-lede">
            I design and harden enterprise-style networks—then document them as
            portfolio-ready architectures.
          </p>

          <div
            className="about-chapterbar"
            role="tablist"
            aria-label="About chapters"
          >
            {CHAPTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`about-chip cursor-target ${
                  activeChapter === c.id ? "active" : ""
                }`}
                onClick={() => scrollToChapter(c.id)}
                aria-current={activeChapter === c.id ? "true" : undefined}
              >
                {c.label}
              </button>
            ))}
          </div>
        </header>

        {/* =====================================================
           LAYOUT: PROFILE (sticky) + STORY COLUMN
        ===================================================== */}
        <div className="about-layout">
          {/* LEFT: Profile */}
          <aside className="about-left">
            <div className="about-sticky">
              <ProfileCard
                name="Mohammadreza Heidarpoor"
                title="Networking & IT Security (Student / Builder)"
                handle="mammadcodes"
                status="busy"
                contactText="Contact Me"
                avatarUrl="/my-avatar.jpg"
                miniAvatarUrl="/my-avatar.jpg"
                enableTilt={true}
                enableMobileTilt={false}
              />

              <div className="about-miniFacts" aria-label="Quick facts">
                <div className="fact">
                  <span className="k">Focus</span>
                  <span className="v">Enterprise Networking + Security</span>
                </div>
                <div className="fact">
                  <span className="k">Strength</span>
                  <span className="v">Routing, segmentation, VPN, ops</span>
                </div>
                <div className="fact">
                  <span className="k">Style</span>
                  <span className="v">Clean diagrams + reproducible labs</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: Narrative */}
          <main className="about-right">
            {/* ===================== STORY ===================== */}
            <section
              id="about-story"
              ref={storyRef}
              className={`about-block about-anchor ${storyInView ? "is-inview" : ""}`}
            >
              <div className="about-blockHead">
                <h2 className="about-h2">Story</h2>
                <p className="about-muted">
                  A practical path: build systems, secure them, then teach what works.
                </p>
              </div>

              <div className="about-storyGrid">
                <article className="storyCard">
                  <h3>Built from hardware upward</h3>
                  <p>
                    I started by building and configuring PCs and client systems—then
                    expanded into router/switch deployments and troubleshooting under real constraints.
                  </p>
                  <div className="storyTagRow">
                    <span className="tag">PC Builds</span>
                    <span className="tag">Windows / Linux</span>
                    <span className="tag">Field Troubleshooting</span>
                  </div>
                </article>

                <article className="storyCard">
                  <h3>Networks that stay up</h3>
                  <p>
                    From two-tier topologies and campus switching to resilient routing,
                    I focus on segmentation, correctness, and predictable failure behavior.
                  </p>
                  <div className="storyTagRow">
                    <span className="tag">VLANs</span>
                    <span className="tag">OSPF / BGP</span>
                    <span className="tag">NAT / ACLs</span>
                  </div>
                </article>

                <article className="storyCard">
                  <h3>Security as a default</h3>
                  <p>
                    I treat secure access as mandatory: hardened edge policy, VPN overlays,
                    and layered L2 protections to reduce blast radius.
                  </p>
                  <div className="storyTagRow">
                    <span className="tag">AnyConnect VPN</span>
                    <span className="tag">DAI / Port-Sec</span>
                    <span className="tag">Firewall Policy</span>
                  </div>
                </article>
              </div>

              <div className="about-divider" />

              <div className="about-timeline">
                <div className="tItem">
                  <div className="dot" />
                  <div className="tBody">
                    <div className="tTop">
                      <span className="tRole">Computer Technician</span>
                      <span className="tWhen">2017–2019</span>
                    </div>
                    <p className="tText">
                      Built systems and configured OS/server environments; supported small networks.
                    </p>
                  </div>
                </div>

                <div className="tItem">
                  <div className="dot" />
                  <div className="tBody">
                    <div className="tTop">
                      <span className="tRole">Network Engineer (Apprenticeship)</span>
                      <span className="tWhen">2022</span>
                    </div>
                    <p className="tText">
                      Implemented PoE and VoIP with Cisco/Yealink and supported QoS in scalable designs.
                    </p>
                  </div>
                </div>

                <div className="tItem">
                  <div className="dot" />
                  <div className="tBody">
                    <div className="tTop">
                      <span className="tRole">Configuration Specialist</span>
                      <span className="tWhen">2023</span>
                    </div>
                    <p className="tText">
                      Established secure remote access via a TLS VPN using Cisco AnyConnect.
                    </p>
                  </div>
                </div>

                <div className="tItem">
                  <div className="dot" />
                  <div className="tBody">
                    <div className="tTop">
                      <span className="tRole">IT Support Specialist</span>
                      <span className="tWhen">2025–Present</span>
                    </div>
                    <p className="tText">
                      Hands-on troubleshooting and technical coaching—bridging operations and user experience.
                    </p>
                  </div>
                </div>

                <div className="tItem">
                  <div className="dot" />
                  <div className="tBody">
                    <div className="tTop">
                      <span className="tRole">Freelance Instructor</span>
                      <span className="tWhen">2022–Present</span>
                    </div>
                    <p className="tText">
                      Teaching CCNA and advanced routing concepts through labs and mentorship.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ===================== NOW ===================== */}
            <section
              id="about-now"
              ref={nowRef}
              className={`about-block about-anchor ${nowInView ? "is-inview" : ""}`}
            >
              <div className="about-blockHead">
                <h2 className="about-h2">What I’m building now</h2>
                <p className="about-muted">
                  Portfolio-grade infrastructure: designed like production, explained like documentation.
                </p>
              </div>

              <div className="about-callout">
                <p className="about-calloutText">
                  My work centers on enterprise design patterns: multi-site routing, segmented VLANs,
                  secure edge policy, and Windows services—validated in labs and presented with diagrams
                  and walkthroughs.
                </p>
              </div>

              <div className="about-metrics">
                <div className="metric">
                  <div className="metricTop">
                    <span className="metricNum">2</span>
                    <span className="metricLabel">ISP edge mindset</span>
                  </div>
                  <p className="metricDesc">Redundancy, failover thinking, and clean route control.</p>
                </div>

                <div className="metric">
                  <div className="metricTop">
                    <span className="metricNum">3</span>
                    <span className="metricLabel">pillars</span>
                  </div>
                  <p className="metricDesc">Security, scalability, and operational clarity.</p>
                </div>

                <div className="metric">
                  <div className="metricTop">
                    <span className="metricNum">1</span>
                    <span className="metricLabel">standard</span>
                  </div>
                  <p className="metricDesc">Everything must be reproducible from documentation.</p>
                </div>
              </div>
            </section>

            {/* ===================== CAPABILITIES ===================== */}
            <section
              id="about-capabilities"
              ref={capsRef}
              className={`about-block about-anchor ${capsInView ? "is-inview" : ""}`}
            >
              <div className="about-blockHead">
                <h2 className="about-h2">Capabilities</h2>
                <p className="about-muted">
                  I work across routing, switching, security, systems, and tooling—end to end.
                </p>
              </div>

              <div className="capGrid">
                <div className="capCard">
                  <h3>Routing & Switching</h3>
                  <div className="pillRow">
                    <span className="pill">OSPF</span>
                    <span className="pill">BGP</span>
                    <span className="pill">EIGRP</span>
                    <span className="pill">IPv4/IPv6</span>
                    <span className="pill">VLANs</span>
                    <span className="pill">DHCP/DNS</span>
                    <span className="pill">NAT</span>
                  </div>
                </div>

                <div className="capCard">
                  <h3>Security</h3>
                  <div className="pillRow">
                    <span className="pill">TLS VPN (AnyConnect)</span>
                    <span className="pill">ACLs</span>
                    <span className="pill">Port Security</span>
                    <span className="pill">DAI</span>
                    <span className="pill">Endpoint Security</span>
                  </div>
                </div>

                <div className="capCard">
                  <h3>Systems & Labs</h3>
                  <div className="pillRow">
                    <span className="pill">Windows Server</span>
                    <span className="pill">AD DS / GPO</span>
                    <span className="pill">Hyper-V</span>
                    <span className="pill">GNS3</span>
                    <span className="pill">Packet Tracer</span>
                    <span className="pill">Draw.io</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ===================== PROOF ===================== */}
            <section
              id="about-proof"
              ref={proofRef}
              className={`about-block about-anchor ${proofInView ? "is-inview" : ""}`}
            >
              <div className="about-blockHead">
                <h2 className="about-h2">Proof</h2>
                <p className="about-muted">
                  Credentials and education that reinforce the hands-on work.
                </p>
              </div>

              <div className="proofGrid">
                <div className="proofCard">
                  <h3>Certification highlight</h3>
                  <p>
                    Cisco Certified Specialist – Enterprise Core (ENCOR), plus networking/security
                    credentials across routing, endpoint security, and foundational cyber concepts.
                  </p>
                </div>

                <div className="proofCard">
                  <h3>Education</h3>
                  <p>
                    Bachelor of Information Technology (In Progress) — York University (2025–2029),
                    after transferring from Ontario Tech University (Networking & IT Security).
                  </p>
                </div>

                <div className="proofCard">
                  <h3>What I’m aiming for</h3>
                  <p>
                    Junior Network Engineer / Network Technician roles where I can ship reliable networks,
                    harden access paths, and keep operations clean.
                  </p>
                </div>
              </div>

              <div className="about-ctaRow">
                <button
                  type="button"
                  className="btn-pill primary cursor-target"
                  onClick={() =>
                    window.open(
                      "https://www.credly.com/users/mohammadreza-heidarpoor/badges",
                      "_blank"
                    )
                  }
                >
                  Verify on Credly →
                </button>

                <button
                  type="button"
                  className="btn-pill cursor-target"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent("openQuoteModal", {
                        detail: { service: "Consulting" },
                      })
                    );
                  }}
                >
                  Work with me →
                </button>
              </div>
            </section>

            {/* Mobile bottom breathing room */}
            <div className="about-bottomPad" aria-hidden="true" />
          </main>
        </div>
      </div>
    </div>
  );
}
