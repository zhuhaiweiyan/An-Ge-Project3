// backend/models/Game.js

const mongoose = require("mongoose");

// Define a schema for the game board (10x10 grid)
const BoardSchema = new mongoose.Schema({
  grid: {
    type: [[Number]],
    default: () => {
      const grid = [];
      for (let i = 0; i < 10; i++) {
        grid.push(Array(10).fill(0));
      }
      return grid;
    },
  },
});

const GameSchema = new mongoose.Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentTurn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  status: {
    type: String,
    enum: ["Open", "Pending", "Active", "Completed"],
    default: "Open",
  },

  player1Board: {
    type: BoardSchema,
    default: () => ({}),
  },
  player2Board: {
    type: BoardSchema,
    default: () => ({}),
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
});

module.exports = mongoose.model("Game", GameSchema);
