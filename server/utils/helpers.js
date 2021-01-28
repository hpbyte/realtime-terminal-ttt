"use strict";

const chalk = require("chalk");

// normalize user inputs
const normalize = (str = "") => str.replace(/[\s\n]/g, "");

// logging
const log = {
  error: (msg) => console.log(chalk.red(msg)),
  info: (msg) => console.log(chalk.blue(msg)),
  warn: (msg) => console.log(chalk.yellow(msg)),
  success: (msg) => console.log(chalk.green(msg)),
};

// generate a random number < 1000
const genKey = () => Math.round(Math.random() * 1000).toString();

module.exports = {
  normalize,
  log,
  genKey,
};
