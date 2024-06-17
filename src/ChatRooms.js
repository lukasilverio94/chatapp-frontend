import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatRooms = () => {
  const [rooms, setRooms] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8000/chatMeetUp/fetch-chat-rooms/');
        setRooms(response.data); // Update rooms with fetched data
        setLoading(false); // Turn off loading indicator
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Failed to fetch chat rooms. Please try again later.');
        setLoading(false); // Turn off loading indicator in case of error
      }
    };

    fetchRooms();
  }, []); // Empty dependency array means this effect runs only once

  if (loading) {
    return <p>Loading...</p>; // Render loading indicator while fetching data
  }

  if (error) {
    return <p>{error}</p>; // Render error message if data fetching fails
  }

  // Ensure rooms is an array before mapping over it
  if (!Array.isArray(rooms)) {
    return <p>No chat rooms available.</p>;
  }

  return (
    <div>
      <h2>Chat Rooms</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;
