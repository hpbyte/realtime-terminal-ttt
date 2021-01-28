"use strict";

const Player = require("../lib/player");

class UserController {
  constructor() {
    this.players = new Map();
    this.queue = [];
  }

  get queueSize() {
    return this.queue.length;
  }

  add2Store() {
    const twoPlayers = this.queue.splice(0, 2);

    const [p1, p2] = twoPlayers;

    this.players.set(p1.socket.id, p1);
    this.players.set(p2.socket.id, p2);

    return twoPlayers;
  }

  add2Queue(socket, username) {
    const player = new Player(socket, username);

    this.queue.push(player);
  }

  getPlayer(socketID) {
    return this.players.get(socketID);
  }

  remove(socketID) {
    this.players.delete(socketID);
  }

  checkExists(username) {
    const users = [...this.players.values(), ...this.queue];

    return users.find((user) => user.username === username);
  }
}

module.exports = UserController;
