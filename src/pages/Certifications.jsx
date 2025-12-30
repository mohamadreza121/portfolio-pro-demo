import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useMemo } from "react";

import DecryptedText from "../components/DecryptedText";
import LightboxPortal from "../components/LightboxPortal";
import Carousel from "../components/Carousel";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./Certifications.css";

/* Thumbnails */
import cert1 from "../assets/cert1.png"
import cert2 from "../assets/cert2.png";
import cert3 from "../assets/cert3.png";
import cert4 from "../assets/cert4.png";
import cert5 from "../assets/cert5.png";
import cert6 from "../assets/cert6.png";
import cert7 from "../assets/cert7.png";
import cert8 from "../assets/cert8.png";
import cert9 from "../assets/cert9.png";
import cert10 from "../assets/cert10.png";

/* Certificates */
const certs = [
  { title: "Cisco Certified Specialist – Enterprise Core", thumb: cert1, pdf: "/assets/cert1.pdf" },
  { title: "CCNA – Routing & Switching", thumb: cert2, pdf: "/assets/cert2.pdf" },
  { title: "Computer Hardware Basics", thumb: cert3, pdf: "/assets/cert3.pdf" },
  { title: "Endpoint Security", thumb: cert4, pdf: "/assets/cert4.pdf" },
  { title: "Introduction to Cybersecurity", thumb: cert5, pdf: "/assets/cert5.pdf" },
  { title: "Introduction to Java", thumb: cert6, pdf: "/assets/cert6.pdf" },
  { title: "Network Support & Security", thumb: cert7, pdf: "/assets/cert7.pdf" },
  { title: "Networking Basics", thumb: cert8, pdf: "/assets/cert8.pdf" },
  { title: "Networking Devices and Initial Configuration", thumb: cert9, pdf: "/assets/cert9.pdf" },
  { title: "Python Essentials 1", thumb: cert10, pdf: "/assets/cert10.pdf" },
];

export default function Certifications() {
  const [lightboxPdf, setLightboxPdf] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    document.body.style.overflow = lightboxPdf ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [lightboxPdf]);

  /* Convert certs to carousel items */
  const carouselItems = useMemo(
    () =>
      certs.map((cert, i) => ({
        id: `cert-${i}`,
        title: cert.title,
        caption: "Click to view certificate",
        mediaSrc: cert.thumb,
        badge: "Certificate",
        href: undefined,
        onClick: () => setLightboxPdf(cert.pdf),
      })),
    [setLightboxPdf]
  );



  return (
    <div id="certifications" className="certifications-page">
      <span className="spy-marker" />

      <div className="certifications-container">
        {/* ===============================
            CENTERED HERO (MATCH PROJECTS)
        =============================== */}
        <section className="certifications-hero-center">
            <h1 className="certifications-title">
              <DecryptedText
                text="Professional Certifications"
                animateOn="view"
                sequential
                speed={80}
                revealDirection="center"
                encryptedClassName="encrypted"
                className="revealed"
              />
            </h1>

            <p className="certifications-subtitle">
              Industry-recognized credentials validating enterprise networking,
              security, and systems expertise.
            </p>

            <a
              href="https://www.credly.com/users/mohammadreza-heidarpoor"
              target="_blank"
              rel="noreferrer"
              className="btn-pill primary credly-btn cursor-target"
            >
              <FontAwesomeIcon icon={faLink} />
              <span>Verify on Credly</span>
            </a>
        </section>

        {/* ===============================
            CERTIFICATIONS CAROUSEL
        =============================== */}
          <section className="certifications-carousel">
            <Carousel
              items={carouselItems.map((item) => ({
                ...item,
                href: item.href,
                onClick: item.onClick
              }))}
              ariaLabel="Certifications carousel"
              className="cert-carousel-large"
            />
          </section>
      </div>

      {/* ===============================
          LIGHTBOX (UNCHANGED)
      =============================== */}
      {lightboxPdf && (
        <LightboxPortal>
          <div className="lightbox" onClick={() => setLightboxPdf(null)}>
            <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={lightboxPdf}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </div>
          </div>
        </LightboxPortal>
      )}
    </div>
  );
}
