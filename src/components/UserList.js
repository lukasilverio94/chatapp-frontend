import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../store/authStore"; // Adjust the import path as necessary

const UserList = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.user.token);
  const currentUser = useSelector((state) => {
    if (!state.auth.user) return null;
    const tokenPayload = JSON.parse(atob(state.auth.user.token.split(".")[1]));
    return tokenPayload.user_id;
  });

  console.log("Current user: ", currentUser);

  // Use selectCurrentUserId to correctly retrieve the current user's ID
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
  };

  return (
    <div>
      <h2>User List</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {users.map((user) => (
          <div key={user.id}>
            <li>
              {user.first_name} {user.last_name}
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
