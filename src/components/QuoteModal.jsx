/**
 * QuoteModal.jsx
 * --------------------------------------------------
 * Lightweight, backend-agnostic quote / lead modal.
 *
 * TEMPLATE NOTES:
 * - No backend is wired by default.
 * - Replace handleSubmit() with:
 *   • EmailJS
 *   • Formspree
 *   • Netlify Forms
 *   • Custom API endpoint
 *
 * Designed to be triggered from existing CTAs
 * (e.g. "Request Quote") without route changes.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./QuoteModal.css";

const SERVICE_MAP = {
  "Enterprise Network Design & Implementation": "network",
  "Cisco Router & Switch Configuration": "network",
  "Firewall Deployment & Security Hardening": "security",
  "VPN & Secure Remote Access": "security",
  "Network Security Audits & Hardening": "security",
  "Windows Server & Active Directory": "network",
  "Web / App": "website",
};

export default function QuoteModal({
  open = false,
  service = "",
  onClose,
  onSubmit,
}) {
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  /* =====================================================
     FOCUS + ESC HANDLING
  ===================================================== */
  useEffect(() => {
    if (!open) return;

    firstInputRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);


  /* =====================================================
     SERVICE AUTO-SELECT (PREMIUM TOUCH)
  ===================================================== */

  if (!open) return null;

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
        // Demo-safe simulated submit
        await new Promise((r) => setTimeout(r, 900));
      }

      setStatus("success");
      setFormState({
        name: "",
        email: "",
        projectType: "",
        budget: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };


  return createPortal(
    <div
      ref={overlayRef}
      className="quote-modal-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className="quote-modal">
        <header className="quote-modal-header">
          <h3>Request a Quote</h3>
          <button
            className="quote-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="quote-form-grid">
            <div className="quote-field">
              <label htmlFor="q-name">Name</label>
              <input
                ref={firstInputRef}
                id="q-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="quote-field">
              <label htmlFor="q-email">Email</label>
              <input
                id="q-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="quote-field">
              <label htmlFor="q-projectType">Project Type</label>
              <select
                id="q-projectType"
                name="projectType"
                className="cursor-target"
                value={formState.projectType || SERVICE_MAP[service] || ""}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="website">Website / App</option>
                <option value="network">Network Design</option>
                <option value="security">Security / Hardening</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>

            <div className="quote-field">
              <label htmlFor="q-budget">Budget</label>
              <select
                id="q-budget"
                name="budget"
                className="cursor-target"
                value={formState.budget}
                onChange={handleChange}
              >
                <option value="">Select range</option>
                <option value="under-1k">Under $1k</option>
                <option value="1k-3k">$1k – $3k</option>
                <option value="3k-5k">$3k – $5k</option>
                <option value="5k+">$5k+</option>
              </select>
            </div>

            <div className="quote-field quote-field-full">
              <label htmlFor="q-message">Project Details</label>
              <textarea
                id="q-message"
                name="message"
                rows={4}
                placeholder="Briefly describe your project..."
                value={formState.message}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="quote-actions">
            <button
              type="submit"
              className="quote-submit-btn cursor-target"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Submitting..." : "Request Quote"}
            </button>

            {status === "success" && (
              <span className="quote-status success">
                Request sent successfully.
              </span>
            )}

            {status === "error" && (
              <span className="quote-status error">
                Something went wrong. Please try again.
              </span>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
