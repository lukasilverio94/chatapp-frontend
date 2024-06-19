import React from 'react';
import WebSocketManager from './WebSocketManager';
import MessageListCreateComponent from './MessageListCreateComponent';
import ChatRoomListCreateComponent from './ChatRoomListCreateComponent';

const App = () => {
  return (
    <WebSocketManager>
      <div className="App">
        <header className="App-header">
          <h1>Chat Application</h1>
        </header>
        <main>
          <MessageListCreateComponent />
          <ChatRoomListCreateComponent />
        </main>
      </div>
    </WebSocketManager>
  );
};

export default App;
