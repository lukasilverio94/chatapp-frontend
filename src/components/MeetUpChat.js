import React, { useState, useContext, useEffect } from 'react';
import ChatRoomListCreateComponent from './ChatRoomListCreateComponent';
import UserList from './UserList';
import ChatRoom from './ChatRoom';
import './MeetUpChat.css';
import { AuthContext } from '../App';

const MeetUpChat = () => {
  const { isLoggedIn, user } = useContext(AuthContext); // Assuming AuthContext provides user information
  const [selectedRoom, setSelectedRoom] = useState({ id: null, type: null });
  const [userId, setUserId] = useState(null); // State to store user ID

  useEffect(() => {
    if (user) {
      setUserId(user.id); // Assuming user object has id property
    }
    console.log(user);
  }, [user]);

  const handleRoomSelect = (roomId, type) => {
    setSelectedRoom({ id: roomId, type: type });
  };

  const handleDirectMessageSelect = (receiver_id, type) => {
    // Assuming receiver_id should be used to start a direct message chat
    setSelectedRoom({ id: receiver_id, type: 'direct' });
  };

  return (
    <div className="home-page">
      <div className="sidebar-left">
        <ChatRoomListCreateComponent onRoomSelect={handleRoomSelect} />
      </div>
      <div className="main-content">
        {selectedRoom.id ? (
          <ChatRoom roomId={selectedRoom.id} roomType={selectedRoom.type} />
        ) : (
          <div>Select a chat room to start chatting</div>
        )}
      </div>
      <div className="sidebar-right">
        <UserList onDirectMessageSelect={handleDirectMessageSelect} />
      </div>
    </div>
  );
};

export default MeetUpChat;
