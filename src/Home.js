import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewChatRoom from './NewChatRoom';
import ChatRooms from './ChatRooms';
import ChatBox from './ChatBox';
import './Home.css';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/chatMeetUp/fetch-chat-rooms/',
        );
        if (response.status === 200) {
          const fetchedRooms = Object.entries(response.data.rooms).map(
            ([id, name]) => ({
              id,
              name,
            }),
          );
          setRooms(fetchedRooms);
        } else {
          throw new Error('Failed to fetch chat rooms');
        }
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomCreated = (newRoom) => {
    setRooms([...rooms, newRoom]);
    setSelectedRoom(newRoom);
  };

  const handleSelectRoom = (roomId, roomName) => {
    setSelectedRoom({ id: roomId, name: roomName });
  };

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="left-panel">
          <h1>Chat Rooms</h1>
          <ChatRooms rooms={rooms} onSelectRoom={handleSelectRoom} />
        </div>
        <div className="right-panel">
          {selectedRoom ? (
            <ChatBox roomId={selectedRoom.id} roomName={selectedRoom.name} />
          ) : (
            <h2>Select a chat room to start chatting</h2>
          )}
        </div>
      </div>
      <div className="footer">
        <NewChatRoom onRoomCreated={handleRoomCreated} />
      </div>
    </div>
  );
};

export default Home;
