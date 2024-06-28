import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../store/authStore"; // Import updateCurrentUserId here

const UserList = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const currentUserId = useSelector(selectCurrentUserId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleGenerateChatRoom = (selectedUserId) => {
    console.log(
      `Current user ID: ${currentUserId}, Selected user ID: ${selectedUserId}`
    );
    const chatRoomId = currentUserId ^ selectedUserId;
    console.log(chatRoomId);
  };

  return (
    <div>
      <h2>User List</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {users.map((user) => (
          <div key={user.id}>
            <li>
              {user.first_name} {user.last_name} {user.id}
            </li>
            <button onClick={() => handleGenerateChatRoom(user.id)}>
              Chat
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
