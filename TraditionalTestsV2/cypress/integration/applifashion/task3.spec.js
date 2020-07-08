/// <reference types="cypress" />

const TESTHOST = `https://demo.applitools.com/gridHackathonV${
  Cypress.env("TEST_VERSION") || "1"
}.html`;

const browserCombos = {
  Laptop: {
    viewportWidth: 1200,
    viewportHeight: 700,
  },
  Tablet: {
    viewportWidth: 768,
    viewportHeight: 700,
  },
  Mobile: {
    viewportWidth: 500,
    viewportHeight: 700,
  },
};

const tests = (args) => {
  const { label, device } = args;
  const { viewportWidth, viewportHeight } = browserCombos[device];
  describe(label, () => {
    it(TaskTestName(3, "Product Details SKU"), function () {
      cy.viewport(viewportWidth, viewportHeight);
      cy.get(".grid_item").first().click();
      cy.get(".prod_info")
        .find("small")
        .then(captureDomIdForTest)
        .should(($small) => {
          expect(window.getComputedStyle($small[0]).color).to.equal(
            "rgb(68, 68, 68)"
          );
        });
    });

    it(TaskTestName(3, "Product Details Size Picker"), function () {
      const valid_sizes = ["Small (S)", "M", "L", "XL"];
      cy.viewport(viewportWidth, viewportHeight);
      cy.get(".grid_item").first().click();
      cy.get(".custom-select-form")
        .then(captureDomIdForTest)
        .find("li")
        .each(($li) => {
          expect(valid_sizes).to.include($li.text());
        });
    });

    it(TaskTestName(3, "Product Details Old Price Formatting"), function () {
      cy.viewport(viewportWidth, viewportHeight);
      cy.get(".grid_item").first().click();
      cy.get(".price_main")
        .find(".old_price")
        .then(captureDomIdForTest)
        .should(($span) => {
          expect($span.text()).to.match(/\$\d+\.\d{2}/);
          expect(window.getComputedStyle($span[0]).textDecoration).to.match(
            /line\-through/
          );
        });
    });

    it(TaskTestName(3, "Product Details New Price Formatting"), function () {
      cy.viewport(viewportWidth, viewportHeight);
      cy.get(".grid_item").first().click();
      cy.get(".price_main")
        .find(".new_price")
        .then(captureDomIdForTest)
        .should(($span) => {
          expect($span.text()).to.match(/\$\d+\.\d{2}/);
        });
    });

    it(
      TaskTestName(3, "Product Details Cart Options Check Overlaps"),
      function () {
        cy.viewport(viewportWidth, viewportHeight);
        cy.get(".grid_item").first().click();
        cy.get(".prod_options")
          .then(captureDomIdForTest)
          .find('a[class*="btn"],div[class*="button"]')
          .should(($elems) => {
            for (const e1 of $elems) {
              for (const e2 of $elems) {
                if (e1 === e2) continue;
                const k = e1.getAttribute("id") + e2.getAttribute("id");
                if (e2.parentElement == e1.parentElement) {
                  continue;
                }
                expect(
                  isOverlap(e1, e2),
                  `Overlap of ${e1.getAttribute("id")} and ${e2.getAttribute(
                    "id"
                  )}`
                ).equal(false);
              }
            }
          });
      }
    );

    it(
      TaskTestName(3, "Product Details Top Tools Check Overlaps"),
      function () {
        cy.viewport(viewportWidth, viewportHeight);
        cy.get(".grid_item").first().click();
        cy.get(".top_tools")
          .then(captureDomIdForTest)
          .find("a.cart_bt,a.wishlist,a.access_link")
          .should(($elems) => {
            for (const e1 of $elems) {
              for (const e2 of $elems) {
                if (e1 === e2) continue;
                const k = e1.getAttribute("id") + e2.getAttribute("id");
                if (e2.parentElement == e1.parentElement) {
                  continue;
                }
                expect(
                  isOverlap(e1, e2),
                  `Overlap of ${e1.getAttribute("id")} and ${e2.getAttribute(
                    "id"
                  )}`
                ).equal(false);
              }
            }
          });
      }
    );

    it(TaskTestName(3, "Product Details Ratings Check Overlaps"), function () {
      cy.viewport(viewportWidth, viewportHeight);
      cy.get(".grid_item").first().click();
      cy.get(".rating")
        .then(captureDomIdForTest)
        .find("i,em")
        .should(($elems) => {
          for (const e1 of $elems) {
            for (const e2 of $elems) {
              if (e1 === e2) continue;
              expect(
                isOverlap(e1, e2),
                `Overlap of ${e1.getAttribute("id")} and ${e2.getAttribute(
                  "id"
                )}`
              ).equal(false);
            }
          }
        });
    });
  });
};

context("Resolutions", () => {
  beforeEach(() => {
    cy.visit(TESTHOST);
  });
  for (const device in browserCombos) {
    const { viewportWidth, viewportHeight } = browserCombos[device];
    const browser = `${Cypress.browser.displayName} ${Cypress.browser.majorVersion}`;
    const label = `Browser: ${browser}, Viewport: ${viewportWidth}x${viewportHeight}, Device: ${device}`;
    tests({ label, device });
  }
});

function TaskTestName(taskNum, testName) {
  return `Task ${taskNum}, Test Name: ${testName}`;
}

/*
 * this is a little hacky, but it I need someway to note the domId
 * for a given test, for the 'npx cypress run' custom reporter I
 * have made.  For now I just append the domId to the test name,
 * since the title mutation makes it all the way to the reporter.
 */
function captureDomIdForTest($elem) {
  this.test.title = this.test.title + ":::" + $elem.attr("id");
  return $elem;
}

/*
 * modified to ignore overlaps just on the edges
 * https://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
 */
function isOverlap(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  return !(
    rect1.right <= rect2.left ||
    rect1.left >= rect2.right ||
    rect1.bottom <= rect2.top ||
    rect1.top >= rect2.bottom
  );
}
