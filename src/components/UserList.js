// UserList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from your API endpoint
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/auth/users',
        ); // Replace with your API endpoint for fetching users
        setUsers(response.data); // Assuming response.data is an array of users
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users. Please try again.');
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userId) => {
    onSelect(userId); // Pass selected userId to parent component (Home in this case)
  };

  return (
    <div>
      <h2>User List</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserSelect(user.id)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
