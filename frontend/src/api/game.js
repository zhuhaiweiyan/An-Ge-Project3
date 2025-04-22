// wrappers for game‑related API calls
import api from "./axios";

export const getGame = (id) => api.get(`/games/${id}`);

export const makeMove = (gameId, row, col) =>
  api.put(`/games/${gameId}/move`, { row, col });

export function getHighScores() {
  return api.get("/games/highscores");
}
