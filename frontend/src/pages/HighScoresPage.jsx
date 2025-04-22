// src/pages/HighScoresPage.jsx

import React, { useEffect, useState, useContext } from "react";
import { getHighScores } from "../api/game";
import { UserContext } from "../contexts/UserContext";
import "../css/HighScoresPage.css";

export default function HighScoresPage() {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch the high score list
    getHighScores()
      .then((res) => {
        setScores(res.data.highscores || []);
      })
      .catch((err) => {
        console.error("HighScores fetch error:", err);
        setError("Unable to load high scores");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Show loading, error, empty or table
  if (loading) {
    return <p>Loading high scores…</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (scores.length === 0) {
    return <p>No high scores yet.</p>;
  }

  return (
    <div className="highscores-container">
      <h2>High Scores</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Score</th> {/* new column */}
          </tr>
        </thead>
        <tbody>
          {scores.map((u) => (
            <tr
            key={u.username}
            className={user?.username === u.username ? "current-user" : ""}
          >
              <td>{u.username}</td>
              <td>{u.wins}</td>
              <td>{u.losses}</td>
              <td>{u.score}</td> {/* display computed score */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
