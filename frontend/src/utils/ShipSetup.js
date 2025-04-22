// src/utils/ShipSetup.js

import React, { useState } from "react";
import { generateBoard } from "./ShipPlacement";

/**
 * ShipSetup component for manual ship placement in multiplayer.
 * Calls props.onComplete(board) when setup is done.
 */
export default function ShipSetup({ onComplete }) {
  // Four ships to place
  const initialShips = [
    { id: "Carrier", name: "Carrier", length: 5 },
    { id: "Battleship", name: "Battleship", length: 4 },
    { id: "Cruiser", name: "Cruiser", length: 3 },
    { id: "Destroyer", name: "Destroyer", length: 2 },
  ];

  const [shipsToPlace, setShipsToPlace] = useState(initialShips);
  const [placedShips, setPlacedShips] = useState([]);
  const [orientation, setOrientation] = useState("horizontal");
  const [hoveredCells, setHoveredCells] = useState([]);
  const [hoverValid, setHoverValid] = useState(false);

  // See if a ship of given length & orientation fits at (row,col)
  const isValidPlacement = (row, col, length, orient) => {
    const cells = [];
    if (orient === "horizontal") {
      if (col + length > 10) return false;
      for (let c = col; c < col + length; c++) cells.push(`${row}-${c}`);
    } else {
      if (row + length > 10) return false;
      for (let r = row; r < row + length; r++) cells.push(`${r}-${col}`);
    }
    // check against already placed ships
    for (let ship of placedShips) {
      const occupied = [];
      if (ship.orientation === "horizontal") {
        for (let c = ship.col; c < ship.col + ship.length; c++) {
          occupied.push(`${ship.row}-${c}`);
        }
      } else {
        for (let r = ship.row; r < ship.row + ship.length; r++) {
          occupied.push(`${r}-${ship.col}`);
        }
      }
      if (cells.some((cell) => occupied.includes(cell))) return false;
    }
    return true;
  };

  // Drag & drop handlers
  const handleDragStart = (e, ship, fromPlaced = false) => {
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.setData("shipData", JSON.stringify(ship));

    if (fromPlaced) {
      setPlacedShips((ps) => ps.filter((s) => s.id !== ship.id));
      setShipsToPlace((sp) =>
        sp.find((s) => s.id === ship.id)
          ? sp
          : [...sp, { id: ship.id, name: ship.name, length: ship.length }]
      );
    }
    setHoveredCells([]);
    setHoverValid(false);
  };

  const handleCellDragOver = (e, row, col) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("shipData");
    if (!data) {
      setHoveredCells([]);
      setHoverValid(false);
      return;
    }
    const ship = JSON.parse(data);
    const cells = [];
    for (let i = 0; i < ship.length; i++) {
      const r = orientation === "horizontal" ? row : row + i;
      const c = orientation === "horizontal" ? col + i : col;
      cells.push(`${r}-${c}`);
    }
    const valid = isValidPlacement(row, col, ship.length, orientation);
    setHoveredCells(cells);
    setHoverValid(valid);
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("shipData");
    if (!data) return;
    const ship = JSON.parse(data);
    if (!isValidPlacement(row, col, ship.length, orientation)) {
      setHoveredCells([]);
      setHoverValid(false);
      return;
    }
    setPlacedShips((ps) => [...ps, { ...ship, orientation, row, col }]);
    setShipsToPlace((sp) => sp.filter((s) => s.id !== ship.id));
    setHoveredCells([]);
    setHoverValid(false);
  };

  // Button handlers
  const toggleOrientation = () =>
    setOrientation((o) => (o === "horizontal" ? "vertical" : "horizontal"));

  const handleAutoPlace = () => {
    const SIZE = 10;
    const shipLengths = [5, 4, 3, 2];
    const MAX_RETRIES = 10;
    let placed = [];
    let boardCopy = null;

    const findShip = (length) => {
      // horizontal
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c <= SIZE - length; c++) {
          let ok = true;
          for (let i = 0; i < length; i++) {
            if (!boardCopy[r][c + i].hasShip) {
              ok = false;
              break;
            }
          }
          if (ok) {
            for (let i = 0; i < length; i++) {
              boardCopy[r][c + i].hasShip = false;
            }
            return { row: r, col: c, orientation: "horizontal", length };
          }
        }
      }
      // vertical
      for (let c = 0; c < SIZE; c++) {
        for (let r = 0; r <= SIZE - length; r++) {
          let ok = true;
          for (let i = 0; i < length; i++) {
            if (!boardCopy[r + i][c].hasShip) {
              ok = false;
              break;
            }
          }
          if (ok) {
            for (let i = 0; i < length; i++) {
              boardCopy[r + i][c].hasShip = false;
            }
            return { row: r, col: c, orientation: "vertical", length };
          }
        }
      }
      return null;
    };

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const randomBoard = generateBoard();
      boardCopy = randomBoard.map((row) => row.map((cell) => ({ ...cell })));
      placed = [];
      for (let len of shipLengths) {
        const ship = findShip(len);
        if (ship) placed.push(ship);
        else break;
      }

      if (placed.length === shipLengths.length) {
        break;
      }
    }

    // 4. If we didn't find exactly four ships, show error
    if (placed.length !== shipLengths.length) {
      alert("Auto placement failed. Please try again.");
      return;
    }

    // 5. Commit the extracted ships into our UI state
    setPlacedShips(placed);
    setShipsToPlace([]); // all ships have been placed
    setHoveredCells([]); // clear any hover
    setHoverValid(false); // reset hover validity
  };

  const handleClearBoard = () => {
    setPlacedShips([]);
    setShipsToPlace(initialShips);
    setHoveredCells([]);
    setHoverValid(false);
  };

  // When user clicks “Complete Setup”
  const handleCompleteSetup = () => {
    if (shipsToPlace.length > 0) {
      alert("Please place all ships before starting the game.");
      return;
    }
    // build empty 10×10 board
    const board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        hasShip: false,
        isHit: false,
        isMiss: false,
      }))
    );
    // place ships
    placedShips.forEach((ship) => {
      for (let i = 0; i < ship.length; i++) {
        const r = ship.orientation === "horizontal" ? ship.row : ship.row + i;
        const c = ship.orientation === "horizontal" ? ship.col + i : ship.col;
        board[r][c].hasShip = true;
      }
    });
    // invoke parent callback
    onComplete(board);
  };

  // Render grid with hover preview
  const renderBoard = () => {
    return Array.from({ length: 10 }, (_, r) => (
      <div key={r} style={{ display: "flex" }}>
        {Array.from({ length: 10 }, (_, c) => {
          const cellId = `${r}-${c}`;
          const occupied = placedShips.some((s) => {
            const inRow =
              s.orientation === "horizontal"
                ? s.row === r && c >= s.col && c < s.col + s.length
                : s.col === c && r >= s.row && r < s.row + s.length;
            return inRow;
          });
          let bg = occupied ? "gray" : "lightblue";
          if (hoveredCells.includes(cellId) && !occupied) {
            bg = hoverValid ? "green" : "red";
          }
          return (
            <div
              key={c}
              style={{
                width: 30,
                height: 30,
                border: "1px solid black",
                backgroundColor: bg,
                boxSizing: "border-box",
              }}
              draggable={occupied}
              onDragStart={(e) =>
                occupied &&
                handleDragStart(
                  e,
                  placedShips.find((s) =>
                    s.orientation === "horizontal"
                      ? s.row === r && c >= s.col && c < s.col + s.length
                      : s.col === c && r >= s.row && r < s.row + s.length
                  ),
                  true
                )
              }
              onDragOver={(e) => handleCellDragOver(e, r, c)}
              onDrop={(e) => handleDrop(e, r, c)}
              onClick={() => {
                // allow removal by click
                const ship = placedShips.find((s) =>
                  s.orientation === "horizontal"
                    ? s.row === r && c >= s.col && c < s.col + s.length
                    : s.col === c && r >= s.row && r < s.row + s.length
                );
                if (ship) {
                  setPlacedShips((ps) => ps.filter((s) => s.id !== ship.id));
                  setShipsToPlace((sp) => [
                    ...sp,
                    { id: ship.id, name: ship.name, length: ship.length },
                  ]);
                }
              }}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div className="ship-setup-container">
      <div className="ship-setup-left">{renderBoard()}</div>
      <div className="ship-setup-right">
        <h3>Ships to Place</h3>
        {shipsToPlace.map((ship) => (
          <div
            key={ship.id}
            draggable
            onDragStart={(e) => handleDragStart(e, ship)}
            style={{
              margin: 5,
              padding: 5,
              border: "1px solid #333",
              backgroundColor: "#ddd",
              cursor: "grab",
            }}
          >
            {ship.name} ({ship.length})
          </div>
        ))}
        <div className="setup-buttons">
          <button onClick={toggleOrientation}>
            Toggle Orientation ({orientation})
          </button>
          <button onClick={handleAutoPlace}>Auto Place</button>
          <button onClick={handleClearBoard}>Clear</button>
          <button
            onClick={handleCompleteSetup}
            disabled={shipsToPlace.length > 0}
          >
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );
}
