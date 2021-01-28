"use strict";

const clear = require("clear");
const socket = require("socket.io-client")(
  process.argv[2] || "http://localhost:3000"
);

socket.on("connect", () => {
  clear();
  console.log("Connected");
});

socket.on("uname-exists", (msg) => {});

socket.on("progress", (msg) => {});

socket.on("info", (msg) => {});

socket.on("over", (msg) => {});

socket.on("replay", (msg) => {});

socket.on("scoreboard", (msg) => {});

socket.on("disconnect", () => {
  // disconnected
  process.exit();
});
