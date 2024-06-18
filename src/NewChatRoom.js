import React, { useState, useEffect } from 'react';

const NewChatRoom = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (message) => {
        console.log('Received:', message.data);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
  }, [ws]);

  const handleCreateRoom = () => {
    if (ws) {
      ws.send(JSON.stringify({
        type: 'create_room',
        room_name: roomName,
      }));
    } else {
      console.error('WebSocket connection is not established');
    }
  };

  useEffect(() => {
    const newWs = new WebSocket('ws://127.0.0.1:8000/ws/chat/');
    
    newWs.onopen = () => {
      console.log('WebSocket connection established');
      // You can send a message here if you want
      newWs.send(JSON.stringify({
        type: 'connection_established',
      }));
    };
  
    setWs(newWs);
  }, []);

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