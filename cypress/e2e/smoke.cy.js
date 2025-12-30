describe("Smoke", () => {
  it("loads the home page", () => {
    cy.visit("/");
    // Basic sanity check: the document should have a title.
    cy.title().should("not.be.empty");
  });
});
