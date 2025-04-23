# An Ge’s Battleship (Project 3)

A full-stack Battleship game with single-player (AI) and real-time multiplayer support, built with React, Node.js, Express, MongoDB, and JWT authentication.

---

## 🗂️ Repository Structure

/ ├── backend │ ├── controllers │ │ ├── authController.js # handles register, login, logout, highscores │ │ └── gameController.js # CRUD for games, moves, high-score logic │ ├── models │ │ ├── User.js # user schema (username, password hash, wins/losses) │ │ └── Game.js # game schema (boards, players, status, winner) │ ├── routes │ │ ├── authRoutes.js # /api/auth/* │ │ └── gameRoutes.js # /api/games/* │ ├── middlewares │ │ └── authMiddleware.js # verifies JWT │ ├── config │ │ └── db.js # MongoDB connection │ └── server.js # Express app entrypoint └── frontend ├── public # static assets ├── src │ ├── api │ │ ├── axios.js # axios instance w/ baseURL & auth header │ │ ├── auth.js # register/login/logout wrappers │ │ └── game.js # getGame, makeMove, getHighScores │ ├── components │ │ ├── NavBar.jsx # dynamic nav based on login state │ │ ├── Board.jsx # renders a 10×10 grid of Cell │ │ └── Cell.jsx # individual grid cell, hit/miss styling │ ├── contexts │ │ ├── UserContext.js # global user + token store │ │ ├── SingleGameContext.js# single-player AI logic & timer │ │ └── OnlineGameContext.js# multiplayer fetch/move polling │ ├── pages │ │ ├── HomePage.jsx # landing page with Start/Login button │ │ ├── LoginPage.jsx # login form + error handling │ │ ├── RegisterPage.jsx # registration form + validation │ │ ├── HighScoresPage.jsx # sorted leaderboard (wins ↓, losses ↑, username) │ │ ├── AllGamesPage.jsx # lists open/active/completed games by category │ │ ├── NewGameOptionsPage.jsx# choose single vs. multiplayer │ │ ├── MultiplayerSetupPage.jsx # place ships to create game │ │ ├── MultiplayerJoinSetupPage.jsx# place ships to join game │ │ └── GamePage.jsx # main game UI with boards & turn indicator │ ├── utils │ │ └── ShipSetup.js # drag-and-drop ship placement component │ ├── css # styling for each component/page │ └── index.js # ReactDOM render, wraps providers & router └── package.json

---

## 🛠️ Tech Stack

- **Frontend**: React (hooks & context), React Router, Axios  
- **Styling**: CSS modules / plain CSS  
- **Backend**: Node.js, Express  
- **Database**: MongoDB with Mongoose ORM  
- **Authentication**: JWT in HTTP headers, `authMiddleware` for protected routes  
- **Deployment**: Render.com for both client and server  

---

## 🚀 Main Features & File Map

1. **User Authentication**  
   - `backend/controllers/authController.js`  
   - `backend/routes/authRoutes.js`  
   - `frontend/api/auth.js`, `LoginPage.jsx`, `RegisterPage.jsx`  
   - Password hashing, JWT issue/verify, logout endpoint  

2. **Game Lifecycle (Create / Join / Setup / Play)**  
   - `backend/controllers/gameController.js`  
   - `backend/routes/gameRoutes.js`  
   - `MultiplayerSetupPage.jsx` & `MultiplayerJoinSetupPage.jsx` (ship placement)  
   - `ShipSetup.js` (drag-drop UI)  
   - `GamePage.jsx`, `OnlineGameContext.js` (real-time polling for opponent moves)  

3. **Single-Player vs. AI**  
   - `SingleGameContext.js` handles both boards, AI “focused targeting” logic, game timer  
   - `GamePage.jsx` reuses same UI, just switches context  

4. **Leaderboard & History**  
   - `getHighScores` in `gameController.js`, sorted by wins, losses, username  
   - `HighScoresPage.jsx` displays username, wins, losses, computed score  
   - `AllGamesPage.jsx` shows five sections for logged-in users, two for guests  

5. **Global State & API**  
   - `UserContext.js` stores `user` + `token`, persists in `localStorage`  
   - `axios.js` centralizes base URL and attaches JWT automatically  
   - `game.js` wrappers for `/games/:id`, `/games/:id/move`, `/games/highscores`  

6. **UI/UX Enhancements**  
   - Responsive CSS in `GamePage.css` (flex layouts, turn indicators)  
   - CSS hover/pulse animations for game over banner  
   - Boards styled with hit/miss/ship classes in `Board.css` & `Cell.css`  

---

## 📝 Usage

1. **Install**  
   ```bash
   # in backend/
   npm install

   # in frontend/
   npm install

2. **Run Locally** 

# backend
npm run dev

# frontend
npm start

3. **Deployment (Render)** 

# backend (web service)
https://an-ge-project3.onrender.com

# frontend (static site)
https://an-ge-project3-1.onrender.com
