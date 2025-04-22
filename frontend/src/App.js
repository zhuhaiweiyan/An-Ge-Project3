// src/App.js

import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RulesPage from "./pages/RulesPage";
import HighScoresPage from "./pages/HighScoresPage";
import AllGamesPage from "./pages/AllGamesPage";
import NewGameOptionsPage from "./pages/NewGameOptionsPage";
import MultiplayerSetupPage from "./pages/MultiplayerSetupPage";
import MultiplayerJoinSetupPage from "./pages/MultiplayerJoinSetupPage";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <>
      <NavBar />

      <div className="app-wrapper">
        <div className="main-content">
          <Routes>
            {/* Landing and Authentication */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Utility pages */}
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/highscores" element={<HighScoresPage />} />
            <Route path="/games" element={<AllGamesPage />} />
            <Route path="/new-game" element={<NewGameOptionsPage />} />
            <Route
              path="/multiplayer-setup"
              element={<MultiplayerSetupPage />}
            />
            <Route
              path="/multiplayer-setup/:gameId"
              element={<MultiplayerJoinSetupPage />}
            />
            <Route
              path="/multiplayer-join-setup/:gameId"
              element={<MultiplayerJoinSetupPage />}
            />

            {/* Single-player game pages */}
            <Route path="/game/" element={<GamePage mode="single" />} />
            
            {/* Multiplayer game page */}
            <Route
              path="/game/multiplayer/:gameId"
              element={<GamePage mode="multiplayer" />}
            />

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<p>Not Found Page</p>} />
          </Routes>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default App;
