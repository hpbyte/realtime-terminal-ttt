"use strict";

const Game = require("../lib/game");
const { genKey } = require("../utils/helpers");
const { roomPrefix } = require("../utils/constants");

class RoomController {
  constructor() {
    this.ongoing = new Map();
  }

  create(participants) {
    const game = new Game(`${roomPrefix}${genKey()}`, participants);

    this.ongoing.set(game.gameID, game);

    return game;
  }

  getRoom(gameID) {
    return this.ongoing.get(gameID);
  }

  remove(gameID) {
    this.ongoing.delete(gameID);
  }

  getCurrentRoomID(socket) {
    const roomID = [...socket.rooms].find((room) =>
      `${room}`.includes(roomPrefix)
    );

    return roomID;
  }
}

module.exports = RoomController;
