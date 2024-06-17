import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewChatRoom = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState('');
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/chatMeetUp/get_csrf_token/',
          {
            withCredentials: true, // Send cookies along with the request
          },
        );
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreatingRoom(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/chatMeetUp/create-chat-room/',
        { name: roomName },
        {
          headers: {
            'X-CSRFToken': csrfToken, // Include CSRF token in headers
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Send cookies along with the request
        },
      );
      console.log(roomName);
      setCreatingRoom(false);
      setRoomName('');
      onRoomCreated(response.data);
    } catch (error) {
      console.error('Error creating chat room:', error);
      setError(error.response?.data?.message || error.message);
      setCreatingRoom(false);
    }
  };

  return (
    <div>
      <h2>Create a New Chat Room</h2>
      <form onSubmit={handleCreateRoom}>
        <label>
          Room Name:
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={creatingRoom}>
          {creatingRoom ? 'Creating...' : 'Create Room'}
        </button>
        {error && <p>Error: {error}</p>}
      </form>
    </div>
  );
};

export default NewChatRoom;
