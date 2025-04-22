// frontend/src/pages/NewGameOptionsPage.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/NewGameOptionsPage.css"

const modes = [
  { key: "easy", label: "Single Player - Easy" },
  { key: "hard", label: "Single Player - Hard" },
  { key: "multiplayer", label: "Multiplayer" },
];

export default function NewGameOptionsPage() {
  const navigate = useNavigate();

  const handleSelect = (mode) => {
    if (mode === "multiplayer") {
      navigate("/multiplayer-setup");
    } else {
      navigate(`/game/${mode}`);
    }
  };

  return (
    <div className="options-page">
      <h2>Select Game Mode</h2>
      <div className="options-list">
        {modes.map((m) => (
          <button key={m.key} onClick={() => handleSelect(m.key)}>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
