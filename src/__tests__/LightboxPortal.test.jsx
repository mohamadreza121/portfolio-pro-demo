import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LightboxPortal from "../components/LightboxPortal";

describe("LightboxPortal", () => {
  it("renders children into document body", () => {
    const portalRoot = document.createElement("div");
    portalRoot.id = "portal-root";
    document.body.appendChild(portalRoot);

    render(
      <LightboxPortal isOpen={true} onClose={vi.fn()}>
        <div data-testid="portal-content">Portal Content</div>
      </LightboxPortal>
    );

    expect(document.body.textContent).toContain("Portal Content");

    // cleanup
    portalRoot.remove();
  });
});
