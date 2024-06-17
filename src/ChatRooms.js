import React from 'react';

const ChatRooms = ({ rooms, onSelectRoom }) => {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return <p>No chat rooms available.</p>;
  }

  return (
    <div>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <button onClick={() => onSelectRoom(room.id, room.name)}>
              {room.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;
