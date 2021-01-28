"use strict";

const { createServer } = require("http");
const { Server } = require("socket.io");
const clear = require("clear");

const { log } = require("./utils/helpers");

// server port
const PORT = process.argv[2] || 3000;

const httpServer = createServer();
const io = new Server(httpServer);

clear();

io.on("connection", (socket) => {
  log.info(`New user connected to the server: ${socket.id}`);

  socket.on("enter", (uname) => {
    log.info(`${socket.id} has entered.`);
  });

  socket.on("move", (move) => {
    log.info(`${socket.id} has made move.`);
  });

  socket.on("replayConfirm", (confirmed) => {
    log.info(`${socket.id} has confirmed replay.`);
  });

  socket.on("disconnect", () => {
    log.info(`${socket.id} is disconnected.`);
  });
});

httpServer.listen(PORT, () => {
  log.success(`Game server listening on PORT:${PORT}`);
  log.warn("----------------------------------------");
});
