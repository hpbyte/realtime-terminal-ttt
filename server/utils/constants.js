"use strict";

// prefix
const roomPrefix = "game_room_";

// Winning sequences
const combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

// display messages
const messages = {
  msg_tie: "Tied!",
  msg_win: "U Won!",
  msg_lose: "U Lost!",
  msg_resign: "The other player has resigned",
  msg_replay: "Play one more?",
  msg_game_0: "Game has not started yet!",
  msg_game_1: "Game started",
  msg_invalid: "Invalid move",
  msg_not_yet: "It's not your move yet.",
  msg_waiting: "Waiting for another player",
  msg_player_x: "You are 'Player X.",
  msg_player_o: "You are 'Player O.",
  msg_uname_exists: "Username already exists!",
};

module.exports = { combos, roomPrefix, messages };
