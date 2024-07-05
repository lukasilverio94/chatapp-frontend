import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';

const UserList = ({ onDirectMessageSelect }) => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Retrieve access_token from localStorage
        const access_token = localStorage.getItem('access_token');

        // Set headers with Authorization token
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };

        const response = await axios.get(
          'http://localhost:8000/chatMeetUp/messages/',
          config,
        );
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDirectMessageSelect = (receiver_id) => {
    onDirectMessageSelect(receiver_id, 'direct');
    console.log('Selected receiver_id:', receiver_id);
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/auth/users');
      setAllUsers(response.data);
      console.log('allUsers', response.data);
    } catch (error) {
      console.error('Error fetching all users:', error);
      setError('Error fetching all users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatButtonClick = () => {
    if (selectedUser) {
      handleDirectMessageSelect(selectedUser);
    } else {
      console.warn('No user selected');
    }
  };

  return (
    <div className="user-list">
      <h2>User List</h2>
      <button
        className="btn btn-primary btn-sml send-button"
        onClick={fetchAllUsers}
      >
        Fetch All Users
      </button>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-item">
            {user.first_name}
            <button
              className="btn btn-primary btn-sml send-button"
              onClick={() => handleDirectMessageSelect(user.id)}
            >
              Chat
            </button>
          </li>
        ))}
      </ul>

      {allUsers.length > 0 && (
        <div className="dropdown">
          <select onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Select a user</option>
            {allUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary btn-sml send-button"
            onClick={handleChatButtonClick}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
