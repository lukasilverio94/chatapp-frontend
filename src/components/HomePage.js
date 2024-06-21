import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authStore";
import { useNavigate } from "react-router-dom"; // Update the import statement
import NewChatRoom from "../NewChatRoom";
import ChatRooms from "../ChatRooms";
import ChatBox from "../ChatBox";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/chatMeetUp/fetch-chat-rooms/"
        );
        if (response.status === 200) {
          const fetchedRooms = Object.entries(response.data.rooms).map(
            ([id, name]) => ({ id, name })
          );
          setRooms(fetchedRooms);
        } else {
          throw new Error("Failed to fetch chat rooms");
        }
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomCreated = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
    setSelectedRoom(newRoom);
  };

  const handleSelectRoom = (roomId, roomName) => {
    setSelectedRoom({ id: roomId, name: roomName });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Use navigate instead of history.push
  };

  if (!isLoggedIn) {
    return (
      <Container>
        <h1>Please log in to access this page</h1>
        <Button variant="primary" onClick={() => navigate("/login")}>
          Login
        </Button>
      </Container>
    );
  }

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="left-panel">
          <h1>Welcome, {user.full_name}!</h1>
          <h2>Chat Rooms</h2>
          <ChatRooms rooms={rooms} onSelectRoom={handleSelectRoom} />
        </div>
        <div className="right-panel">
          {selectedRoom ? (
            <ChatBox roomId={selectedRoom.id} roomName={selectedRoom.name} />
          ) : (
            <h2>Select a chat room to start chatting</h2>
          )}
        </div>
      </div>
      <div className="footer">
        <NewChatRoom onRoomCreated={handleRoomCreated} />
      </div>
      <Button
        variant="primary"
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </Button>
    </div>
  );
};

export default Home;
