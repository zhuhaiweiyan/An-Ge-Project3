// frontend/src/pages/MultiplayerSetupPage.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useGameContext } from "../contexts/GameContext";
import ShipSetup from "../utils/ShipSetup";
import api from "../api/axios";
import "../css/MultiplayerSetupPage.css";

export default function MultiplayerSetupPage() {
  const { user } = useContext(UserContext);
  const { resetGame } = useGameContext("multiplayer");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Require authentication: redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  // Callback when ship setup is complete
  const handleSetupComplete = async (board) => {
    const numericBoard = board.map((row) =>
      row.map((cell) => (cell.hasShip ? 1 : 0))
    );

    try {
      // Create multiplayer game with the provided board
      const res = await api.post("/games/create", {
        player1Id: user.id,
        mode: "multiplayer",
        setupComplete: false,
        board: numericBoard,
      });
      const gameId = res.data.game._id;
      resetGame();
      navigate(`/game/multiplayer/${gameId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create game");
    }
  };

  return (
    <div className="setup-page">
      <h2>Ship Setup</h2>
      <p>Drag and place your ships, then click Complete Setup.</p>
      {error && <p className="error">{error}</p>}
      <ShipSetup onComplete={handleSetupComplete} />
    </div>
  );
}
