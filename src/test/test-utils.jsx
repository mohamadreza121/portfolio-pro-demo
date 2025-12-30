import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";

export function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}
