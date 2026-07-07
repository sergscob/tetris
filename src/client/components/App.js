import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import GameRoom from './GameRoom';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:room/:playerName" element={<GameRoom />} />
    </Routes>
  </BrowserRouter>
);

export default App;
