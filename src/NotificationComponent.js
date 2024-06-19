// Notification.js

import React, { useContext, useEffect } from 'react';
import { WebSocketContext } from './WebSocketManager';

const Notification = () => {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        alert(data.message); // Display notification in a more user-friendly manner
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  return null;
};

export default Notification;
