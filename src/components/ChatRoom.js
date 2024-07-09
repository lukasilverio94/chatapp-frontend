import React, { useState, useEffect } from 'react';
import './ChatRoom.css';
import useWebSocket from 'react-use-websocket';

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState(null);
  const [roomName, setRoomName] = useState('');
  const accessToken = localStorage.getItem('access_token');
  const socketUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${accessToken}`;

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket connection established'),
    onClose: () => console.log('WebSocket connection closed'),
    onError: (error) => setError(`WebSocket error: ${error.message}`),
  });

  useEffect(() => {
    // Fetch messages when component mounts
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/chatMeetUp/messages/${roomId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        console.log(data)
        setMessages(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMessages();
  }, [roomId, accessToken]);

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data);
      console.log("message",message)
      if (message.roomName) {
        setRoomName(message.roomName);
      }

      if (message.message) {
        setMessages((prevMessages) => [...prevMessages, message.message]);
      }
    }
  }, [lastMessage]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) {
      setError('Message cannot be empty');
      return;
    }

    sendMessage(JSON.stringify({ message: messageInput }));
    setMessageInput('');
    setError(null);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  return (
    <div className="chat-room container">
      <h2>Chat Room: {roomName}</h2>

      <div className="messages border rounded overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className="message border p-3 mb-3 rounded">
            <p>
              <strong>{msg.sender_first_name}</strong>: {msg.content}
            </p>
            <p>
              <strong>Sender ID:</strong> {msg.sender_id}
            </p>
            <p>
              <strong>Receiver ID:</strong> {msg.receiver_id}
            </p>
            <p>
              <strong>Timestamp:</strong>{' '}
              {new Date(msg.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="message-form border-top mt-3 pt-3"
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
