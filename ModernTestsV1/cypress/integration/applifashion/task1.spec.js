/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

const TESTHOST = `https://demo.applitools.com/gridHackathonV${
  Cypress.env("TEST_VERSION") || "1"
}.html`;

const browserCombos = [
  { width: 1200, height: 700, name: "chrome" },
  { width: 768, height: 700, name: "chrome" },
  { width: 1200, height: 700, name: "firefox" },
  { width: 768, height: 700, name: "firefox" },
  { width: 1200, height: 700, name: "edgechromium" },
  { width: 768, height: 700, name: "edgechromium" },
  { deviceName: "iPhone X", screenOrientation: "portrait" },
];

context("Resolutions", () => {
  beforeEach(() => {
    cy.visit(TESTHOST);
  });
  for (const eyesBrowser of browserCombos) {
    let viewportWidth = eyesBrowser["width"];
    let viewportHeight = eyesBrowser["height"];
    if (eyesBrowser["deviceName"]) {
      viewportWidth = 500;
      viewportHeight = 700;
    }
    it("Task 1", function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.eyesOpen({
        appName: "Task 1",
        testName: "Task 1",
        browser: eyesBrowser,
      });

      cy.eyesCheckWindow({
        tag: "Cross-Device Elements Test",
        target: "window",
        fully: true,
      });

      cy.eyesClose();
    });
  }
});
