import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ListGroup,
  InputGroup,
  FormControl,
  Button,
  Dropdown,
  Spinner,
  Alert,
  Modal,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import './MessagesList.css';
import Message from '../assets/images/message/message.png';
import ChatWindow from './ChatWindow';
import { jwtDecode } from 'jwt-decode';

const MessagesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [individualMessages, setIndividualMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [users, setUsers] = useState([]); // State to store the list of all users
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false); // State to manage user dropdown visibility

  // Function to fetch individual messages
  const fetchIndividualMessages = async () => {
    setLoading(true);
    try {
      const access_token = localStorage.getItem('access_token');
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      const response = await axios.get(
        'http://localhost:8000/chatMeetUp/Conversations/',
        config,
      );
      setIndividualMessages(response.data);
      console.log('setIndividualMessages', response.data);
    } catch (error) {
      console.error('Error fetching individual messages:', error);
      setError('Error fetching individual messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch group messages
  const fetchGroupMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:8000/chatMeetUp/chatrooms/',
      );
      setGroupMessages(response.data);
    } catch (error) {
      console.error('Error fetching group messages:', error);
      setError('Error fetching group messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all users
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/auth/users');
      const users = response.data;
      setUsers(users);
      setShowUserDropdown(true);
    } catch (error) {
      console.error('Error fetching all users:', error);
      setError('Error fetching all users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable no-undef */
  const handleGenerateRoomId = (receiverId) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const currentUser_id = decodedToken.user_id;

        // Ensure receiverId and user1_id are strings
        const receiverIdStr = String(receiverId);
        const currentUserIdStr = String(currentUser_id);

        // Convert UUID strings to BigInt for XOR operation
        const bigintReceiver = BigInt(`0x${receiverIdStr.replace(/-/g, '')}`);
        const bigintCurrentUser = BigInt(
          `0x${currentUserIdStr.replace(/-/g, '')}`,
        );

        // XOR operation
        const xorResult = bigintReceiver ^ bigintCurrentUser;

        // Convert the result back to a UUID string format
        const xorResultHex = xorResult.toString(16);
        const roomId = `${xorResultHex.substr(0, 8)}-${xorResultHex.substr(
          8,
          4,
        )}-${xorResultHex.substr(12, 4)}-${xorResultHex.substr(
          16,
          4,
        )}-${xorResultHex.substr(20)}`;

        console.log('currentUser_id', currentUser_id);
        console.log('receiverId', receiverId);
        console.log('receiverIdStr', receiverIdStr);
        console.log('currentUserIdStr', currentUserIdStr);
        console.log('roomId', roomId);

        handleSelectChat(roomId);
      } catch (error) {
        console.error('Error decoding access token:', error);
      }
    } else {
      console.error('Access token not found');
    }
  };
  /* eslint-enable no-undef */

  // Function to handle selecting a chat
  const handleSelectChat = (roomId) => {
    setSelectedRoom(roomId);
  };

  // Function to handle user selection from the pop-up
  const handleUserSelect = (user) => {
    setShowUserDropdown(false);
    handleGenerateRoomId(user.id); // Pass user ID to handleGenerateRoomId
  };

  // Function to filter individual messages based on search query
  const filteredIndividualMessages = individualMessages.filter((user) =>
    user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Function to filter group messages based on search query
  const filteredGroupMessages = groupMessages.filter((room) =>
    room.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate total filtered messages count
  const totalFilteredMessages =
    filteredIndividualMessages.length + filteredGroupMessages.length;

  // Call fetchIndividualMessages and fetchGroupMessages when component mounts
  useEffect(() => {
    fetchIndividualMessages();
    fetchGroupMessages();
  }, []);

  return (
    <Container fluid className="messages-container">
      <Row>
        <Col md={4} className="messages-list">
          <div className="header-container">
            <div className="messages-header">
              <p>
                Messages{' '}
                <span className="message-count">{totalFilteredMessages}</span>
              </p>
            </div>
            <InputGroup className="search-input-group">
              <FormControl
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                className="add-button"
                onClick={fetchAllUsers}
              >
                +
              </Button>
            </InputGroup>
            <div className="message-sort-dropdown">
              <span>Sort by </span>
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-basic"
                  className="message-dropdown-toggle"
                >
                  Newest
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Newest</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Oldest</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="all-messages">
              <img src={Message} className="message-img" alt="logo" />
              <p>ALL MESSAGES</p>
            </div>
          </div>
          {loading ? (
            <div className="loading-spinner">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <ListGroup>
              <ListGroup.Item disabled className="list-group-header">
                INDIVIDUAL MESSAGES
              </ListGroup.Item>
              {filteredIndividualMessages.map((user, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  active={selectedRoom === user.id}
                  onClick={() => handleGenerateRoomId(user.id)}
                >
                  <img
                    src={user.photo}
                    alt={user.first_name}
                    className="profile-img"
                  />
                  {user.first_name}{' '}
                  <span className="subtext">{user.last_message?.content}</span>
                  <span className="time-text">
                    {user.last_message?.timestamp}
                  </span>
                </ListGroup.Item>
              ))}
              <ListGroup.Item disabled className="list-group-header">
                GROUP MESSAGES
              </ListGroup.Item>
              {filteredGroupMessages.map((room, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  active={selectedRoom === room.id}
                  onClick={() => handleSelectChat(room.id)}
                >
                  <img
                    src={room.photo}
                    alt={room.name}
                    className="profile-img"
                  />
                  {room.name} <span className="subtext">{room.subtext}</span>
                  <span className="time-text">{room.time}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={8} className="chat-window">
          {selectedRoom ? (
            <ChatWindow
              roomId={selectedRoom}
              accessToken={localStorage.getItem('access_token')}
            />
          ) : (
            <div className="no-chat-selected">
              Select a chat to start messaging
            </div>
          )}
        </Col>
      </Row>
      <Modal show={showUserDropdown} onHide={() => setShowUserDropdown(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select a User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {users.map((user, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => handleUserSelect(user)}
            >
              <img
                src={user.photo}
                alt={user.first_name}
                className="profile-img"
              />
              {user.first_name} {user.last_name}
            </ListGroup.Item>
          ))}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MessagesList;
