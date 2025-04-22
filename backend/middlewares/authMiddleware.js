// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(id).select("-password");
    if (!req.user) throw new Error();
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
