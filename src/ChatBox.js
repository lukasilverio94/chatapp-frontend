import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBox = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatSocketRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/chatMeetUp/fetch-messages/',
          { params: { roomId: roomId } },
        );
        if (response.status === 200) {
          setMessages(response.data.messages);
          setLoading(false);
        } else {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages. Please try again later.');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const chatSocket = new WebSocket(
      'ws://' + window.location.host + '/ws/chat/' + roomId + '/',
    );

    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    chatSocket.onclose = (e) => {
      console.error('Chat socket closed unexpectedly:', e);
      // Optionally, attempt to reconnect or notify the user
    };

    chatSocketRef.current = chatSocket;

    return () => {
      chatSocket.close();
    };
  }, [roomId]);

  const handleSendMessage = async () => {
    if (
      chatSocketRef.current &&
      chatSocketRef.current.readyState === WebSocket.OPEN
    ) {
      chatSocketRef.current.send(JSON.stringify({ message: newMessage }));
      setNewMessage('');
    } else {
      console.error(
        'WebSocket is not open. Ready state:',
        chatSocketRef.current?.readyState,
      );
      setError('WebSocket is not open. Please try again later.');
    }
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
