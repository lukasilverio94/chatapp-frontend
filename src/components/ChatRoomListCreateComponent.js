import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ChatRoomListCreateComponent = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/chatMeetUp/chatrooms/',
        );
        setChatRooms(response.data);
      } catch (error) {
        setError(error.message);
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
            <p>{room.id}</p>
            <Link
              to={`/chatroom/${room.id}?name=${encodeURIComponent(room.name)}`}
            >
              <strong>{room.name}</strong> - {room.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomListCreateComponent;
