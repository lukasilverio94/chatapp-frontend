import React, { useState } from "react";
import { useSelector } from "react-redux";
import ChatRoomListCreateComponent from "./ChatRoomListCreateComponent";
import UserList from "./UserList";
import ChatRoom from "./ChatRoom";
import "./MeetUpChat.css";

const MeetUpChat = () => {
  // Use useSelector to access the isLoggedIn state from Redux store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [selectedRoom, setSelectedRoom] = useState({ id: null, type: null });

  const handleRoomSelect = (roomId, type) => {
    setSelectedRoom({ id: roomId, type: type });
  };

  const handleDirectMessageSelect = (receiver_id, type) => {
    setSelectedRoom({ id: receiver_id, type: "direct" });
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
