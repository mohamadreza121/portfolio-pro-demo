import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../components/footer.jsx";

describe("Footer Component", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeTruthy();
  });
});
