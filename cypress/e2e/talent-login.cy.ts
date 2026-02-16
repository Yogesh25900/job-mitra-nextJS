describe("Talent Login Page E2E", () => {
  beforeEach(() => {
    cy.visit("/talent/login");
  });

  it("renders login form fields and submit button", () => {
    cy.get('input[placeholder="Email"]').should("be.visible");
    cy.get('input[placeholder="Password"]').should("be.visible").and("have.attr", "type", "password");
    cy.contains("button", "Login").should("be.visible");
  });

  it("shows talent-specific navigation links", () => {
    cy.contains("a", "Forgot password?").should("have.attr", "href", "/talent/forgot-password");
    cy.contains("a", "Login as Recruiter").should("have.attr", "href", "/recruiter/login");
    cy.contains("a", "Sign up").should("have.attr", "href", "/register");
  });

  it("toggles password visibility", () => {
    cy.get('input[placeholder="Password"]').as("password");
    cy.get("@password").should("have.attr", "type", "password");

    cy.get('button[type="button"]').first().click();
    cy.get("@password").should("have.attr", "type", "text");

    cy.get('button[type="button"]').first().click();
    cy.get("@password").should("have.attr", "type", "password");
  });

  it("shows validation message when password is missing", () => {
    cy.get('input[placeholder="Email"]').type("talent@example.com");
    cy.contains("button", "Login").click();

    cy.contains("Password is required").should("be.visible");
  });

  it("navigates to recruiter login when switch link is clicked", () => {
    cy.contains("a", "Login as Recruiter").click();
    cy.url().should("include", "/recruiter/login");
  });
});
