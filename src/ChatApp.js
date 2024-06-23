// Assuming you have a component structure like this:

// ChatApp.js or equivalent main component
import React, { useState, useEffect } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import UserList from './UserList'; // Assuming you have a UserList component

const ChatApp = () => {
  const [selectedRecipient, setSelectedRecipient] = useState(null); // State to store selected recipient

  const handleRecipientSelect = (userId) => {
    setSelectedRecipient(userId);
  };

  return (
    <div>
      <div className="user-list">
        <UserList onSelect={handleRecipientSelect} />{' '}
        {/* Pass onSelect function to UserList */}
      </div>
      <div className="chat-room">
        <ChatMessageList recipient={selectedRecipient} />{' '}
        {/* Pass selected recipient to ChatMessageList */}
        <ChatInput recipient={selectedRecipient} />{' '}
        {/* Pass selected recipient to ChatInput */}
      </div>
    </div>
  );
};

export default ChatApp;
