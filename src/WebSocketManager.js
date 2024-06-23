import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatRoomWrapper = ({ roomId }) => {
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchRoomName = async () => {
      if (!roomId) return;

      try {
        const response = await axios.get(
          `http://localhost:8000/chatrooms/${roomId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          },
        );
        setRoomName(response.data.name);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('Room not found:', error);
        } else {
          console.error('Error fetching room name:', error);
        }
      }
    };

    const initWebSocket = () => {
      if (!roomId) return;

      const token = localStorage.getItem('access_token');
      socketRef.current = new WebSocket(
        `ws://localhost:8000/ws/chatroom/${roomId}/?token=${token}`,
      );

      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
      };

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received:', message);
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

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId]);

  const sendMessage = (message) => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      const user = JSON.parse(localStorage.getItem('user')); // Fetch user info as needed
      const username = user ? user.username : 'Anonymous';
      const messageData = { message, username };

      socketRef.current.send(JSON.stringify(messageData));
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
