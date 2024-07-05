import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ListGroup,
  InputGroup,
  FormControl,
  Button,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import './ChatRoom.css';
import WebSocketService from './WebSocketService';

import Message from '../assets/images/message/message.png';
import Profilephoto1 from '../assets/images/message/profilephoto1.png';
import Profilephoto2 from '../assets/images/message/profilephoto2.png';

const MessageSidebar = ({ initialRoomId, initialRoomType, onRoomSelect }) => {
  const [conversations, setConversations] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [selectedRoomType, setSelectedRoomType] = useState(initialRoomType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    WebSocketService.connect(
      selectedRoomId,
      selectedRoomType,
      onMessageReceived,
      onRoomNameReceived,
      () => setConversations([])
    );

    fetchChatRooms();
    fetchConversations();
    return () => {
      WebSocketService.close();
    };
  }, [selectedRoomId, selectedRoomType]);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:8000/chatMeetUp/chatrooms/'
      );
      setChatRooms(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const access_token = localStorage.getItem('access_token');
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      const response = await axios.get(
        'http://localhost:8000/chatMeetUp/messages/',
        config
      );
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Error fetching conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddButtonClick = () => {
    fetchAllUsers();
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/auth/users');
      const users = response.data;
      setUsers(users);
      setShowUserDropdown(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all users:', error);
      setError('Error fetching all users. Please try again.');
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    console.log('Selected user:', user);
    // Handle user selection logic here, e.g., starting a new conversation
    setShowUserDropdown(false);
  };

  const onMessageReceived = (message) => {
    setConversations((prevConversations) => {
      const existingConversationIndex = prevConversations.findIndex(
        (conv) => conv.id === message.sender_id
      );

      if (existingConversationIndex !== -1) {
        const updatedConversations = [...prevConversations];
        updatedConversations[existingConversationIndex] = {
          ...updatedConversations[existingConversationIndex],
          lastMessage: message.content,
          timestamp: message.timestamp,
        };
        return updatedConversations;
      } else {
        return [
          ...prevConversations,
          {
            id: message.sender_id,
            name: message.sender_first_name,
            lastMessage: message.content,
            timestamp: message.timestamp,
          },
        ];
      }
    });
  };

  const onRoomNameReceived = (name) => {
    // This function might not be needed in the new design
  };

  const handleClick = (conversationId) => {
    console.log(`Clicked on conversation ${conversationId}`);
    onRoomSelect(conversationId, 'direct');
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
    setSelectedRoomType('chatroom');
    onRoomSelect(roomId, 'chatroom');
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setConversations((prevConversations) => {
      const sortedConversations = [...prevConversations];
      sortedConversations.sort((a, b) => {
        if (sortOption === 'Newest') {
          return new Date(b.timestamp) - new Date(a.timestamp);
        } else {
          return new Date(a.timestamp) - new Date(b.timestamp);
        }
      });
      return sortedConversations;
    });
  };

  const handleDirectMessageSelect = (receiver_id, type) => {
    setSelectedRoomId(receiver_id);
    setSelectedRoomType(type);
    onRoomSelect(receiver_id, type);
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        <div className="header-container">
          <div className="messages-header">
            <p>
              Messages{' '}
              <span className="message-count">{conversations.length}</span>
            </p>
          </div>
          <InputGroup className="search-input-group">
            <FormControl
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon2"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              className="add-button"
              onClick={handleAddButtonClick}
            >
              +
            </Button>
            {showUserDropdown && (
              <DropdownButton
                id="user-dropdown"
                title="Select User"
                className="user-dropdown"
              >
                {users.map((user) => (
                  <Dropdown.Item
                    key={user.id}
                    onClick={() => handleClick(user.id)}
                  >
                    {user.first_name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            )}
          </InputGroup>
          <div className="message-sort-dropdown">
            <span>Sort by </span>
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                className="message-dropdown-toggle"
              >
                {sortBy}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSortChange('Newest')}>
                  Newest
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortChange('Oldest')}>
                  Oldest
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="all-messages">
            <img src={Message} className="message-img" alt="logo" />
            <p>ALL MESSAGES</p>
          </div>
        </div>

        <h5>Direct Messages</h5>
        <ListGroup>
          {loading ? (
            <div>Loading conversations...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            conversations.map((conversation, index) => (
              <ListGroup.Item
                key={conversation.id}
                action
                onClick={() => handleClick(conversation.id)}
              >
                <img
                  src={index % 2 === 0 ? Profilephoto1 : Profilephoto2}
                  alt={conversation.name}
                  className="profile-img"
                />
                {conversation.name}{' '}
                <span className="subtext">{conversation.lastMessage}</span>
                <span className="time-text">
                  {conversation.timestamp &&
                    new Date(conversation.timestamp).toLocaleTimeString()}
                </span>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>

        <h5 className="mt-4">Chat Rooms</h5>
        {loading ? (
          <div>Loading chat rooms...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <ListGroup>
            {chatRooms.map((chatRoom) => (
              <ListGroup.Item
                key={chatRoom.id}
                action
                onClick={() => handleRoomSelect(chatRoom.id)}
              >
                <div className="chat-room">
                  <h6>{chatRoom.name}</h6>
                  <p className="mb-0">{chatRoom.description}</p>
                  <small>ID: {chatRoom.id}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default MessageSidebar;
