import React, { useState, useEffect, useRef } from 'react';
import './ChatRoom.css';
import WebSocketService from './WebSocketService'; // Import WebSocketService

const ChatRoom = ({ roomId, roomType }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');
  const [roomName, setRoomName] = useState('');

  // Ref for messages container to scroll to bottom
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Function to clear messages
    const clearMessages = () => {
      setMessages([]);
    };

    // Function to fetch messages for the new room
    const fetchMessages = async (newRoomId) => {
      try {
        const fetchedMessages = await WebSocketService.fetchMessages(newRoomId);
        setMessages(fetchedMessages);
        scrollToBottom();
      } catch (error) {
        setError('Failed to fetch messages');
      }
    };

    // Clear messages and fetch new ones on roomId change
    clearMessages();
    fetchMessages(roomId);

    // Connect to WebSocket on component mount
    WebSocketService.connect(
      roomId,
      roomType,
      onMessageReceived,
      onRoomNameReceived,
      clearMessages,
    );

    // Clean up WebSocket connection on component unmount
    return () => {
      WebSocketService.close();
    };
  }, [roomId, roomType]);

  const onMessageReceived = (data) => {
    console.log('New message received', data);

    // Extract the actual message object from the nested structure
    const message = data.message;

    // Update messages state with the new message
    setMessages((prevMessages) => [...prevMessages, message]);

    // Display notification for the new message
    setNotification(
      `New message from ${message.sender_first_name}: ${message.content}`,
    );

    // Scroll to bottom when a new message is received
    scrollToBottom();
  };

  const onRoomNameReceived = (name) => {
    setRoomName(name);
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
      <h2>
        {roomType === 'chatroom' ? 'Chat Room' : 'Direct Message'}: {roomName}
      </h2>

      <div className="messages border rounded overflow-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.receiver_id === roomId ? 'receiver' : 'others'
            }  border p-3 mb-3 rounded`}
          >
            <p>
              <strong>{msg.sender_first_name}</strong>: {msg.content}
            </p>
            <p>
              <strong>Sender ID:</strong> {msg.sender_id}
            </p>
            {roomType === 'chatroom' && (
              <p>
                <strong>roomId:</strong> {roomId}
              </p>
            )}
            <p>
              <strong>receiver_id:</strong> {msg.receiver_id}
            </p>
            <p>
              <strong>Timestamp:</strong>{' '}
              {new Date(msg.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Is Read:</strong> {msg.un_read ? 'No' : 'Yes'}
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
