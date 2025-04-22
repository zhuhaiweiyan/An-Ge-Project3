import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import "../css/AllGamesPage.css";

export default function AllGamesPage() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Load all games
    api
      .get("/games")
      .then((res) => setGames(res.data.games || []))
      .catch((err) => {
        console.error("AllGames fetch error:", err);
        setError("Unable to load games");
      });
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  // Prepare buckets
  const openGames = [];
  const myOpenGames = [];
  const myActiveGames = [];
  const myCompletedGames = [];
  const otherGames = [];
  const activeAll = [];
  const completedAll = [];

  games.forEach((g) => {
    // Always collect for anonymous
    if (g.status === "Active") activeAll.push(g);
    if (g.status === "Completed") completedAll.push(g);

    if (user) {
      const isP1 = g.player1._id === user.id;
      const isP2 = g.player2?._id === user.id;
      const participated = isP1 || isP2;

      // Open games (Pending/Open)
      if (g.status === "Pending" || g.status === "Open") {
        if (isP1) myOpenGames.push(g);
        else openGames.push(g);
      }

      // Active games
      if (g.status === "Active") {
        if (participated) myActiveGames.push(g);
        else otherGames.push(g);
      }

      // Completed games
      if (g.status === "Completed") {
        if (participated) myCompletedGames.push(g);
        else otherGames.push(g);
      }
    }
  });

  const handleJoin = (id) => {
    if (!user) return navigate("/login");
    navigate(`/multiplayer-join-setup/${id}`);
  };

  // Helper: format date
  const fmt = (ts) => new Date(ts).toLocaleString();

  return (
    <div className="allgames-container">
      <h2>All Games</h2>

      {user ? (
        <>
          {/* 1. Open Games */}
          <section>
            <h3>Open Games</h3>
            {openGames.length === 0 ? (
              <p>No open games.</p>
            ) : (
              <ul>
                {openGames.map((g) => (
                  <li key={g._id}>
                    <Link to={`/game/multiplayer/${g._id}`}>Game {g._id}</Link>
                    <button onClick={() => handleJoin(g._id)}>Join Game</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 2. My Open Games */}
          <section>
            <h3>My Open Games</h3>
            {myOpenGames.length === 0 ? (
              <p>You have no games awaiting opponents.</p>
            ) : (
              <ul>
                {myOpenGames.map((g) => (
                  <li key={g._id}>
                    <Link to={`/game/multiplayer/${g._id}`}>Game {g._id}</Link>
                    <span>Started: {fmt(g.startTime)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 3. My Active Games */}
          <section>
            <h3>My Active Games</h3>
            {myActiveGames.length === 0 ? (
              <p>No active games you're playing.</p>
            ) : (
              <ul>
                {myActiveGames.map((g) => {
                  const opp = g.player1._id === user.id ? g.player2 : g.player1;
                  return (
                    <li key={g._id}>
                      <Link to={`/game/multiplayer/${g._id}`}>
                        Game {g._id}
                      </Link>
                      <span> You vs. {opp.username}</span>
                      <span>Started: {fmt(g.startTime)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* 4. My Completed Games */}
          <section>
            <h3>My Completed Games</h3>
            {myCompletedGames.length === 0 ? (
              <p>You haven't completed any games yet.</p>
            ) : (
              <ul>
                {myCompletedGames.map((g) => {
                  const opp = g.player1._id === user.id ? g.player2 : g.player1;
                  const won = g.winner._id === user.id;
                  return (
                    <li key={g._id}>
                      <Link to={`/game/multiplayer/${g._id}`}>
                        Game {g._id}
                      </Link>
                      <span>You vs. {opp.username}</span>
                      {/* <span>Started: {fmt(g.startTime)}</span> */}
                      <span>Ended: {fmt(g.endTime)}</span>
                      <span>{won ? "You won" : "You lost"}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* 5. Other Games */}
          <section>
            <h3>Other Games</h3>
            {otherGames.length === 0 ? (
              <p>No other games available.</p>
            ) : (
              <ul>
                {otherGames.map((g) => (
                  <li key={g._id}>
                    <Link to={`/game/multiplayer/${g._id}`}>Game {g._id}</Link>
                    <span>
                      {g.player1.username} vs. {g.player2.username}
                    </span>
                    {g.status === "Completed" ? (
                      <>
                        {/* <span>Ended: {fmt(g.endTime)}</span> */}
                        <span>Winner: {g.winner.username}</span>
                      </>
                    ) : (
                      <span>Started: {fmt(g.startTime)}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <>
          {/* Anonymous Active Games */}
          <section>
            <h3>Active Games</h3>
            {activeAll.length === 0 ? (
              <p>No active games.</p>
            ) : (
              <ul>
                {activeAll.map((g) => (
                  <li key={g._id}>
                    <Link to={`/game/multiplayer/${g._id}`}>Game {g._id}</Link>
                    <span>
                      {g.player1.username} vs. {g.player2.username}
                    </span>
                    <span>Started: {fmt(g.startTime)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Anonymous Completed Games */}
          <section>
            <h3>Completed Games</h3>
            {completedAll.length === 0 ? (
              <p>No completed games.</p>
            ) : (
              <ul>
                {completedAll.map((g) => (
                  <li key={g._id}>
                    <Link to={`/game/multiplayer/${g._id}`}>Game {g._id}</Link>
                    <span>
                      {g.player1.username} vs. {g.player2.username}
                    </span>
                    <span>Ended: {fmt(g.endTime)}</span>
                    <span>Winner: {g.winner.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
