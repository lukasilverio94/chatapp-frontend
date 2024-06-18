import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBox = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatSocketRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/chatMeetUp/fetch-messages/',
          {
            params: {
              roomId: roomId,
            },
          },
        );
        if (response.status === 200) {
          setMessages(response.data.messages);
        } else {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      const chatSocket = new WebSocket(
        `ws://localhost:8000/ws/chat/${roomId}/`,
      );

      chatSocket.onopen = () => {
        console.log('WebSocket connected');
      };

      chatSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setMessages((prevMessages) => [...prevMessages, data.message]);
      };

      chatSocket.onclose = (e) => {
        if (!e.wasClean) {
          console.error('WebSocket closed unexpectedly:', e.code, e.reason);
        }
      };

      chatSocket.onerror = (e) => {
        console.error('WebSocket error:', e);
      };

      chatSocketRef.current = chatSocket;

      return () => {
        chatSocket.close();
      };
    }
  }, [roomId]);

  const handleSendMessage = () => {
    if (chatSocketRef.current.readyState === WebSocket.OPEN) {
      chatSocketRef.current.send(JSON.stringify({ message: newMessage }));
      setNewMessage('');
    } else {
      console.error('WebSocket is not open');
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
