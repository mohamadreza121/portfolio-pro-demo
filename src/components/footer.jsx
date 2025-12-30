import React from "react";
import { useNavigate } from "react-router-dom";
import { navigateAndScroll } from "../utils/scrollToSection";

import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaLinkedin,
  FaPhone,
} from "react-icons/fa";

import ContactForm from "./ContactForm";

import "./footer.css";
import "./TargetCursor.css";

export default function Footer({ onRequestQuote }) {
  const navigate = useNavigate();

  return (
    <>
      <footer id="footer" className="footer">
        <div className="footer-container">
          {/* CONTACT / LEAD SECTION */}
          <div className="footer-section">
            <h3 className="footer-title">Get in Touch</h3>

            <p>
              <FaMapMarkerAlt
                size={14}
                style={{ color: "var(--accent)", marginRight: "8px" }}
              />
              <span>Toronto, Canada</span>
            </p>

            <p>
              <FaPhone
                size={14}
                style={{ color: "var(--accent)", marginRight: "8px" }}
              />
              <span>+1(647)802-3224</span>
            </p>

            <p>
              <FaEnvelope
                size={14}
                style={{ color: "var(--accent)", marginRight: "8px" }}
              />
              <a
                href="mailto:your.email@example.com"
                className="footer-link cursor-target"
              >
                mrheidarpoor7@gmail.com
              </a>
            </p>

            <p>
              <FaLinkedin
                size={14}
                style={{ color: "var(--accent)", marginRight: "8px" }}
              />
              <a
                href="https://www.linkedin.com/in/mohammadreza-heidarpoor/"
                target="_blank"
                rel="noreferrer"
                className="footer-link cursor-target"
              >
                LinkedIn
              </a>
            </p>

            <button
              type="button"
              className="footer-link cursor-target footer-cta-btn"
              onClick={() => onRequestQuote?.()}
            >
              Request a Quote
            </button>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>

            <nav aria-label="Footer navigation">
              <ul className="footer-links">
                <li>
                  <button
                    type="button"
                    className="footer-link cursor-target"
                    onClick={() => navigateAndScroll(navigate, "home")}
                  >
                    Home
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="footer-link cursor-target"
                    onClick={() => navigateAndScroll(navigate, "about")}
                  >
                    About
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="footer-link cursor-target"
                    onClick={() => navigateAndScroll(navigate, "projects")}
                  >
                    Projects
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="footer-link cursor-target"
                    onClick={() => navigateAndScroll(navigate, "certifications")}
                  >
                    Certifications
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="footer-link cursor-target"
                    onClick={() => navigateAndScroll(navigate, "services")}
                  >
                    Services
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* INLINE CONTACT FORM (OPTIONAL BUT PREMIUM) */}
          <div className="footer-section footer-form-section">
            <ContactForm
              title="Start a Project"
              subtitle="Tell me about your idea and I’ll get back to you."
              showServiceSelect
            />
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Mohammadreza Heidarpoor — Portfolio Template
          </p>
        </div>
      </footer>
    </>
  );
}
