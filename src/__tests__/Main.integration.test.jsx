import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Main from "../pages/Main";

test("renders all major sections", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Main setActive={vi.fn()} revealKey={1} isQuoteOpen={false} />
    </MemoryRouter>
  );

  // Use findByRole to allow async layout/state updates
  expect(await screen.findByRole("heading", { name: /about me/i })).toBeInTheDocument();

  expect(
    await screen.findByRole("heading", { name: /enterprise network architecture/i })
  ).toBeInTheDocument();

  expect(
    await screen.findByRole("heading", { name: /professional certifications/i })
  ).toBeInTheDocument();

  expect(await screen.findByRole("heading", { name: /services/i })).toBeInTheDocument();
});
