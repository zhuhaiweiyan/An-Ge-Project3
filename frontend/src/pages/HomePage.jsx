// frontend/src/pages/HomePage.jsx

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import battleshipImage from "../assets/images/battleship.jpg";
import "../css/HomePage.css";

export default function HomePage() {
  const { user } = useContext(UserContext);

  return (
    <div className="container">
      <h1 className="title">Welcome to An Ge's Battleship!</h1>

      <div className="content">
        <p>
          A classic naval combat game where strategy and skill determine the
          winner.
        </p>
        <p>Get ready to outwit your opponent and sink their fleet!</p>
      </div>

      <div className="image-container">
        <img
          src={battleshipImage}
          alt="Battleship"
          className="battleship-image"
        />
      </div>

      <div className="button">
        {user ? (
          <Link to="/new-game">
            <button className="start-btn">Start Game</button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="start-btn">Login to Play</button>
          </Link>
        )}
      </div>
    </div>
  );
}
