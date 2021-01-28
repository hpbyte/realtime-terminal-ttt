"use strict";

const clear = require("clear");
const socket = require("socket.io-client")(
  process.argv[2] || "http://localhost:3000"
);

const {
  print,
  drawBoard,
  clearPrint,
  confirmReplay,
  askUsername,
  printScoreboard,
  showGameOver,
} = require("./utils/helpers");

socket.on("connect", () => {
  clear();

  askUsername((data) => {
    socket.emit("enter", data.username);
  });
});

socket.on("uname-exists", (msg) => {
  print(msg);

  askUsername((data) => {
    socket.emit("enter", data.username);
  });
});

socket.on("progress", (msg) => {
  drawBoard(msg.split("|"), (move) => {
    socket.emit("move", move);
  });
});

socket.on("info", (msg) => {
  print(msg);

  clearPrint();
});

socket.on("over", (msg) => {
  showGameOver(msg);
});

socket.on("replay", (msg) => {
  confirmReplay(msg, (value) => {
    socket.emit("replayConfirm", value);
  });
});

socket.on("scoreboard", (msg) => {
  const { total, X, O, tie } = JSON.parse(msg);

  printScoreboard(`[Total: ${total} | X: ${X} | O: ${O} | tie: ${tie}]`);
});

socket.on("disconnect", () => {
  print("Disconnected 😞");
  process.exit();
});
