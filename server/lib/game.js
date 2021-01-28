"use strict";

/*
 * Game Rooms
 *
 * Responsible for:
 * - hosting the participants
 * - tracking the participants' moves
 * - and the overall progress of the game
 *
 */

const { checkIsTied, checkWin } = require("./engine");

class Game {
  constructor(gameID, [pX, pO]) {
    this.gameID = gameID;
    this.board = new Map();
    this.moves = {
      X: [],
      O: [],
    };
    this.scoreboard = {
      total: 0,
      X: 0,
      O: 0,
      tie: 0,
    };
    this._status = 0;
    this._turn = "X";
    this.participants = {
      [pX]: "X",
      [pO]: "O",
    };
    this.replayConfirmed = 0;
  }

  /*
   * For starting the game
   */
  init() {
    this._status = 1;
    this._turn = "X";
    this.replayConfirmed = 0;
    // fill the board
    Array
      .from(Array(9).keys())
      .forEach((c) => this.board.set(c + 1, null));
  }

  // get status of the game
  get status() {
    if (checkWin(this.moves, this._turn)) {
      this._status = 3;
    } else if (checkIsTied(this.progress)) {
      this._status = 2;
    }

    return this._status;
  }

  // show the board
  get progress() {
    return [...this.board.values()]
      .reduce((a, b) => `${a}${b || '.'}|`, '');
  }

  // toggle turn
  toggleTurn() {
    this._turn = this._turn === "X" ? "O" : "X";
  }

  confirmReplay() {
    this.replayConfirmed = 1;
  }

  /*
    * For tracking the participants' moves
    * @param playerMark string
    * @param tileNumber number
    */
  makeMove(playerMark, tileNumber) {
    if (this.board.get(tileNumber)) {
      return false;
    }

    this.moves[playerMark].push(tileNumber);
    this.board.set(tileNumber, playerMark);

    return true;
  }

  reset() {
    this.board.clear();
    this.moves = {
      X: [],
      O: [],
    };
    this._status = 0;
  }

  updateScoreboard(winner) {
    this.scoreboard = {
      ...this.scoreboard,
      total: this.scoreboard.total + 1,
      [winner]: this.scoreboard[winner] + 1,
    };
  }
}

module.exports = Game;
