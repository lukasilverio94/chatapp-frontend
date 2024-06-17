import React, { useEffect, useState } from 'react';

const ChatRoom = ({ roomName }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  let chatSocket;

  useEffect(() => {
    chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    chatSocket.onclose = function (e) {
      console.error('Chat socket closed unexpectedly');
    };

    return () => {
      chatSocket.close();
    };
  }, [roomName]);

  const sendMessage = () => {
    chatSocket.send(
      JSON.stringify({
        message: message,
      }),
    );
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
