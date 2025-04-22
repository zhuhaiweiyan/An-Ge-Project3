// backend/controllers/gameController.js

const Game = require("../models/Game");
const User = require("../models/User");

exports.createGame = async (req, res) => {
  const { player1Id, mode, setupComplete, board } = req.body;
  if (!player1Id) {
    return res.status(400).json({ error: "player1Id is required" });
  }
  try {
    let status = "Open";
    if (mode === "multiplayer" && !setupComplete) status = "Pending";

    const game = await Game.create({
      player1: player1Id,
      currentTurn: player1Id,
      status,
      ...(board && { player1Board: { grid: board } }),
    });
    res.json({ message: "Game created", game });
  } catch (err) {
    res.status(500).json({ error: "Create game failed", details: err });
  }
};

exports.joinGame = async (req, res) => {
  const { gameId } = req.params;
  const { player2Id } = req.body;
  if (!player2Id)
    return res.status(400).json({ error: "player2Id is required" });
  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });

    if (game.status !== "Pending") {
      return res.status(400).json({ error: "Game not open" });
    }
    game.player2 = player2Id;
    await game.save();
    res.json({ message: "Joined", game });
  } catch (err) {
    res.status(500).json({ error: "Join game failed", details: err });
  }
};

exports.setupPlayer2 = async (req, res) => {
  const { gameId } = req.params;
  const { board } = req.body;
  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });
    if (!game.player2)
      return res.status(400).json({ error: "No second player yet" });
    game.player2Board.grid = board;
    game.currentTurn = game.player1;
    game.status = "Active";
    await game.save();
    res.json({ message: "Game setup complete", game });
  } catch (err) {
    res.status(500).json({ error: "Setup failed", details: err });
  }
};

exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find()
      .populate("player1 player2 winner", "username")
      .lean();
    res.json({ games });
  } catch (err) {
    res.status(500).json({ error: "Fetch games failed", details: err });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId).populate(
      "player1 player2 winner",
      "username"
    );
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json({ game });
  } catch (err) {
    res.status(500).json({ error: "Fetch game failed", details: err });
  }
};

exports.move = async (req, res) => {
  const { gameId } = req.params;
  const playerId = req.user._id.toString();
  const { row, col } = req.body;

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });
    if (game.status !== "Active")
      return res.status(400).json({ error: "Game not active" });
    if (game.currentTurn.toString() !== playerId)
      return res.status(400).json({ error: "Not your turn" });

    // Determine opponent board
    const isP1 = game.player1.toString() === playerId;
    const boardField = isP1 ? "player2Board" : "player1Board";
    const board = game[boardField].grid;

    // 0=water,1=ship,2=miss,3=hit
    if (board[row][col] === 1) {
      board[row][col] = 3; // hit
    } else if (board[row][col] === 0) {
      board[row][col] = 2; // miss
    } else {
      return res.status(400).json({ error: "Cell already chosen" });
    }

    // Check win: no more 1's left on opponent board
    const flat = board.flat();
    const opponentWon = !flat.includes(1);
    if (opponentWon) {
      game.status = "Completed";
      game.winner = playerId;
      game.endTime = Date.now();
      // increment stats
      const loserId = isP1 ? game.player2 : game.player1;
      await Promise.all([
        User.findByIdAndUpdate(playerId, { $inc: { wins: 1 } }),
        User.findByIdAndUpdate(loserId, { $inc: { losses: 1 } }),
      ]);
    } else {
      // switch turn
      game.currentTurn = isP1 ? game.player2 : game.player1;
    }

    // save board back
    game[boardField].grid = board;
    await game.save();

    res.json({ message: "Move processed", game });
  } catch (err) {
    res.status(500).json({ error: "Move failed", details: err });
  }
};

exports.getHighScores = async (req, res) => {
  try {
    // 1) Fetch username, wins, losses
    // 2) Sort: wins ↓, losses ↑, username A→Z
    // 3) lean() for plain JS objects
    const list = await User.find({
      $expr: { $gt: [{ $add: ["$wins", "$losses"] }, 0] },
    })
      .select("username wins losses -_id")
      .sort({ wins: -1, losses: 1, username: 1 })
      .lean();

    // 4) Compute score = wins*3 + losses
    const highscores = list.map((u) => ({
      username: u.username,
      wins: u.wins,
      losses: u.losses,
      score: u.wins * 3 - u.losses,
    }));

    return res.json({ highscores });
  } catch (err) {
    console.error("getHighScores error:", err);
    return res.status(500).json({ error: "Fetch highscores failed" });
  }
};
