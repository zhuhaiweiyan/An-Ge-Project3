// backend/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

connectDB();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
