import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CarouselProject from "../components/CarouselProject";

const items = [
  {
    id: "1",
    type: "image",
    title: "Test Image",
    caption: "Test caption",
    mediaSrc: "/test.png",
  },
];

describe("CarouselProject", () => {
  it("renders carousel items", () => {
    render(<CarouselProject items={items} />);

    const images = screen.getAllByAltText("Test Image");
    expect(images.length).toBeGreaterThan(0);
  });

  it("calls onOpen when item clicked", () => {
    const onOpen = vi.fn();

    render(<CarouselProject items={items} onOpen={onOpen} />);

    // The carousel duplicates items for infinite scrolling, so multiple buttons
    // share similar text. Click the first card button whose accessible name
    // includes the item title.
    fireEvent.click(screen.getAllByRole("button", { name: /test image/i })[0]);

    expect(onOpen).toHaveBeenCalledWith(items[0]);
  });
});
