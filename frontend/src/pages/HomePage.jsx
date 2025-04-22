// frontend/src/pages/HomePage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import battleshipImage from "../assets/images/battleship.jpg";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/new-game");
  };

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
        <button className="start-btn" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}
