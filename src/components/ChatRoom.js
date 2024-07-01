import React, { useState, useEffect, useRef } from 'react';
import './ChatRoom.css';
import WebSocketService from './WebSocketService'; // Import WebSocketService

const ChatRoom = ({ roomId, roomType }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');

  // Ref for messages container to scroll to bottom
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Function to clear messages
    const clearMessages = () => {
      setMessages([]);
    };

    // Connect to WebSocket on component mount
    WebSocketService.connect(
      roomId,
      roomType,
      onMessageReceived,
      clearMessages,
    );

    // Clean up WebSocket connection on component unmount
    return () => {
      WebSocketService.close();
    };
  }, [roomId, roomType]);

  useEffect(() => {
    // Scroll to bottom of messages container when messages state updates
    scrollToBottom();
  }, [messages]);

  const onMessageReceived = (message) => {
    console.log('New message received', message);

    // Update messages state with the new message
    setMessages((prevMessages) => [...prevMessages, message.message]);

    // Display notification for the new message
    setNotification(
      `New message from ${message.sender_first_name}: ${message.content}`,
    );
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-room container">
      <h2>Chat Room: {roomId}</h2>

      {/* Notification Section */}
      {notification && <div className="alert alert-info">{notification}</div>}

      <div className="messages border rounded overflow-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              index % 2 === 0 ? 'even' : 'odd'
            } border p-3 mb-3 rounded`}
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
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="message-form border-top border-top mt-3 pt-3"
      >
        <div className="input-group">
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="form-control message-input"
          />
          <button type="submit" className="btn btn-primary send-button">
            Send
          </button>
        </div>
        {error && <div className="error mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default ChatRoom;
