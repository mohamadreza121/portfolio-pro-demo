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
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);


/* ===============================
   scrollTo (jsdom)
================================ */
window.scrollTo = vi.fn();

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


/* ===============================
   scrollTo (JSDOM polyfill)
================================ */

// window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

// Element.scrollTo (ScrollDeck uses el.scrollTo)
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function scrollTo(optionsOrX, y) {
    // scrollTo({ top }) form
    if (typeof optionsOrX === "object" && optionsOrX) {
      const top = Number(optionsOrX.top ?? 0);
      this.scrollTop = top;
      return;
    }

    // scrollTo(x, y) form
    this.scrollTop = Number(y ?? 0);
  };
}
