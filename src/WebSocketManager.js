import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext(null);

const WebSocketManager = ({ children }) => {
  const [socket, setSocket] = useState({ chatSocket: null, notificationSocket: null });

  useEffect(() => {
    const chatSocket = new WebSocket('ws://localhost:8000/ws/chat/some_receiver_id/'); // Adjust WebSocket URL as necessary

    chatSocket.onopen = () => {
      console.log('WebSocket connection opened for chat');
      setSocket(prevSocket => ({ ...prevSocket, chatSocket }));
    };

    chatSocket.onclose = (event) => {
      console.log('WebSocket connection closed for chat', event);
    };

    chatSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    const notificationSocket = new WebSocket('ws://localhost:8000/ws/notifications/'); // Adjust WebSocket URL as necessary

    notificationSocket.onopen = () => {
      console.log('WebSocket connection opened for notifications');
      setSocket(prevSocket => ({ ...prevSocket, notificationSocket }));
    };

    notificationSocket.onclose = (event) => {
      console.log('WebSocket connection closed for notifications', event);
    };

    notificationSocket.onerror = (error) => {
      console.error('WebSocket error for notifications:', error);
    };

    return () => {
      chatSocket.close();
      notificationSocket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketManager;
