"use strict";

/*
 * Main App Logic
 *
 * Responsible for:
 * - creating the games
 * - removing the games
 * - assigning players to games
 *
 */

const UserCtrler = require("./controllers/user");
const RoomCtrler = require("./controllers/room");

const { normalize } = require("./utils/helpers");
const { messages } = require("./utils/constants");

const {
  msg_tie,
  msg_win,
  msg_lose,
  msg_resign,
  msg_replay,
  msg_game_0,
  msg_game_1,
  msg_not_yet,
  msg_waiting,
  msg_player_x,
  msg_player_o,
  msg_uname_exists,
} = messages;

class App {
  constructor(socketIO) {
    this.io = socketIO;
    this.dict = new Map();
    this.userCtrler = new UserCtrler();
    this.roomCtrler = new RoomCtrler();
  }

  // Match the two participants in a new game
  match(players) {
    const [playerX, playerO] = players;

    const pXSocketID = playerX.socket.id;
    const pOSocketID = playerO.socket.id;

    const newGame = this.roomCtrler.create([pXSocketID, pOSocketID]);
    const roomID = newGame.gameID;

    newGame.init();

    // players join the room
    playerX.socket.join(roomID);
    playerO.socket.join(roomID);

    // roomID => players
    this.dict.set(roomID, {
      playerX: pXSocketID,
      playerO: pOSocketID,
    });

    // player => room
    this.dict.set(pXSocketID, roomID);
    this.dict.set(pOSocketID, roomID);

    this.io.to(pXSocketID)
      .emit("info", `${msg_game_1} ${msg_player_x}`);
    this.io.to(pOSocketID)
      .emit("info", `${msg_game_1} ${msg_player_o}`);

    this.io.to(roomID)
      .emit("progress", newGame.progress);
    this.io.to(roomID)
      .emit("scoreboard", JSON.stringify(newGame.scoreboard));
  }

  /*
   * Whenever a new user joins the server, decides whether to:
   * - make the user wait or
   * - match the players and start the game
   */
  handleEnter(socket, username) {
    const exists = this.userCtrler.checkExists(username);

    if (exists) {
      socket.emit("uname-exists", msg_uname_exists);
    } else {
      this.userCtrler.add2Queue(socket, username);

      if (this.userCtrler.queueSize >= 2) {
        const players = this.userCtrler.add2Store();

        this.match(players);
      } else {
        socket.emit("info", msg_waiting);
      }
    }
  }

  handlePlay(socket, message) {
    const normalized = normalize(message);

    const roomID = this.dict.get(socket.id);
    const game = this.roomCtrler.getRoom(roomID);
    const currentPlayer = game.participants[socket.id];

    const move = Number(normalized);

    const playerTurn = game._turn === currentPlayer;

    // game has started, move is valid and is the player's turn
    if (playerTurn && game.status === 1) {
      const accepted = game.makeMove(currentPlayer, move);

      if (accepted) {
        const progress = game.progress;

        this.io.to(roomID).emit("progress", progress);

        if (game.status === 3) {
          // game with decisive outcome
          socket.emit("over", msg_win);
          socket.broadcast.to(roomID).emit("over", msg_lose);

          this.io.to(roomID).emit("replay", msg_replay);

          game.updateScoreboard(currentPlayer);

          game.reset();
        } else if (game.status === 2) {
          // game has tied
          this.io.to(roomID).emit("over", msg_tie);
          this.io.to(roomID).emit("replay", msg_replay);

          game.updateScoreboard("tie");

          game.reset();
        } else {
          // toggle turns
          socket.broadcast.to(roomID).emit("progress", progress);

          game.toggleTurn();
        }
      }
    } else if (!playerTurn) {
      socket.emit("info", msg_not_yet);
    } else {
      socket.emit("info", msg_game_0);
    }
  }

  handleReplay(socket, confirmed) {
    const roomID = this.roomCtrler.getCurrentRoomID(socket);
    const game = this.roomCtrler.getRoom(roomID);

    if (!confirmed) {
      this.roomCtrler.remove(roomID);
      socket.disconnect();
    } else if (game.replayConfirmed === 0) {
      game.confirmReplay();
    } else {
      game.reset();
      game.init();

      this.io.to(roomID)
        .emit("scoreboard", JSON.stringify(game.scoreboard));
      this.io.to(roomID).emit("info", msg_game_1);
      this.io.to(roomID).emit("progress", game.progress);
    }
  }

  handleDisconnect(socketID) {
    const roomID = this.dict.get(socketID);

    this.dict.delete(socketID);
    this.userCtrler.remove(socketID);

    this.io.to(roomID).emit("info", msg_resign);
  }
}

module.exports = App;
