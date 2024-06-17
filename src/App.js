import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoom from './ChatRooms';
import Home from './Home';
import ChatRooms from './ChatRooms'; // Correct import path

const App = () => (
  <Router>
    <Routes>
      <Route path="/chat/:roomName" element={<ChatRoom />} />
      <Route path="/chatrooms" element={<ChatRooms />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
