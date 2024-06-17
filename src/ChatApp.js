import React, { useState } from 'react';
import ChatRoom from './ChatRoom'; // Adjust the path as per your project structure

const ChatApp = () => {
  const [currentRoom, setCurrentRoom] = useState('default-room'); // Initial room name

  const handleRoomChange = (newRoom) => {
    setCurrentRoom(newRoom);
  };

  return (
    <div className="chat-app">
      <div className="room-selection">
        {/* List of chat rooms */}
        <button onClick={() => handleRoomChange('room1')}>Room 1</button>
        <button onClick={() => handleRoomChange('room2')}>Room 2</button>
        <button onClick={() => handleRoomChange('room3')}>Room 3</button>
      </div>
      <div className="chat-room">
        {/* Display current chat room */}
        <ChatRoom roomName={currentRoom} />
      </div>
    </div>
  );
};

export default ChatApp;
