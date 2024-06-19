import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './WebSocketManager';

const ChatComponent = () => {
  const { chatSocket } = useContext(WebSocketContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!chatSocket) return;

    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('Received message from WebSocket:', data);
    };

    return () => {
      chatSocket.onmessage = null;
    };
  }, [chatSocket]);

  const sendMessage = () => {
    if (chatSocket && message.trim() !== '') {
      chatSocket.send(
        JSON.stringify({ message, receiver_id: 'some_receiver_id' }),
      );
      setMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default ChatComponent;
