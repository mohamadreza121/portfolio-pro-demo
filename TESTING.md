# Testing Guide

This project uses **Vitest** with **@testing-library/react** in a **jsdom** environment.  
The test suite is intentionally focused on **behavior and stability**, not visual styling or animation fidelity.

---

## Quick Start

```bash
npm install
npm test
```

Runs all unit and integration tests in watch mode.

---

## Test Philosophy

This template follows these principles:

- **Test behavior, not implementation details**
- **Avoid brittle selectors** (no class-based queries)
- **Prefer accessibility-first queries**
- **Do not test animations or CSS**
- **Test one representative project page, not all clones**

The goal is to ensure the site renders correctly, routes correctly, and responds to user intent without over-testing.

---

## Test Stack

- **Test Runner:** Vitest
- **DOM Environment:** jsdom
- **Rendering & Queries:** @testing-library/react
- **Matchers:** @testing-library/jest-dom
- **Router Testing:** react-router-dom (MemoryRouter)

---

## Global Test Setup

Global browser API shims live in:

```
src/__tests__/vitest.setup.js
```

This file provides minimal, safe polyfills for browser APIs that are missing or incomplete in jsdom:

- `window.matchMedia`
- `IntersectionObserver`
- `requestAnimationFrame`
- `Element.prototype.scrollIntoView`

If you introduce additional browser-only APIs (e.g. `ResizeObserver`, `PointerEvent`, `DOMRect`), add their mocks here.

---

## Test Coverage Overview

### Component Tests

| File | What It Verifies |
|---|---|
| `CarouselProject.test.jsx` | Carousel renders items and fires `onOpen` when clicked |
| `Footer.test.jsx` | Footer mounts without runtime errors |
| `LightboxPortal.test.jsx` | Portal content renders into `document.body` |
| `Navbar.integration.test.jsx` | Navigation dock renders interactive buttons |

---

### Integration Tests

| File | What It Verifies |
|---|---|
| `Main.integration.test.jsx` | Main page renders all major content sections |
| `Router.integration.test.jsx` | Routing resolves `/` and `/projects/1` correctly |
| `useScrollSpyRouter.test.jsx` | Scroll spy hook mounts safely and handles hashes |
| `scrollToSection.test.js` | Navigation helper builds correct router state |

---

## Writing Tests

### Recommended Queries

Prefer semantic, accessible queries:

```js
screen.getByRole("button", { name: /next/i });
screen.getByRole("heading", { name: /about me/i });
screen.getByRole("img", { name: /topology/i });
```

Avoid:

- `getByClassName`
- `querySelector`
- Snapshot testing for animated layouts

---

### Infinite / Duplicated DOM (Carousels)

For components that intentionally duplicate elements (e.g., infinite carousels):

```js
expect(screen.getAllByAltText("Test Image").length)
  .toBeGreaterThan(0);
```

Do **not** assert exact counts unless duplication is part of the contract.

---

## Portals

`LightboxPortal` renders into a DOM node outside the React tree.

Your test must create the portal root:

```js
const root = document.createElement("div");
root.id = "portal-root";
document.body.appendChild(root);
```

The test should assert that portal content appears in `document.body`.

---

## Animation & Scroll Libraries (GSAP)

This template intentionally avoids testing animation timelines.

Best practices followed:

- GSAP plugins register inside effects, not at module scope
- Components guard against missing browser APIs
- Animations are treated as progressive enhancement

If a component animates but renders content correctly, **the test should pass**.

---

## Common Errors & Fixes

### `window.matchMedia is not a function`

- Ensure `environment: "jsdom"` in `vitest.config.js`
- Ensure `vitest.setup.js` is referenced via `setupFiles`
- Avoid registering animation plugins at module scope

---

### `IntersectionObserver is not defined`

- Confirm mock exists in `vitest.setup.js`
- Add guards in components if observer is optional

---

### `scrollIntoView is not a function`

- jsdom does not implement scrolling
- Either guard in code or mock in setup file

---

## What Is NOT Tested (By Design)

The following are intentionally excluded:

- CSS layout correctness
- GSAP animation timing
- Swipe physics / momentum scrolling
- Visual regressions

These are better covered by:

- Manual QA
- Visual review
- Playwright / Cypress (optional)

---

## Summary

This test suite ensures:

- The site renders without runtime errors
- Routing works correctly
- Major content sections exist
- User interactions trigger expected behavior
- Browser-only APIs do not break tests

It is optimized for **portfolio templates**, **demo sites**, and **production-ready personal projects**.

---

Happy testing.
