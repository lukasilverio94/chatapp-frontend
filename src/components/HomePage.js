import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import ChatRoomListCreateComponent from './ChatRoomListCreateComponent';
import ChatRoom from './ChatRoom'; // Import ChatRoom component
import styles from './Home.module.css'; // Ensure the path is correct
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isLoggedIn) {
    return (
      <Container>
        <h1>Please log in to access this page</h1>
        <Button variant="primary" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Container>
    );
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <h1>Welcome, {user?.full_name}!</h1>
          <ChatRoomListCreateComponent />
        </div>
        <div className={styles.rightPanel}>
          {/* Depending on your logic, display ChatRoom component */}
        </div>
      </div>
      <div className={styles.footer}>
        {/* If needed, include additional components */}
      </div>
      <Button
        variant="primary"
        onClick={handleLogout}
        className={styles.logoutButton}
      >
        Logout
      </Button>
    </div>
  );
};

export default Home;
