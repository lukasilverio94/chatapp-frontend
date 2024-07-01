// In ChatRoomListCreateComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatRoomListCreateComponent.css';

const ChatRoomListCreateComponent = ({ onRoomSelect }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:8000/chatMeetUp/chatrooms/',
        );
        setChatRooms(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  const handleRoomSelect = (roomId) => {
    onRoomSelect(roomId, 'chatroom');
  };

  return (
    <div className="chat-room-list">
      <h2>Chatrooms List</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {chatRooms.map((chatRoom) => (
        <button
          key={chatRoom.id}
          onClick={() => handleRoomSelect(chatRoom.id)}
          className="chat-room-button"
        >
          <div className="chat-room">
            <h3>{chatRoom.name}</h3>
            <p>{chatRoom.description}</p>
            <p>ID: {chatRoom.id}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChatRoomListCreateComponent;
