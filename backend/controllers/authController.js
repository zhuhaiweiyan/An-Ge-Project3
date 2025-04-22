// backend/controllers/authController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

exports.register = async (req, res) => {
  const { username, password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  try {
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await new User({ username, password: hashed }).save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.status(201).json({
      message: "Registered",
      user: { id: user._id, username: user.username },
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: "Registration error", details: err });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ error: "Username does not exist" });
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid password" });
    }
    // Optionally issue a JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.json({
      message: "Login successful",
      user: { id: user._id, username: user.username },
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: "Login error", details: err });
  }
};

exports.logout = (req, res) => {
  // If using cookies: res.clearCookie('token');
  res.json({ message: "Logout successful" });
};

exports.getHighScores = async (req, res) => {
  try {
    const users = await User.find().select("username wins losses").lean();
    users.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return a.username.localeCompare(b.username);
    });
    res.json({ highscores: users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch highscores", details: err });
  }
};
