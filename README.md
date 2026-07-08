*This project has been created as part of the 42 curriculum by sskobyak and irkalini.*

# red_tetris

## Description

The goal of this project is to develop a real-time multiplayer version of the classic Tetris game as a full-stack JavaScript web application. The project focuses on client-server communication, real-time synchronization, and state management while respecting the architectural constraints of the 42 Red Tetris subject. The application allows two players to compete simultaneously, with the game state synchronized through WebSockets to provide a responsive multiplayer experience. :contentReference[oaicite:0]{index=0}

### Features

* Real-time multiplayer gameplay
* WebSocket communication between clients and server
* Deterministic game synchronization
* Redux-based client state management
* Piece movement and rotation
* Soft drop and hard drop mechanics
* Game over detection and winner announcement
* Modern React-based user interface

---

## Instructions

Install the project dependencies:

```sh
npm install
```

Build the client:

```sh
npm run client-build
```

Start the development server:

```sh
npm run srv-dev
```

Open the application in your browser:

```sh
http://localhost:3004
```

---

## Resources

### Technologies

* JavaScript (ES6)
* Node.js
* React
* Redux
* Redux Thunk
* Socket.IO
* Webpack
* HTML5
* CSS3

### Articles & Tutorials

* [Redux documentation](https://redux.js.org/)
* [Introduction to React-Redux by GeeksforGeeks](https://www.geeksforgeeks.org/web-tech/introduction-to-react-redux/)

### AI Usage

AI tools were used as learning assistants to:

* clarify JavaScript, React, and Redux concepts;
* better understand WebSocket communication and state synchronization;
* review implementation ideas and debugging strategies;
* improve code readability and documentation quality.

All code was written, understood, tested, and validated by the author.
