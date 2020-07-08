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
    if ("Laptop" !== device) {
      const linkPrettyNames = {
        access_link: "Account Btn",
        cart_bt: "Cart Btn",
      };
      let href;
      Object.keys(linkPrettyNames).forEach(function (clazz) {
        let testName = `Top Tools ${linkPrettyNames[clazz]} Reloads Window`;
        it(TaskTestName(1, testName), function () {
          cy.reload().viewport(viewportWidth, viewportHeight);
          cy.location().then(function (loc) {
            href = loc.href;
            return loc;
          });
          cy.get(".top_tools")
            .find(`.${clazz}`)
            .then(captureDomIdForTest)
            .click();
          cy.location().then(function (loc) {
            const expectation = `location after click of ${linkPrettyNames[clazz]}`;
            expect(loc.href).to.eq(href, expectation);
          });
        });
      });
    }

    it(TaskTestName(1, "Search 10K"), function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.get(LOCATORS.SEARCH_PLACEHOLDER)
        .then(captureDomIdForTest)
        .should(isLikeMobile(device) ? "not.be.visible" : "be.visible");
    });

    it(TaskTestName(1, "Mobile Search"), function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.contains("Search")
        .then(captureDomIdForTest)
        .should(isLikeMobile(device) ? "be.visible" : "not.be.visible");
    });

    it(TaskTestName(1, "Toolbox Sort"), function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.contains("Sort by popularity")
        .then(captureDomIdForTest)
        .should("be.visible");
    });

    it(TaskTestName(1, "Toolbox Filters"), function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.contains("Filters")
        .then(captureDomIdForTest)
        .should("Laptop" === device ? "not.be.visible" : "be.visible");
    });

    it(TaskTestName(1, "Toolbox Grid"), function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.get(LOCATORS.TOOLBOX_VIEW_GRID)
        .then(captureDomIdForTest)
        .should("Laptop" === device ? "be.visible" : "not.be.visible");
    });

    it(TaskTestName(1, "Toolbox List"), function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.get(LOCATORS.TOOLBOX_VIEW_LIST)
        .then(captureDomIdForTest)
        .should("Laptop" === device ? "be.visible" : "not.be.visible");
    });

    it(TaskTestName(1, "Top Menu Bar"), function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.contains("HOME")
        .then(captureDomIdForTest)
        .should("Laptop" === device ? "be.visible" : "not.be.visible");
    });

    it(TaskTestName(1, "Top Tools Wishlist"), function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.contains("Wishlist")
        .then(captureDomIdForTest)
        .should("Laptop" === device ? "be.visible" : "not.be.visible");
    });

    it("Task 1, Test Name: Sidebar", function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.get(LOCATORS.SIDEBAR_FILTERS)
        .then(captureDomIdForTest)
        .should("Laptop" === device ? "be.visible" : "not.be.visible");
    });

    ["Quick Links", "Contacts", "Keep in touch"].forEach((footer) => {
      it(TaskTestName(1, `Footer ${footer}`), function () {
        cy.viewport(viewportWidth, viewportHeight);

        cy.contains(footer)
          .then(captureDomIdForTest)
          .should("not.have.attr", "aria-expanded", "true");
      });
    });

    it(TaskTestName(1, "Your email"), function () {
      cy.viewport(viewportWidth, viewportHeight);

      cy.get(LOCATORS.YOUR_EMAIL)
        .then(captureDomIdForTest)
        .should(isLikeMobile(device) ? "not.be.visible" : "be.visible");
    });

    const gridItemOptions = [
      "Add to favorites",
      "Add to compare",
      "Add to cart",
    ];

    // order matters for these next two forEach instances

    gridItemOptions.forEach(function (option) {
      it(TaskTestName(1, `Grid Item Non-Hover Options ${option}`), () => {
        cy.viewport(viewportWidth, viewportHeight);
        cy.contains(option)
          .then(captureDomIdForTest)
          .should("Laptop" === device ? "not.be.visible" : "be.visible");
      });
    });

    gridItemOptions.forEach(function (option) {
      if ("Laptop" === device) {
        it(TaskTestName(1, `Grid Item Hover Options ${option}`), function () {
          cy.viewport(viewportWidth, viewportHeight);

          cy.get(LOCATORS.GRID_ITEM)
            .first()
            .then(captureDomIdForTest)
            .scrollIntoView()
            .then(simulateCssHover)
            .contains(option)
            .should("be.visible");
        });
      }
    });
  });
};

context("Resolutions", () => {
  before(() => {
    cy.visit(TESTHOST);
  });

  for (const device in browserCombos) {
    const { viewportWidth, viewportHeight } = browserCombos[device];
    const browser = `${Cypress.browser.displayName} ${Cypress.browser.majorVersion}`;
    const label = `Browser: ${browser}, Viewport: ${viewportWidth}x${viewportHeight}, Device: ${device}`;
    tests({ label, device });
  }
});

const LOCATORS = {
  SEARCH_PLACEHOLDER: '[placeholder="Search over 10,000 shoes!"]',
  CART_COUNT_BADGE: ".dropdown-cart > a > strong",
  TOOLBOX_VIEW_GRID: ".ti-view-grid",
  TOOLBOX_VIEW_LIST: ".ti-view-list",
  SIDEBAR_FILTERS: "#sidebar_filters",
  YOUR_EMAIL: '[placeholder="Your email"]',
  GRID_ITEM: ".grid_item",
  GRID_ITEM_TOOLTIP: '.grid_item [data-toggle="tooltip"]',
};

function isLikeMobile(device) {
  const combo = browserCombos[device];
  if (combo) {
    return (
      combo.viewportWidth <= 500 && combo.viewportWidth < combo.viewportHeight
    );
  }
  console.error(`no combo defined for ${device}`);
  return false;
}

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

function simulateCssHover($elem) {
  // no cy.hover()  :-(
  const simulateHoverCss = ".grid_item.at_hover ul li { display: block; }";
  const doc = $elem[0].ownerDocument;
  if (![...doc.head.children].some((e) => simulateHoverCss === e.innerText)) {
    var style = doc.createElement("style");
    style.type = "text/css";
    style.innerHTML = ".grid_item.at_hover ul li { display: block; }";
    doc.getElementsByTagName("head")[0].appendChild(style);
  }
  $elem[0].classList.add("at_hover");
  return $elem;
}
