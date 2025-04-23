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
    if (!gameId) return;
    resetGame();
    if (isMultiplayer) {
      if (gameId) loadGame(gameId);
    } else {
      resetGame(); // start single‑player
    }
  }, [mode, gameId, isMultiplayer, loadGame, resetGame]);

  useEffect(() => {
    if (!isMultiplayer || !game) return;

    const shouldPoll =
      game.status === "Pending" ||
      (game.status === "Active" && !game.isMyTurn) ||
      (game.status === "Active" && game.isMyTurn && !game.playerBoard);
    if (!shouldPoll) return;

    const intervalId = setInterval(() => {
      loadGame(gameId, true);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [isMultiplayer, game, loadGame, gameId]);

  if (error) {
    return <p className="error">Error loading game: {error}</p>;
  }

  if (loading || !game) return <p>Loading game…</p>;

  const { status, winner, time, isMyTurn } = game;
  const isWaiting = isMultiplayer && status === "Pending";

  return (
    <div className={`game-page-container${isWaiting ? " waiting" : ""}`}>
      {isWaiting && <div className="info-banner">Waiting for opponent…</div>}
      <div className="top-bar">
        <h2 className="page-title">
          {isMultiplayer ? `Multiplayer: ${game._id}` : "Single Player --- AI"}
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
