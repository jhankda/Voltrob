// src/components/MessageManager.js
import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';

const MessageManager = ({ onNewUser, onUpdateUser }) => {
  const { socket, sendMessage } = useSocket('ws://localhost:8080');
  const [latestMessage, setLatestMessage] = useState("");

  const handleSendMessage = () => {
    if (latestMessage !== "") {
      const chatMessage = JSON.stringify({
        type: 'chat',
        message: latestMessage,
      });
      sendMessage(chatMessage);
      setLatestMessage(""); 
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        // Handle position updates
        if (data.type === 'position') {
          if (data.newUser) {
            onNewUser(data); // Create a new sphere for the new user
          } else {
            onUpdateUser(data); // Update the position of an existing sphere
          }
        }

        if (data.type === 'chat') {
          console.log('Chat message:', data.message);
          // You could display chat messages here, or pass them to a chat UI component
        }
      };
    }
  }, [socket, onNewUser, onUpdateUser]);

  return (
    <div>
      <input
        type="text"
        value={latestMessage}
        onChange={(e) => setLatestMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default MessageManager;