import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MessageSidebar from './MessageSidebar';
import UserList from './UserList';
import ChatRoom from './ChatRoom';
import './MessagesList.css'; // Renamed CSS file to MessagesList.css

const MessagesList = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [selectedRoom, setSelectedRoom] = useState({ id: null, type: null });

  const handleRoomSelect = (roomId, type) => {
    setSelectedRoom({ id: roomId, type: type });
  };

  const handleDirectMessageSelect = (receiver_id, type) => {
    setSelectedRoom({ id: receiver_id, type: 'direct' });
  };

  return (
    <div className="home-page">
      <div className="sidebar-left">
        <MessageSidebar onRoomSelect={handleRoomSelect} />
      </div>
      <div className="main-content">
        {selectedRoom.id ? (
          <ChatRoom roomId={selectedRoom.id} roomType={selectedRoom.type} />
        ) : (
          <div>Select a chat room to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
