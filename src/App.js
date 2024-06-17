import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatBox from './ChatBox'; // Correct import path
import Home from './Home';
import ChatRooms from './ChatRooms'; // Correct import path

const App = () => (
  <Router>
    <Routes>
      <Route path="/chat/:roomName" element={<ChatBox />} />
      <Route path="/chatrooms" element={<ChatRooms />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
