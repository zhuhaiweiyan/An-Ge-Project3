// src/components/Cell.jsx

import React from "react";
import { useGameContext } from "../contexts/GameContext";
import "../css/Cell.css";

export default function Cell({ row, col, isPlayerBoard, cellData, mode }) {
  const { game, makeMove } = useGameContext(mode);

  // Only allow firing on opponent board, when it's your turn, and cell not yet chosen
  const canClick =
    !isPlayerBoard && game.isMyTurn && !cellData.isHit && !cellData.isMiss;

  const handleClick = () => {
    if (canClick) {
      makeMove(row, col);
    }
  };

  // Build className based on cell state
  let className = "cell";
  if (cellData.hasShip) className += " has-ship";
  if (cellData.isMiss) className += " is-miss";
  if (cellData.isHit) className += " is-hit";
  if (canClick) className += " clickable";

  return (
    <div
      className={className}
      onClick={handleClick}
      title={canClick ? "Click to fire" : ""}
    />
  );
}
