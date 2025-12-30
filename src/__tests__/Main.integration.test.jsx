import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Main from "../pages/Main";

test("renders all major sections", () => {
  render(
    <MemoryRouter>
      <Main setActive={vi.fn()} revealKey={1} />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: /about me/i })
  ).toBeInTheDocument();


    expect(
    screen.getByRole("heading", {
      name: /enterprise network architecture portfolio/i
    })
  ).toBeInTheDocument();


  expect(
    screen.getByRole("heading", { name: /certifications/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("heading", { name: /services/i })
  ).toBeInTheDocument();
});
