import React from "react";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "../test/test-utils";
import Navbar from "../components/Navbar.jsx";

describe("Navbar integration", () => {
  it("renders navigation dock buttons", () => {
    renderWithRouter(<Navbar />);

    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toBeGreaterThan(0);
  });
});
