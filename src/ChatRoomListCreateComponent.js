import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatRoomListCreateComponent = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('/api/chatrooms/'); // Adjust URL as per your setup
        setChatRooms(response.data);
      } catch (error) {
        setError(error.message); // Log or handle the error appropriately
      }
    };

    fetchChatRooms();
  }, []);

  if (error) {
    return <div>Error fetching chat rooms: {error}</div>;
  }

  return (
    <div>
      <h2>Chat Rooms</h2>
      <ul>
        {chatRooms.map((room) => (
          <li key={room.id}>
            <strong>{room.name}</strong> - {room.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomListCreateComponent;
