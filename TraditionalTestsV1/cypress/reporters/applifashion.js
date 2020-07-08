/// <reference types="cypress" />


const reporters = require("mocha").reporters;
const { Console } = require('console');

class ApplifashionReporter extends reporters.Base {
  constructor(runner, options) {  
    super(runner, options);
    this.passes = 0;
    this.failures = 0;
    runner.on("end", this.onEnd.bind(this));
    runner.on("fail", this.onFail.bind(this));
    runner.on("pass", this.onPass.bind(this));
    this.title_id_regexp = new RegExp("^(?<title>.*?):::(?<domid>.*?)$");
    this.stderrConsole = new Console({
      stdout: process.stdout,
      stderr: process.stdout
    });
  }
  appendToReport(test, status) {
    let test_info = test.title;
    const matches = this.title_id_regexp.exec(test.title);
    if (matches) {
      const { title, domid } = this.title_id_regexp.exec(test.title).groups;
      test_info = `${title}, DOM Id: ${domid}, ${test.parent.title}`;
    } else {
      console.error(`no match groups for ${test.title}`);
    }
    process.stderr.write(`${test_info}, Status: ${status}\n`);
  }
  onFail(test, err) {
    this.failures++;
    this.appendToReport(test, 'Fail');
    const msg = {};
    msg[test.title] = err.stack;
    this.stderrConsole.error(msg);
  }
  onPass(test) {
    this.passes++;
    this.appendToReport(test, 'Pass');
  }
  onEnd() {
  }
}

module.exports = ApplifashionReporter;
