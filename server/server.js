"use strict";

const { createServer } = require("http");
const { Server } = require("socket.io");
const clear = require("clear");

const App = require("./app");
const { log } = require("./utils/helpers");

// server port
const PORT = process.argv[2] || 3000;

const httpServer = createServer();
const io = new Server(httpServer);

const app = new App(io);

clear();

io.on("connection", (socket) => {
  log.info(`New user connected to the server: ${socket.id}`);

  socket.on("enter", (uname) => {
    log.info(`${socket.id} has entered.`);
    app.handleEnter(socket, uname);
  });

  socket.on("move", (move) => {
    log.info(`${socket.id} has made move.`);
    app.handlePlay(socket, move);
  });

  socket.on("replayConfirm", (confirmed) => {
    log.info(`${socket.id} has confirmed replay.`);
    app.handleReplay(socket, confirmed);
  });

  socket.on("disconnect", () => {
    log.info(`${socket.id} is disconnected.`);
    app.handleDisconnect(socket.id);
  });
});

httpServer.listen(PORT, () => {
  log.success(`Game server listening on PORT:${PORT}`);
  log.warn("----------------------------------------");
});
