import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ChatRoom = ({ roomId, roomName }) => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const socket = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chatMeetUp/fetch-messages/${roomId}/`,
        );
        if (response.status === 200) {
          setMessages(response.data.messages);
        } else {
          throw new Error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.current = new WebSocket(
      'ws://localhost:8000/ws/chatroom/' + roomId + '/',
    );

    socket.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      socket.current.close();
    };
  }, [roomId]);

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const messageObject = {
      message: messageInput,
      username: user.username,
    };

    socket.current.send(JSON.stringify(messageObject));
    setMessageInput('');
  };

  return (
    <Container>
      <h2>{roomName}</h2>
      <ListGroup>
        {messages.map((message, index) => (
          <ListGroup.Item key={index}>
            <strong>{message.username}:</strong> {message.message}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form onSubmit={handleSendMessage} className="mt-3">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </Container>
  );
};

export default ChatRoom;
