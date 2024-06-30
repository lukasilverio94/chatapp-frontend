// In UserList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';
const UserList = ({ onDirectMessageSelect }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://localhost:8000/api/auth/users',
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

  const handleDirectMessage = async (receiver_id) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/chat/',
        { receiver_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );
      console.log('Direct message initiated:', response.data);
    } catch (error) {
      console.error('Error initiating direct message:', error);
      setError('Error initiating direct message. Please try again.');
    }
  };

  return (
    <div className="user-list">
      <h2>User List</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-item">
            {user.first_name} {user.last_name} (ID: {user.id})
            <button onClick={() => handleDirectMessageSelect(user.id)}>
              Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
