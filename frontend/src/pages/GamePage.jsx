import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGameContext } from "../contexts/GameContext";
import Board from "../components/Board";
import "../css/GamePage.css";

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
}

export default function GamePage({ mode }) {
  const { gameId } = useParams();
  const isMultiplayer = mode === "multiplayer";
  const { game, loading, error, loadGame, makeMove, resetGame } =
    useGameContext(mode);

  useEffect(() => {
    if (isMultiplayer) {
      if (gameId) loadGame(gameId);
    } else {
      resetGame(); // start single‑player
    }
  }, [mode, gameId, isMultiplayer, loadGame, resetGame]);

  useEffect(() => {
    if (!isMultiplayer || !game) return;
    if (game.status === "Active" && !game.isMyTurn) {
      const interval = setInterval(() => {
        loadGame(game._id);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isMultiplayer, game, loadGame]);

  // if (loading) return <p>Loading game...</p>;
  // if (!game) return null;

  if (!game) return <p>Loading game…</p>;

  const infoBanner = error ? <div className="info-banner">{error}</div> : null;

  const { status, winner, time, isMyTurn } = game;

  return (
    <div className="game-page-container">
      {infoBanner}
      <div className="top-bar">
        <h2 className="page-title">
          {isMultiplayer
            ? `Multiplayer: ${game._id}`
            : `Single Player (${mode})`}
        </h2>
        <div className="info-section">
          <span className="timer">Time: {formatTime(time)}</span>
          {/* {loading && <span className="refreshing">Refreshing...</span>} */}
          {!isMultiplayer && <button onClick={resetGame}>Restart</button>}
        </div>
      </div>

      {status === "Active" && !winner && (
        <div
          className={`turn-indicator ${isMyTurn ? "my-turn" : "their-turn"}`}
        >
          {isMyTurn ? "Your turn" : "Opponent's turn"}
        </div>
      )}

      {status === "Completed" && winner && (
        <div className="game-over-banner">
          <span>
            Game Over! Winner:{" "}
            {winner === "Player" ? "You" : winner.username || "Opponent"}
          </span>
        </div>
      )}

      <div className="boards-container">
        <div className="board-wrapper">
          <h3 className="board-title">Your Board</h3>
          <Board isPlayerBoard={true} mode={mode} />
        </div>
        <div className="board-wrapper">
          <h3 className="board-title">
            {isMultiplayer ? "Opponent Board" : "AI Board"}
          </h3>
          <Board isPlayerBoard={false} mode={mode} />
        </div>
      </div>
    </div>
  );
}
