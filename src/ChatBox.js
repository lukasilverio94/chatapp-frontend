import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBox = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [error, setError] = useState(null); // Initialize error state
  const chatSocketRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/chatMeetUp/fetch-messages/',
          {
            params: {
              roomId: roomId, // Ensure roomId is defined and passed correctly
            },
          },
        );
        if (response.status === 200) {
          setMessages(response.data.messages); // Update state with fetched messages
          setLoading(false); // Turn off loading indicator
        } else {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages. Please try again later.');
        setLoading(false); // Turn off loading indicator in case of error
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    // Establish WebSocket connection
    const chatSocket = new WebSocket(
      'ws://' + window.location.host + '/ws/chat/' + roomId + '/',
    );

    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    chatSocket.onclose = (e) => {
      console.error('Chat socket closed unexpectedly');
    };

    chatSocketRef.current = chatSocket;

    return () => {
      chatSocket.close();
    };
  }, [roomId]);

  const handleSendMessage = async () => {
    if (chatSocketRef.current) {
      if (chatSocketRef.current.readyState === WebSocket.OPEN) {
        chatSocketRef.current.send(JSON.stringify({ message: newMessage }));
        setNewMessage('');
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          chatSocketRef.current.readyState,
        );
        setError('WebSocket is not open. Please try again later.');
      }
    }
  };

  if (loading) {
    return <p>Loading messages...</p>; // Display loading indicator while fetching data
  }

  if (error) {
    return <p>Error: {error}</p>; // Display error message if data fetching or sending fails
  }

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
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
