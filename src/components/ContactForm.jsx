import { useRef, useState } from "react";
import "./ContactForm.css";

const EMPTY_FORM = {
  name: "",
  email: "",
  service: "",
  message: "",
};

export default function ContactForm({
  title = "Start a Project",
  subtitle = "Briefly describe what you need.",
  showServiceSelect = true,
  variant = "footer", // "footer" | "page"
  onSubmit,
}) {
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");

  const [honeypot, setHoneypot] = useState("");
  const mountedAtRef = useRef(Date.now());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const elapsed = Date.now() - mountedAtRef.current;
    const isBot = honeypot.trim().length > 0 || elapsed < 1200;

    if (isBot) {
      setStatus("success");
      setFormState(EMPTY_FORM);
      setHoneypot("");
      mountedAtRef.current = Date.now();
      return;
    }

    setStatus("submitting");
    try {
      if (!onSubmit) throw new Error("ContactForm missing onSubmit");
      const res = await onSubmit(formState);
      if (res && res.ok === false) throw new Error("Message provider returned ok=false");

      setStatus("success");
      setFormState(EMPTY_FORM);
      setHoneypot("");
      mountedAtRef.current = Date.now();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className={`contact-form contact-form--${variant}`}>
      <header className="contact-form-header">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </header>

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot */}
        <div
          style={{
            position: "absolute",
            left: "-10000px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          <label htmlFor="cf-website">Website</label>
          <input
            id="cf-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Recessed tray */}
        <div className="contact-tray">
          <div className="form-grid">
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={formState.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formState.email}
              onChange={handleChange}
              required
            />

            {showServiceSelect && (
              <select
                name="service"
                className="cursor-target"
                value={formState.service}
                onChange={handleChange}
              >
                <option value="">Service (optional)</option>
                <option value="network">Network Architecture</option>
                <option value="security">Security Hardening</option>
                <option value="consulting">Consulting</option>
                <option value="web">Web / App</option>
              </select>
            )}

            <textarea
              name="message"
              placeholder="Short project summary"
              rows={variant === "footer" ? 3 : 5}
              value={formState.message}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="contact-submit-btn cursor-target"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Send Message"}
          </button>

          {status === "success" && <span className="form-status success">Message sent.</span>}
          {status === "error" && <span className="form-status error">Submission failed.</span>}
        </div>
      </form>
    </section>
  );
}
