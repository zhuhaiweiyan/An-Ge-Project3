# An Ge’s Battleship (Project 3)

A full-stack Battleship game with single-player (AI) and real-time multiplayer support, built with React, Node.js, Express, MongoDB, and JWT authentication.

---

## 🗂️ Repository Structure

```bash
/
/  
├── backend/                         # Server-side (Express + MongoDB)  
│   ├── controllers/                # Route handlers  
│   │   ├── authController.js       # register, login, logout, highscores logic  
│   │   └── gameController.js       # CRUD for games, moves, high-score processing  
│   ├── models/                     # Mongoose schemas  
│   │   ├── User.js                 # user schema: username, passwordHash, stats  
│   │   └── Game.js                 # game schema: boards, players, status, winner  
│   ├── routes/                     # Express routers  
│   │   ├── authRoutes.js           # mounts at /api/auth/*  
│   │   └── gameRoutes.js           # mounts at /api/games/*  
│   ├── middlewares/                # custom Express middleware  
│   │   └── authMiddleware.js       # JWT verification  
│   ├── config/                     # configuration files  
│   │   └── db.js                   # MongoDB connection setup  
│   └── server.js                   # Express app entrypoint & CORS config  
│  
└── frontend/                        # Client-side (React)  
    ├── public/                     # Static assets (index.html, favicon, etc.)  
    ├── src/                        # React source files  
    │   ├── api/                    # Axios instances & API wrappers  
    │   │   ├── axios.js            # baseURL & auth header interceptor  
    │   │   ├── auth.js             # register/login/logout wrappers  
    │   │   └── game.js             # getGame, makeMove, getHighScores  
    │   ├── components/             # Reusable UI components  
    │   │   ├── NavBar.jsx          # top navigation bar  
    │   │   ├── Board.jsx           # renders 10×10 Cell grid  
    │   │   └── Cell.jsx            # individual board cell styling  
    │   ├── contexts/               # React Contexts for global state  
    │   │   ├── UserContext.js      # holds user + JWT token  
    │   │   ├── SingleGameContext.js# single-player AI logic & timer  
    │   │   └── OnlineGameContext.js# multiplayer fetch/move polling  
    │   ├── pages/                  # Route components (one per URL)  
    │   │   ├── HomePage.jsx        # landing page  
    │   │   ├── LoginPage.jsx       # login form & error handling  
    │   │   ├── RegisterPage.jsx    # registration form & validation  
    │   │   ├── HighScoresPage.jsx  # leaderboard (sorted wins/losses)  
    │   │   ├── AllGamesPage.jsx    # lists open/active/completed games  
    │   │   ├── NewGameOptionsPage.jsx # choose single vs. multiplayer  
    │   │   ├── MultiplayerSetupPage.jsx      # place ships to start game  
    │   │   ├── MultiplayerJoinSetupPage.jsx  # place ships to join game  
    │   │   └── GamePage.jsx         # main game UI with boards & turn indicator  
    │   ├── utils/                   # helper components & functions  
    │   │   └── ShipSetup.js         # drag-and-drop ship placement  
    │   ├── css/                     # global & component styles  
    │   └── index.js                 # ReactDOM.render, wraps Router & Contexts  
    └── package.json                # project metadata & dependencies  
```



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
   ```

2. **Run Locally** 

    ```bash
    # backend
    npm run dev

    # frontend
    npm start
    ```

3. **Deployment (Render)** 

    # backend (web service)
    https://an-ge-project3.onrender.com

    # frontend (static site)
    https://an-ge-project3-1.onrender.com
