import React, { useState, useEffect } from 'react';

const NewChatRoom = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log('Received:', data);

        if (data.type === 'room_created') {
          const newRoom = { id: data.room_id, name: roomName };
          onRoomCreated(newRoom);
          setRoomName('');
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
  }, [ws, onRoomCreated, roomName]); // Include onRoomCreated and roomName in the dependency array

  const handleCreateRoom = () => {
    if (ws) {
      ws.send(
        JSON.stringify({
          type: 'create_room',
          room_name: roomName,
        }),
      );
    } else {
      console.error('WebSocket connection is not established');
    }
  };

  useEffect(() => {
    const newWs = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

    newWs.onopen = () => {
      console.log('WebSocket connection established');
      newWs.send(
        JSON.stringify({
          type: 'connection_established',
        }),
      );
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
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
