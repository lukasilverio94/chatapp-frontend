import React, { useState } from 'react';
import axios from 'axios';

const NewChatRoom = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/chatMeetUp/create-chat-room/',
        { name: roomName },
      );
      if (response.status === 200) {
        // Assuming server responds with status 201 for successful creation
        const newRoom = { id: response.data.id, name: roomName };
        console.log(newRoom);
        onRoomCreated(newRoom); // Notify parent component with new room details
        setRoomName('');
      } else {
        throw new Error('Failed to create chat room');
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter room name"
      />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default NewChatRoom;
