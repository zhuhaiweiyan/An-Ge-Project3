// backend/routes/gameRoutes.js

const express = require("express");
const {
  createGame,
  joinGame,
  setupPlayer2,
  getAllGames,
  getGameById,
  move,
  getHighScores,
} = require("../controllers/gameController");

const auth = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/highscores", getHighScores);
router.post("/create", auth, createGame);
router.put("/setup/:gameId", auth, setupPlayer2);
router.post("/join/:gameId", auth, joinGame);
router.put("/:gameId/move", auth, move);
router.get("/:gameId", auth, getGameById);
router.get("/", getAllGames);

module.exports = router;
