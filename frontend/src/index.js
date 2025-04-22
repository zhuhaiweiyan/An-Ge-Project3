// frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import { SingleGameProvider } from "./contexts/SingleGameContext";
import { OnlineGameProvider } from "./contexts/OnlineGameContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <SingleGameProvider>
        <OnlineGameProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </OnlineGameProvider>
      </SingleGameProvider>
    </UserProvider>
  </React.StrictMode>
);
