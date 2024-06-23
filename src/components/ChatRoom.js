import React, { useState } from 'react';

const ChatRoom = ({ roomId, messages, onSendMessage, onReceiveMessage }) => {
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) {
      setError('Message cannot be empty');
      return;
    }

    // Call parent component's sendMessage function
    onSendMessage(messageInput);

    // Clear message input after sending
    setMessageInput('');
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  // Example of handling incoming messages
  const handleReceiveMessage = (message) => {
    try {
      onReceiveMessage(message);
      setError(null); // Clear any previous errors on successful reception
    } catch (error) {
      console.error('Error processing received message:', error);
      setError('Error processing received message. Please try again.');
    }
  };

  return (
    <div>
      <h2>Messages for Room {roomId}</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {/* Display each message */}
            <strong>{index}</strong>: {msg}
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
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ChatRoom;
