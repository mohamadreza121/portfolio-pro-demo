import { useState } from "react";
import DecryptedText from "../components/DecryptedText";
import ProfileCard from "../components/ProfileCard";
import "./AboutModern.css";

export default function About() {
  const [activePanel, setActivePanel] = useState(0);

  return (
    <div id="about" className="about-page">
      <span className="spy-marker" />

      <div className="about-container">
        {/* HEADER — CENTERED */}
        <div className="about-header centered">
          <h1 className="about-title-center">
            <DecryptedText
              text="About Me"
              animateOn="view"
              sequential
              speed={80}
              encryptedClassName="encrypted"
              className="revealed"
            />
          </h1>

          <p className="about-subtitle">
            Networking & IT Security student focused on designing, securing, and
            operating enterprise-grade infrastructure.
          </p>
        </div>

        {/* MAIN CONTENT ROW */}
        <div className="about-main-row">
          {/* LEFT — PROFILE CARD */}
          <div className="about-left">
            <ProfileCard
              name="Mohammadreza Heidarpoor"
              title="Networking & IT Security Student"
              handle="mammadcodes"
              status="busy"
              contactText="Contact Me"
              avatarUrl="/my-avatar.jpg"
              miniAvatarUrl="/my-avatar.jpg"
              enableTilt={false}
              enableMobileTilt={false}
            />
          </div>

          {/* RIGHT — CHASSIS PANEL */}
          <div className="about-right">
            <div className="about-stack-card chassis">
              {/* PANEL CONTENT */}
              <div className="about-panel">
                {activePanel === 0 && (
                  <>
                    <h2 className="section-title">Technical Skills</h2>

                    <div className="about-grid">
                      <div className="about-card chassis">
                        <h3>Networking</h3>
                        <p>
                          VLANs • Inter-VLAN Routing • OSPF • BGP • NAT • ACLs •
                          DHCP • DNS • STP • WAN • Troubleshooting
                        </p>
                      </div>

                      <div className="about-card chassis">
                        <h3>Security</h3>
                        <p>
                          Firewall Configuration • VPN (Site-to-Site & Remote) •
                          Cisco AnyConnect • Layer 2 Defense • Access Control
                        </p>
                      </div>

                      <div className="about-card chassis">
                        <h3>Systems & Tools</h3>
                        <p>
                          Windows Server • Active Directory • GPO • Hyper-V •
                          GNS3 • Packet Tracer • Visio • Draw.io
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activePanel === 1 && (
                  <>
                    <h2 className="section-title">Experience</h2>

                    <div className="about-wide-card chassis">
                      <p>
                        • Designed and deployed enterprise-style network topologies
                        <br />
                        • Configured PoE, QoS, VoIP (Cisco & Yealink)
                        <br />
                        • Installed and managed Windows Server (AD, DNS, DHCP)
                        <br />
                        • Built secure Remote-Access & Site-to-Site VPNs
                        <br />
                        • Taught networking using Packet Tracer & GNS3
                        <br />
                        • Built and deployed lab & client workstations
                      </p>
                    </div>
                  </>
                )}

                {activePanel === 2 && (
                  <>
                    <h2 className="section-title">Education</h2>

                    <div className="about-wide-card chassis">
                      <p>
                        <strong>
                          Bachelor of Information Technology (Networking & IT Security)
                        </strong>
                        <br />
                        Ontario Tech University — Expected 2027
                      </p>

                      <p className="about-edu-block">
                        <strong>High School Diploma (Mathematics & Physics)</strong>
                        <br />
                        Samen High School — Tehran, Iran
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* PANEL NAV */}
              <div className="about-panel-nav">
                <button
                  className="btn-pill cursor-target"
                  onClick={() => setActivePanel((prev) => (prev + 2) % 3)}
                  aria-label="Previous panel"
                >
                  ◀
                </button>

                <button
                  className="btn-pill cursor-target"
                  onClick={() => setActivePanel(0)}
                  aria-label="Technical skills"
                >
                  ●
                </button>

                <button
                  className="btn-pill cursor-target"
                  onClick={() => setActivePanel((prev) => (prev + 1) % 3)}
                  aria-label="Next panel"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
