"use strict";

const blessed = require("blessed");
const figlet = require("figlet");

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
});

screen.title = "Tic Tac Toe";

// Quit on Escape, q, or Control-C.
screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

const title = blessed.text({
  parent: screen,
  align: "center",
  content: figlet.textSync("Tic-Tac-Toe", { horizontalLayout: "full" }),
  style: {
    fg: "blue",
  },
});

const warning = blessed.text({
  parent: screen,
  bottom: 0,
  left: "center",
  align: "center",
  style: {
    fg: "yellow",
  },
});

const boardLayout = blessed.layout({
  parent: screen,
  top: "center",
  left: "center",
  // border: "line",
  width: "50%",
  height: "50%",
  renderer: function (coords) {
    const self = this;

    // The coordinates of the layout element
    const xi = coords.xi;

    // The current row offset in cells (which row are we on?)
    let rowOffset = 0;

    // The index of the first child in the row
    let rowIndex = 0;

    return function iterator(el, i) {
      el.shrink = true;

      const last = self.getLastCoords(i);

      if (!last) {
        el.position.left = "25%";
        el.position.top = 0;
      } else {
        el.position.left = last.xl - xi;

        if (i % 3 === 0) {
          rowOffset += self.children
            .slice(rowIndex, i)
            .reduce(function (out, el) {
              if (!self.isRendered(el)) return out;
              out = Math.max(out, el.lpos.yl - el.lpos.yi);
              return out;
            }, 0);
          rowIndex = i;
          el.position.left = "25%";
          el.position.top = rowOffset;
        } else {
          el.position.top = rowOffset;
        }
      }
    };
  },
});

const boxes = Array.from(Array(9).keys()).map(() => {
  const box = blessed.box({
    parent: boardLayout,
    width: 10,
    height: 5,
    border: "line",
    clickable: true,
    hidden: true,
    style: {
      hover: {
        bg: "green",
      },
      visible: false,
      border: {
        fg: "white",
      },
    },
  });

  return box;
});

const scoreboard = blessed.text({
  parent: screen,
  top: 6,
  left: "center",
  border: "line",
  clickable: false,
  hidden: true,
  style: {
    visible: false,
    border: {
      fg: "cyan",
    },
  },
});

const gameOver = blessed.text({
  parent: screen,
  align: "center",
  left: "center",
  bottom: 0,
  hidden: true,
  style: {
    fg: "cyan",
  },
});

function printScoreboard(scores) {
  scoreboard.setContent(scores);
  scoreboard.show();
  screen.render();
}

function hideBoard() {
  boxes.forEach((box) => {
    box.hide();
  });
  screen.render();
}

function drawBoard(progress, callback) {
  boxes.forEach((box, i) => {
    box.setContent(`${progress[i] || "."}`);
    box.show();

    box.on("click", () => {
      callback(`${i + 1}`);
    });
  });

  screen.render();
}

function print(msg) {
  warning.setContent(msg);
  screen.render();
}

function clearPrint() {
  setTimeout(() => print(""), 4000);
}

function confirmReplay(msg, callback) {
  const confirm = blessed.question({
    parent: screen,
    top: "center",
    left: "center",
    border: "line",
  });

  confirm.ask(msg, (err, value) => {
    if (!err) {
      callback(value);

      hideBoard();
      gameOver.hide();
    }
  });

  screen.render();
}

function askUsername(callback) {
  const form = blessed.form({
    parent: screen,
    top: "center",
    left: "center",
  });

  const question = blessed.textbox({
    parent: form,
    height: 3,
    name: "username",
    border: "line",
    style: {
      border: {
        fg: "green",
      },
    },
  });

  question.readInput();

  question.onceKey("enter", () => {
    form.submit();
  });

  form.on("submit", (data) => {
    callback(data);

    hideBoard();
    screen.remove(form);
  });

  screen.render();
}

function showGameOver(msg) {
  gameOver.setContent(figlet.textSync(msg));
  gameOver.show();
  screen.render();
}

module.exports = {
  print,
  drawBoard,
  clearPrint,
  askUsername,
  confirmReplay,
  printScoreboard,
  showGameOver,
};
