# APPLITOOLS CROSS BROWSER TESTING HACKATHON SUBMISSION

## 🏆 I am very proud to report that [I placed gold](https://applitools.com/2020-cross-browser-testing-hackathon-winners/#:~:text=Rick%20Power) in this visual testing competition!

This competition served as a demonstration of how difficult it is to do visual testing using
traditional browser automation techniques.  In particular, detection of css-related errors
(unexpected hidden elements etc), and comparison of page layouts and embedded media are almost
impossible to detect reliably without assistance from a automated visual testing system like
[Applitools](https://applitools.com/).

# OPENING REMARKS

I have to admit, it was a shocking experiencing deleting all of the hard-won assertions from the
traditional method tests I wrote.  I am glad I did the traditional method first, because it
really allowed me to appreciate the power of visual testing.  Once I switched to visual testing,
the pages of assertion-code just melted away, and all I was left with maintaining was the imperative
"click-and-type" user-driven interactions!

I'm miffed that I missed the "undisplayed shoe in Firefox", I tried really hard to catch all the bugs.
However, it was really nice to see visual testing find that bug so easily, when it is so hard to test
that using traditional means. (Applitools FTW)

# TEST OUTPUT

Here are the formatted test output files:

* [Traditional-V1-TestResults.txt](./Traditional-V1-TestResults.txt)
* [Traditional-V2-TestResults.txt](./Traditional-V2-TestResults.txt)

The spec files for the tasks can be found here:

### TraditionalTestsV1

* [TraditionalTestsV1/cypress/integration/applifashion/task1.spec.js](TraditionalTestsV1/cypress/integration/applifashion/task1.spec.js)
* [TraditionalTestsV1/cypress/integration/applifashion/task2.spec.js](TraditionalTestsV1/cypress/integration/applifashion/task2.spec.js)
* [TraditionalTestsV1/cypress/integration/applifashion/task3.spec.js](TraditionalTestsV1/cypress/integration/applifashion/task3.spec.js)

### TraditionalTestsV2 (identical to V1 in my case)

* [TraditionalTestsV2/cypress/integration/applifashion/task1.spec.js](TraditionalTestsV2/cypress/integration/applifashion/task1.spec.js)
* [TraditionalTestsV2/cypress/integration/applifashion/task2.spec.js](TraditionalTestsV2/cypress/integration/applifashion/task2.spec.js)
* [TraditionalTestsV2/cypress/integration/applifashion/task3.spec.js](TraditionalTestsV2/cypress/integration/applifashion/task3.spec.js)

The reporter used to generate the required output format is [TraditionalTestsV1/cypress/reporters/applifashion.js](TraditionalTestsV1/cypress/reporters/applifashion.js)

## TRADITIONAL TESTING SETUP

```shell
$ cd TraditionalTestsV1
# install cypress, see "https://docs.cypress.io/guides/getting-started/installing-cypress.html#Installing"

# then run
$ npm install
# and then
$ npx cypress open # etc etc...
```

## GENERATE THE TRADITIONAL TEST RESULTS

```shell
# This takes about 12 minutes to run on a 2015 MacBook Pro.
$ ./trad.sh # (794.68s user 76.81s system 121% cpu 11:54.57 total) 
```

## RUN SPECFIC TASKS

```shell
# run automation task1 on firefox against V2 of web app
$ npx cypress run --browser firefox --spec cypress/integration/applifashion/task1.spec.js --env TEST_VERSION=2

# run automation task2 on headless chrome against V1 of web app, in quiet mode
$ npx cypress run --quiet --browser chrome --headless --spec cypress/integration/applifashion/task2.spec.js --env TEST_VERSION=1

# run automation task3 on chrome against V2 of web app
# append test results to file named "TestResults.log", but view progress in console
$ npx cypress run --browser chrome --spec cypress/integration/applifashion/task3.spec.js --env TEST_VERSION=2 2>>TestResults.log
```

## GENERATE THE MODERN TEST RESULTS

You'll need to add your API key to [ModernTestsV1/applitools.config.js](ModernTestsV1/applitools.config.js)

```shell
$ cd ModernTestsV1
$ npm install
# V1 of webapp
$ npx cypress run --spec cypress/integration/applifashion/task1.spec.js --env TEST_VERSION=1
$ npx cypress run --spec cypress/integration/applifashion/task2.spec.js --env TEST_VERSION=1
$ npx cypress run --spec cypress/integration/applifashion/task3.spec.js --env TEST_VERSION=1
# V2 of webapp
$ npx cypress run --spec cypress/integration/applifashion/task1.spec.js --env TEST_VERSION=2
$ npx cypress run --spec cypress/integration/applifashion/task2.spec.js --env TEST_VERSION=2
$ npx cypress run --spec cypress/integration/applifashion/task3.spec.js --env TEST_VERSION=2
```

## OVERALL TIME

The writing of the tests themselves didn't take very long, cypress makes it pretty with it's rapid feedback
loop.  As far as finding locators and actual writing of code to click on things, change viewports etc, I'd estimate
that I spent about 15 hours (a little less than half hour per test, on average).  Of course, the "extra" time related
to visual concerns really added to the overall time to complete the tasks.

I would estimate the total time I spent on the traditional testing method would be somewhere in the vicinity of
32 hours, with about 50% of that not even remotely related to the app, and instead mostly related to figuring out
how to write, hard to maintain, situation-specific, and delicate code to detect color, layout, and styling issues.

Writing visual tests using tradtional methods is clearly not sustainable.


## NOTABLE CHALLENGES

### FINDING OVERLAPS IN DIVS, LAYOUT PROBLEMS

In this challenge, I have discovered that it's very difficult (nearly impossible?) to reliably detect layout problems
like div overlap, alignment issues etc. using traditional testing.  This hackacthon represents the first time I have
attempted any kind of "visual testing".

Programmatically testing for these layout prolems took me about three hours to get this "sort-of" working and involved
multiple round trips to stackoverflow for questions about rectangle intersection etc.  While learning about element
bounding boxes and rectange intersection is a great academic pursuit, this kind of thing really gets in the way of the
goal I am trying to accomplish, which is app testing.

I would also expect this "academic noodling" code to be very hard to maintain, and fragile to future webapp changes.

### FINDING STYLE CHANGES (FONT COLOR, CURRENCY FORMATTING, STRIKETHROUGH)

Image comparision also proved to be very challenging.  This one took me about 6 hours to complete when I finally
decided on a method to use (probably after about another 4 hours of reading about image comparision).

In the case of detecting the "erroneous white shoe", I settled on using a comparision of "dominant color" of the
shoe images with the filter color selected (in this case "Black").  I use `color-thief` NPM Module for this
purpose.

Then I had the challenge of determining whether or not the dominant color (RBG array) was "close enough" to the
filter color selected, which meant I also had to determine what the filter color's RGB was.  I settled on using
the "cartesian distance between RGB color "points" in 3 dimensions" as the metric for closeness.

Again, all this had nothing to do with the task at hand: app testing.  Doing this in my real job would be very
undesirable due to its effect on my work output performance.

So far as I know, the code I wrote would work to test any of the color filters, which I am kind of proud of.

I used RegExp to check for formatting, though admittedly this is pretty specific, and undesirable.

To detect styling problems (like strike-through in old price bug) I ended up using `window.getComputedStyle()`
which is very slow, and not easy to use for this kind of thing.


### COERCING CYPRESS TO OUTPUT REPORT IN FORMAT REQUIRED FOR HACKKATHON

Finally, I wanted to be able to write the code once, and not have to specialize it for the V1 and V2 webapps.
This caused me to have to write a Cypress reporter, which ended up sucking about 2 hours of my time, and
I'm still not happy with how I ended up doing it.  I am certain there is a better way than my "hey let's
record the domId on the test title" and then pick it off in the reporter.  I tried hanging a custom property
on the `this.test` instance, but it didn't survive the trip from the test execution to the reporter.  I did
find that the test title property does survive the trip, so that's why I used it.

