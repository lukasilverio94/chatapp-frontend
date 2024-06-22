import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatRoom = ({ roomId }) => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/messages/?room=${roomId}`,
        );
        setMessages(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMessages();

    // Initialize WebSocket connection
    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/chatroom/${roomId}/`,
    );

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      // Cleanup: close WebSocket connection
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId]);

  const handleSendMessage = async () => {
    try {
      await axios.post('http://localhost:8000/messages/', {
        room: roomId,
        message: messageInput,
      });
      setMessageInput('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  if (error) {
    return <div>Error fetching messages: {error}</div>;
  }

  return (
    <div>
      <h2>Messages for Room {roomId}</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.user}</strong>: {msg.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={messageInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
