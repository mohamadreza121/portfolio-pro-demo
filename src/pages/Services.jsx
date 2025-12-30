import DecryptedText from "../components/DecryptedText";
import "./Services.css";

const services = [
  {
    title: "Enterprise Network Design & Implementation",
    meta: "LAN/WAN Architecture, VLAN Design, Routing, Redundancy",
    price: "$250 – $1,500 CAD",
  },
  {
    title: "Cisco Router & Switch Configuration",
    meta: "IOS Configuration, VLANs, ACLs, NAT, DHCP, Optimization",
    price: "$120 – $900 CAD",
  },
  {
    title: "Firewall Deployment & Security Hardening",
    meta: "FortiGate, Palo Alto, Policies, Segmentation, Zero Trust",
    price: "$350 – $1,800 CAD",
  },
  {
    title: "VPN & Secure Remote Access",
    meta: "Site-to-Site VPN, SSL/IPsec, Remote Workforce Access",
    price: "$250 – $900 CAD",
  },
  {
    title: "Windows Server & Active Directory",
    meta: "AD DS, DNS, DHCP, Group Policy, NTFS Security",
    price: "$500 – $1,200 CAD",
  },
  {
    title: "Network Security Audits & Hardening",
    meta: "Configuration Review, Risk Analysis, Remediation Planning",
    price: "$300 – $1,500 CAD",
  },
];

export default function Services({ onRequestQuote }) {

  return (
    <div id="services" className="services-page">
      <span className="spy-marker" />

      <div className="services-container">
        {/* HERO */}
        <section className="services-hero-center">
          <h1 className="services-title-center">
            <DecryptedText
              text="Professional IT & Network Services"
              animateOn="view"
              sequential
              speed={80}
              revealDirection="center"
              encryptedClassName="encrypted"
              className="revealed"
            />
          </h1>

          <p className="services-subtitle">
            Security-first, enterprise-grade networking and infrastructure
            services tailored for small and mid-sized organizations.
          </p>
        </section>

        {/* SERVICE GRID */}
        <section className="services-grid">
          {services.map((s, idx) => (
            <article key={idx} className="service-cinematic-card">
              <div className="service-content">
                <h3 className="service-title">{s.title}</h3>

                <p className="service-meta">{s.meta}</p>

                <div className="service-footer">
                  <span className="service-price">{s.price}</span>

                  <button
                    type="button"
                    className="btn-pill cursor-target"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRequestQuote?.(s.title);
                    }}
                  >
                    Request Quote →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
