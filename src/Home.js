// Home.js

import React from 'react';
import NewChatRoom from './NewChatRoom';
import ChatRooms from './ChatRooms';

const Home = () => {
  const handleRoomCreated = (newRoom) => {
    // Handle room creation (optional)
    console.log('New room created:', newRoom);
  };

  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      <NewChatRoom onRoomCreated={handleRoomCreated} />
      <ChatRooms />
    </div>
  );
};

export default Home;
