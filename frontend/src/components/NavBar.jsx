// frontend/src/components/NavBar.jsx

import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import "../css/NavBar.css";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    setUser(null);
    navigate("/");
  };

  const handleNewGame = () => {
    navigate("/new-game");
  };

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          An Ge's Battleship
        </Link>
      </div>

      <nav className="navbar-links">
        <Link
          to="/"
          className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>

        <Link
          to="/games"
          className={`nav-item ${
            location.pathname === "/games" ? "active" : ""
          }`}
        >
          Games
        </Link>

        <Link
          to="/rules"
          className={`nav-item ${
            location.pathname === "/rules" ? "active" : ""
          }`}
        >
          Rules
        </Link>

        <Link
          to="/highscores"
          className={`nav-item ${
            location.pathname === "/highscores" ? "active" : ""
          }`}
        >
          History
        </Link>

        {user ? (
          <>
            <span className="nav-item username">Hello, {user.username}</span>
            <button onClick={handleNewGame} className="nav-item btn-newgame">
              New Game
            </button>
            <button onClick={handleSignOut} className="nav-item btn-signout">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">
              Login
            </Link>
            <Link to="/register" className="nav-item">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
