import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useScrollSpyRouter } from "../hooks/useScrollSpyRouter";

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };

  globalThis.Element.prototype.scrollIntoView = vi.fn();
});

describe("useScrollSpyRouter", () => {
  it("does not throw on mount", () => {
    const setActive = vi.fn();

    expect(() =>
      renderHook(() => useScrollSpyRouter(setActive), {
        wrapper: ({ children }) => (
          <MemoryRouter>{children}</MemoryRouter>
        ),
      })
    ).not.toThrow();
  });

  it("handles hash-based navigation safely", () => {
    window.history.pushState({}, "", "/#home");

    const setActive = vi.fn();

    renderHook(() => useScrollSpyRouter(setActive), {
      wrapper: ({ children }) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });

  expect(setActive).toHaveBeenCalledTimes(0);
  });
});
