export function navigateAndScroll(navigate, sectionId) {
  navigate("/", {
    replace: true,
    state: { scrollTo: sectionId },
  });
}
