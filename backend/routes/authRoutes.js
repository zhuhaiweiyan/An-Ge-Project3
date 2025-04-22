// backend/routes/authRoutes.js

const express = require("express");
const {
  register,
  login,
  logout,
  getHighScores,
} = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/highscores", getHighScores);

module.exports = router;
