// src/contexts/SingleGameContext.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { generateBoard } from "../utils/ShipPlacement";

const SingleGameContext = createContext();

/**
 * Provider for single‑player (AI) Battleship game.
 * Hides AI ships on the opponent’s board.
 */
export function SingleGameProvider({ children }) {
  // Player and AI boards
  const [playerBoard, setPlayerBoard] = useState([]);
  const [opponentBoard, setOpponentBoard] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("player");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [time, setTime] = useState(0);

  // AI targeting memory
  const [aiMemory, setAiMemory] = useState({ hitsQueue: [] });

  // Reset both boards and state
  const resetGame = useCallback(() => {
    setPlayerBoard(generateBoard());
    setOpponentBoard(generateBoard());
    setCurrentTurn("player");
    setGameOver(false);
    setWinner(null);
    setTime(0);
    setAiMemory({ hitsQueue: [] });
  }, []);

  // Initialize on mount
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Timer for single‑player
  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [gameOver]);

  // Utility: check defeat
  const isDefeated = (board) =>
    board.every((row) => row.every((cell) => !(cell.hasShip && !cell.isHit)));

  // Player’s move
  const playerMove = (r, c) => {
    if (currentTurn !== "player" || gameOver) return;
    const newBoard = opponentBoard.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
    const cell = newBoard[r][c];
    if (cell.isHit || cell.isMiss) return;

    if (cell.hasShip) cell.isHit = true;
    else cell.isMiss = true;

    setOpponentBoard(newBoard);

    if (isDefeated(newBoard)) {
      setGameOver(true);
      setWinner("Player");
    } else {
      setCurrentTurn("ai");
    }
  };

  // AI’s move logic
  const aiMove = useCallback(() => {
    if (currentTurn !== "ai" || gameOver) return;

    const newBoard = playerBoard.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
    let { hitsQueue } = aiMemory;
    let move = hitsQueue.shift() || null;

    if (!move) {
      // pick random untargeted cell
      const candidates = [];
      newBoard.forEach((row, i) =>
        row.forEach((cell, j) => {
          if (!cell.isHit && !cell.isMiss)
            candidates.push({ r: i, c: j });
        })
      );
      move = candidates[Math.floor(Math.random() * candidates.length)];
    }

    const target = newBoard[move.r][move.c];
    if (target.hasShip) {
      target.isHit = true;
      // enqueue neighbors
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
        const nr = move.r + dr,
          nc = move.c + dc;
        if (
          nr >= 0 &&
          nr < 10 &&
          nc >= 0 &&
          nc < 10 &&
          !newBoard[nr][nc].isHit &&
          !newBoard[nr][nc].isMiss
        ) {
          hitsQueue.push({ r: nr, c: nc });
        }
      });
    } else {
      target.isMiss = true;
    }

    setPlayerBoard(newBoard);
    setAiMemory({ hitsQueue });

    if (isDefeated(newBoard)) {
      setGameOver(true);
      setWinner("AI");
    } else {
      setCurrentTurn("player");
    }
  }, [currentTurn, gameOver, playerBoard, aiMemory]);

  // Trigger AI move after a short delay
  useEffect(() => {
    if (currentTurn === "ai" && !gameOver) {
      const id = setTimeout(aiMove, 200);
      return () => clearTimeout(id);
    }
  }, [currentTurn, gameOver, aiMove]);

  // Exposed makeMove triggers only playerMove
  const makeMove = (r, c) => {
    playerMove(r, c);
  };

  // **Hide AI ships** on the opponent board before exposing it
  const visibleOpponentBoard = opponentBoard.map((row) =>
    row.map((cell) => ({
      hasShip: false,
      isHit: cell.isHit,
      isMiss: cell.isMiss,
    }))
  );

  // Bundle into the same shape as multiplayer
  const game = {
    playerBoard,
    opponentBoard: visibleOpponentBoard,
    currentTurn,
    status: gameOver ? "Completed" : "Active",
    winner,
    time,
    isMyTurn: currentTurn === "player",
  };

  return (
    <SingleGameContext.Provider
      value={{
        game,
        loading: false,
        error: null,
        loadGame: resetGame,
        makeMove,
        resetGame,
      }}
    >
      {children}
    </SingleGameContext.Provider>
  );
}

export const useSingleGame = () => useContext(SingleGameContext);
