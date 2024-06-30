import React, { useState, useEffect } from 'react';
import './ChatRoom.css';
import WebSocketService from './WebSocketService'; // Import WebSocketService

const ChatRoom = ({ roomId, roomType }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to WebSocket on component mount
    WebSocketService.connect(roomId, roomType, onMessageReceived);

    // Clean up WebSocket connection on component unmount
    return () => {
      WebSocketService.close();
    };
  }, [roomId, roomType]);

  const onMessageReceived = (message) => {
    

    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) {
      setError('Message cannot be empty');
      return;
    }

    WebSocketService.sendMessage({ message: messageInput });
    setMessageInput('');
    setError(null);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  return (
    <div className="chat-room">
      <h2>Chat Room: {roomId}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${index % 2 === 0 ? 'even' : 'odd'}`}
          >
            <p>
              <strong>{msg.sender_first_name}</strong>: {msg.content}
            </p>
            <p>
              <strong>Sender ID:</strong> {msg.sender_id}
            </p>
            <p>
              <strong>Timestamp:</strong>{' '}
              {new Date(msg.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Is Read:</strong> {msg.is_read ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Delivery Status:</strong> {msg.delivery_status}
            </p>
            {msg.read_receipt && (
              <p>
                <strong>Read Receipt:</strong> {msg.read_receipt}
              </p>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={messageInput}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ChatRoom;
