"use strict";

/*
 * Player
 *
 * Responsible for:
 * - store player information such as username etc.
 */

class Player {
  constructor(socket, username) {
    this.socket = socket;
    this.username = username;
  }
}

module.exports = Player;
