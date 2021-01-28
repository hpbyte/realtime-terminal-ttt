"use strict";

const chalk = require("chalk");

const { combos } = require("./constants");

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

const checkWin = (moves, player) => {
  for (let i = 0, comboLength = combos.length; i < comboLength; i++) {
    const combo = combos[i];

    if (combo.every((c) => moves[player].includes(c + 1))) {
      return true;
    }
  }

  return false;
};

const checkIsTied = (progress = "") => {
  return progress
    .replace(/\n/g, "")
    .split("")
    .every((s) => s !== ".");
};

module.exports = {
  normalize,
  log,
  genKey,
  checkWin,
  checkIsTied,
};
