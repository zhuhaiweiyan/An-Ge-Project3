import React from "react";
import { useGameContext } from "../contexts/GameContext";
import Cell from "./Cell";
import "../css/Board.css";

export default function Board({ isPlayerBoard, mode }) {
  const { game } = useGameContext(mode);
  const grid = isPlayerBoard ? game.playerBoard : game.opponentBoard;

  if (!grid || !Array.isArray(grid)) return <p>Board not available.</p>;

  return (
    <div className="board-grid">
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            row={r}
            col={c}
            isPlayerBoard={isPlayerBoard}
            cellData={cell}
            mode={mode}
          />
        ))
      )}
    </div>
  );
}
