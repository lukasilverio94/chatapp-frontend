import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatRoomWrapper = ({ roomId }) => {
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchRoomName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chatrooms/${roomId}/`,
        );
        setRoomName(response.data.name); // Assuming the response contains the room name
      } catch (error) {
        console.error('Error fetching room name:', error);
      }
    };

    const initWebSocket = () => {
      // Connect to WebSocket
      socketRef.current = new WebSocket(
        `ws://localhost:8000/ws/chatroom/${roomId}/`,
      );

      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
      };

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received:', message);
        // Update messages state with received message
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
      };
    };

    fetchRoomName();
    initWebSocket();

    // Cleanup: close WebSocket connection
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId]);

  const sendMessage = (message) => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message }));
    } else {
      console.error('WebSocket is not open to send messages');
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default ChatRoomWrapper;
