// frontend/src/pages/MultiplayerJoinSetupPage.jsx

import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import ShipSetup from "../utils/ShipSetup";
import api from "../api/axios";

export default function MultiplayerJoinSetupPage() {
  const { user } = useContext(UserContext);
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleSetupComplete = async (board) => {
    const numericBoard = board.map((row) =>
      row.map((cell) => (cell.hasShip ? 1 : 0))
    );
    try {
      await api.post(`/games/join/${gameId}`, { player2Id: user.id });

      await api.put(`/games/setup/${gameId}`, { board: numericBoard });

      navigate(`/game/multiplayer/${gameId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Join or setup failed");
    }
  };

  return (
    <div className="setup-page">
      <h2>Place Your Ships to Join Game</h2>
      {error && <p className="error">{error}</p>}
      <ShipSetup onComplete={handleSetupComplete} />
    </div>
  );
}
