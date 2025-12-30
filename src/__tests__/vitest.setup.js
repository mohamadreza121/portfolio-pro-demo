import "@testing-library/jest-dom";
import { vi } from "vitest";

/* ===============================
   IntersectionObserver
================================ */
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = MockIntersectionObserver;

/* ===============================
   scrollIntoView
================================ */
Element.prototype.scrollIntoView = vi.fn();

/* ===============================
   requestAnimationFrame
================================ */
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);

/* ===============================
   matchMedia (GSAP + Dock)
================================ */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
