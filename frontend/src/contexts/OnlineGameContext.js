// frontend/src/contexts/OnlineGameContext.js

import React, { createContext, useContext, useState, useCallback } from "react";
import { getGame, makeMove as apiMove } from "../api/game";
import { UserContext } from "./UserContext";

const OnlineGameContext = createContext();

export function OnlineGameProvider({ children }) {
  const { user } = useContext(UserContext);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadGame = useCallback(
    async (gameId, silent = false) => {
      if (!gameId) return;
      if (!silent) setLoading(true);
      setError("");

      try {
        const {
          data: { game: raw },
        } = await getGame(gameId);

        const p1 = raw.player1._id.toString();
        const p2 = raw.player2?._id?.toString();
        const me = user.id; // from UserContext

        const imPlayer1 = me === p1;
        const mapGrid = (numericGrid, hideShips) =>
          numericGrid.map((row) =>
            row.map((val) => ({
              hasShip: !hideShips && val === 1,
              isMiss: val === 2,
              isHit: val === 3,
            }))
          );

        const playerBoard = imPlayer1
          ? mapGrid(raw.player1Board.grid, false)
          : mapGrid(raw.player2Board.grid, false);
        const opponentBoard = imPlayer1
          ? mapGrid(raw.player2Board.grid, true)
          : mapGrid(raw.player1Board.grid, true);

        const activeId = raw.currentTurn.toString();
        const isMyTurn = activeId === me;

        let elapsedSecs = 0;
        if (raw.startTime) {
          const start = new Date(raw.startTime).getTime();
          elapsedSecs = Math.floor((Date.now() - start) / 1000);
        }

        setGame({
          ...raw,
          playerBoard,
          opponentBoard,
          isMyTurn,
          time: elapsedSecs,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load game");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [user]
  );

  const makeMove = useCallback(
    async (row, col, silent = false) => {
      if (!game) return;
      setError("");
      try {
        await apiMove(game._id, row, col);
        await loadGame(game._id, true);
      } catch (err) {
        setError(err.response?.data?.error || "Move failed");
      }
    },
    [game, loadGame]
  );

  const resetGame = useCallback(() => {
    setGame(null);
    setError("");
    setLoading(false);
  }, []);

  return (
    <OnlineGameContext.Provider
      value={{ game, loading, error, loadGame, makeMove, resetGame }}
    >
      {children}
    </OnlineGameContext.Provider>
  );
}

export const useOnlineGame = () => useContext(OnlineGameContext);
