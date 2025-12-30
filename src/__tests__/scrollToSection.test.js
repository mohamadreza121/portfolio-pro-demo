import { navigateAndScroll } from "../utils/scrollToSection";

it("navigates to root with scroll target", () => {
  const navigate = vi.fn();

  navigateAndScroll(navigate, "projects");

  expect(navigate).toHaveBeenCalledWith("/", {
    replace: true,
    state: { scrollTo: "projects" },
  });
});
