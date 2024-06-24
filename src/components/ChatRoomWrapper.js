import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import axios from 'axios';

const ChatRoomWrapper = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const initWebSocket = async () => {
      if (!roomId) {
        console.error('Room ID is missing or undefined.');
        setError('Room ID is missing or undefined.');
        return;
      }

      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('JWT Token is missing');
        setError('JWT Token is missing');
        return;
      }

      // Fetch initial messages
      try {
        const response = await axios.get(
          `http://localhost:8000/api/chatroom/${roomId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setMessages(response.data.messages); // Assuming response.data.messages is an array
      } catch (fetchError) {
        console.error('Error fetching initial messages:', fetchError);
        setError('Error fetching initial messages. Please try again.');
      }

      const wsUrl = `ws://localhost:8000/ws/chatroom/${roomId}/?token=${token}`;

      try {
        if (socketRef.current) {
          socketRef.current.close();
        }

        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
          console.log('WebSocket connected');
          setError(null);
        };

        socketRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.message) {
              setMessages((prevMessages) => [...prevMessages, data.message]);
            } else if (data.messages) {
              setMessages(data.messages);
            }
            setError(null); // Clear any previous errors on successful reception
          } catch (error) {
            console.error('Error processing received message:', error);
            setError('Error processing received message. Please try again.');
          }
        };

        socketRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('WebSocket error occurred. Please try again.');
        };

        socketRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setError('WebSocket disconnected. Please check your connection.');
        };
      } catch (error) {
        console.error('WebSocket initialization error:', error);
        setError('WebSocket initialization error. Please try again.');
      }
    };

    initWebSocket();

    // Cleanup: close WebSocket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId]);

  const sendMessage = (message) => {
    if (!message.trim()) {
      console.error('Message cannot be empty');
      setError('Message cannot be empty');
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('JWT Token is missing');
          setError('JWT Token is missing');
          return;
        }

        const messagePayload = {
          message,
          token,
        };

        socketRef.current.send(JSON.stringify(messagePayload));
        setError(null); // Clear any previous errors on successful send
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Error sending message. Please try again.');
      }
    } else {
      console.error('WebSocket is not open to send messages');
      setError('WebSocket is not open to send messages. Please try again.');
    }
  };

  return (
    <div>
      {messages.length === 0 && !error && (
        <p>No messages available. Please check your connection.</p>
      )}
      <ChatRoom
        roomId={roomId}
        messages={messages}
        onSendMessage={sendMessage}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ChatRoomWrapper;
