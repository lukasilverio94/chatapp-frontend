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

  return (
    <div className="user-list">
      <h2>User List</h2>
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
    </div>
  );
};

export default UserList;
