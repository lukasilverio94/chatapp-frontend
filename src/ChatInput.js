// ChatInput.js or equivalent component for sending messages
import React, { useState } from 'react';
import { sendMessage } from './api'; // Assume you have an API function to send messages via WebSocket

const ChatInput = ({ recipient }) => {
  const [message, setMessage] = useState('');

  const handleMessageSend = () => {
    if (message.trim() === '') return; // Prevent sending empty messages

    const messageData = {
      message,
      recipient_id: recipient, // Include recipient_id in the message data
    };

    sendMessage(messageData); // Assuming sendMessage is a function to send message via WebSocket

    setMessage(''); // Clear input after sending message
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleMessageSend}>Send</button>
    </div>
  );
};

export default ChatInput;
