import { useState } from "react";
import "./ContactForm.css";

export default function ContactForm({
  title = "Start a Project",
  subtitle = "Briefly describe what you need.",
  showServiceSelect = true,
  variant = "footer", // "footer" | "page"
  onSubmit,
}) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      if (onSubmit) {
        await onSubmit(formState);
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }

      setStatus("success");
      setFormState({
        name: "",
        email: "",
        service: "",
        message: "",
      });
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

        <div className="form-actions">
          <button
            type="submit"
            className="contact-submit-btn cursor-target"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Send Message"}
          </button>

          {status === "success" && (
            <span className="form-status success">Message sent.</span>
          )}

          {status === "error" && (
            <span className="form-status error">Submission failed.</span>
          )}
        </div>
      </form>
    </section>
  );
}
