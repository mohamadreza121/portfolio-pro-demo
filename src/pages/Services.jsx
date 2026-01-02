import DecryptedText from "../components/DecryptedText";
import "./Services.css";

const services = [
  {
    title: "Enterprise Network Design & Implementation",
    meta: "LAN/WAN Architecture, VLAN Design, Routing, Redundancy",
    price: "$250 – $1,500 CAD",
    host: "r1-core",
    shell: "sh",
    cmd: "show ip bgp summary && show ip ospf neighbor",
  },
  {
    title: "Cisco Router & Switch Configuration",
    meta: "IOS Configuration, VLANs, ACLs, NAT, DHCP, Optimization",
    price: "$120 – $900 CAD",
    host: "sw1-dist",
    shell: "sh",
    cmd: "show vlan brief && show ip interface brief",
  },
  {
    title: "Firewall Deployment & Security Hardening",
    meta: "FortiGate, Palo Alto, Policies, Segmentation, Zero Trust",
    price: "$350 – $1,800 CAD",
    host: "fw01-edge",
    shell: "sh",
    cmd: "diagnose firewall iprope show 100 && show firewall policy",
  },
  {
    title: "VPN & Secure Remote Access",
    meta: "Site-to-Site VPN, SSL/IPsec, Remote Workforce Access",
    price: "$250 – $900 CAD",
    host: "fw01-edge",
    shell: "sh",
    cmd: "get vpn ipsec tunnel summary && diagnose vpn tunnel list",
  },
  {
    title: "Windows Server & Active Directory",
    meta: "AD DS, DNS, DHCP, Group Policy, NTFS Security",
    price: "$500 – $1,200 CAD",
    host: "dc01",
    shell: "ps",
    cmd: "Get-ADDomainController -Filter *; Get-DnsServerZone",
  },
  {
    title: "Network Security Audits & Hardening",
    meta: "Configuration Review, Risk Analysis, Remediation Planning",
    price: "$300 – $1,500 CAD",
    host: "audit01",
    shell: "sh",
    cmd: "nmap -sV --script vuln 10.10.0.0/24 && sudo lynis audit system",
  },
];

function getPrompt({ host, shell }) {
  return shell === "ps" ? `neteng@${host}: PS>` : `neteng@${host}:~$`;
}

/**
 * CMD-like output:
 *   > key
 *   | "value"
 */
function buildCmdOutputPairs({ title, meta, price }) {
  return [
    { key: "service --name", val: `"${title}"` },
    { key: "scope --items", val: `"${meta}"` },
    { key: "pricing --range", val: `"${price}"` },
  ];
}

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

        {/* GRID */}
        <section className="services-grid" aria-label="Services list">
          {services.map((s, idx) => {
            const id = `svc-${String(idx + 1).padStart(2, "0")}`;
            const headerLabel = `neteng@lab:~/services$ open ${id}`;
            const prompt = getPrompt(s);
            const pairs = buildCmdOutputPairs(s);

            return (
              <article key={id} className="service-terminal-card">
                {/* Terminal Header */}
                <div className="service-terminalbar" aria-hidden="true">
                  <div className="term-dots">
                    <span className="term-dot dot-red" />
                    <span className="term-dot dot-yellow" />
                    <span className="term-dot dot-green" />
                  </div>

                  <div className="term-label">{headerLabel}</div>

                  <div className="term-spacer" />

                  <div className="term-badge">{id}</div>
                </div>

                {/* Terminal Body (flex column so CTA can stick to bottom consistently) */}
                <div className="term-body">
                  <div className="term-main">
                    {/* Prompt line */}
                    <div className="term-line term-line--prompt">
                      <span className="term-prompt">{prompt}</span>
                    </div>

                    {/* Command line (wrapped continuation gutter clipped to this line only) */}
                    <div className="term-line term-line--command term-wrap-gutter">
                      <span className="cmd-prefix">&gt;</span>
                      <span className="term-cmd term-wrap-content">{s.cmd}</span>
                      <span className="term-cursor" aria-hidden="true" />
                    </div>

                    {/* Output */}
                    <div
                      className="term-output"
                      role="group"
                      aria-label={`${s.title} content`}
                    >
                      {pairs.map((p, i) => (
                        <div className="out-block" key={i}>
                          <div className="out-line out-line--key">
                            <span className="cmd-prefix">&gt;</span>
                            <span className="out-key">{p.key}</span>
                          </div>

                          <div className="out-line out-line--val">
                            <span className="pipe-prefix" aria-hidden="true">
                              |
                            </span>
                            <span className="out-val">{p.val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA pinned to bottom, consistent across cards */}
                  <div className="term-actions">
                    <button
                      type="button"
                      className="term-btn cursor-target"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRequestQuote?.(s.title);
                      }}
                      aria-label={`Request quote for ${s.title}`}
                    >
                      <span className="btn-row">
                        <span className="cmd-prefix">&gt;</span>
                        <span className="btn-cmd">request-quote --service</span>
                      </span>

                      <span className="btn-row btn-row--val">
                        <span className="pipe-prefix" aria-hidden="true">
                          |
                        </span>
                        <span className="btn-val">"{s.title}"</span>
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
