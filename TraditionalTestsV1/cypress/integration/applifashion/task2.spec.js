/// <reference types="cypress" />

const TESTHOST = `https://demo.applitools.com/gridHackathonV${
  Cypress.env("TEST_VERSION") || "1"
}.html`;

const ColorThief = require("color-thief");

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
    it(TaskTestName(2, "Shopping Cart Experience"), function () {
      cy.reload();
      cy.viewport(viewportWidth, viewportHeight);
      if ("Laptop" !== device) {
        cy.get(".toolbox").contains("Filters").click();
      }

      // presumably this would work for all colors?
      const desiredColor = "Black";
      const desiredRGB = colorNameToRGB(desiredColor);
      cy.get("#sidebar_filters")
        .contains(desiredColor)
        .find("input")
        .check()
        .get("#filterBtn")
        .click();
      cy.get("#product_grid")
        .then(captureDomIdForTest)
        .find(".grid_item img")
        .then(async function (elems) {
          for (const elem of elems) {
            const dominantColor = await getDominantColor(elem.src);
            const colorDistance = distanceBetweenPoints(
              dominantColor,
              desiredRGB
            );
            expect(colorDistance).to.be.at.most(90, "Grid Item color check");
          }
        });
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

function getDominantColor(href) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = reject;
    img.onload = function (event) {
      const image = event.target;
      try {
        const colorThief = new ColorThief();
        resolve(colorThief.getColor(image));
      } catch (err) {
        reject(err);
      }
    };
    img.src = href;
  });
}

function colorNameToRGB(str) {
  const RGB_REGEXP = new RegExp(
    "(?<red>[0-9a-f]{2})(?<green>[0-9a-f]{2})(?<blue>[0-9a-f]{2})"
  );
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = str;
  const rgb = ctx.fillStyle;
  ctx = null;
  canvas = null;
  const groups = RGB_REGEXP.exec(rgb).groups;

  return [
    Number.parseInt(groups.red, 16),
    Number.parseInt(groups.green, 16),
    Number.parseInt(groups.blue, 16),
  ];
}

function distanceBetweenPoints(p1, p2) {
  return Math.sqrt(
    p2
      .map((e, i) => Math.abs(e - p1[i]))
      .map((diff) => diff * diff)
      .reduce((p, c) => p + c, 0)
  );
}
