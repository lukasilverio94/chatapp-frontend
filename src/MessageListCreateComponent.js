import React, { useContext, useEffect } from 'react';
import { WebSocketContext } from './WebSocketManager';

const MessageListCreateComponent = () => {
  const { chatSocket, notificationSocket } = useContext(WebSocketContext);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.send(
        JSON.stringify({ message: 'Hello from client to server' }),
      );
    }
    if (notificationSocket) {
      notificationSocket.send(
        JSON.stringify({ message: 'Notification from client to server' }),
      );
    }
  }, [chatSocket, notificationSocket]);

  return <div>{/* Your component JSX */}</div>;
};

export default MessageListCreateComponent;
