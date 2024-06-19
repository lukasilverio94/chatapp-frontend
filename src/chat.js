// Chat.js

import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './WebSocketManager';

const Chat = ({ receiverId }) => {
  const socket = useContext(WebSocketContext);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Fetch message history on mount
    socket.send(
      JSON.stringify({ type: 'fetch_messages', receiver_id: receiverId }),
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.messages) {
        setMessages(data.messages);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket, receiverId]);

  const sendMessage = () => {
    if (!socket || !messageInput.trim()) return;

    const messageData = {
      type: 'send_message',
      message: messageInput,
      receiver_id: receiverId,
    };
    socket.send(JSON.stringify(messageData));
    setMessageInput('');
  };

  return (
    <div>
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <p>
              {message.sender_id}: {message.content}
            </p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
