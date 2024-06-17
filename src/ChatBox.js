import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBox = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chatMeetUp/fetch-messages/${roomId}`,
        );
        if (response.status === 200) {
          setMessages(response.data.messages);
        } else {
          throw new Error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [roomId]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/chatMeetUp/send-message/${roomId}`,
        { message: newMessage },
      );
      if (response.status === 200) {
        setMessages([...messages, { text: newMessage }]);
        setNewMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
