import React, { useState, useEffect, useRef } from 'react';
import './MessageDisplay.css';

let externalLogMessage;

const MessageDisplay = () => {
  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);

  const logMessage = (message, color = '#fff') => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, { text: message, color }];
      return newMessages.slice(-40); // Keep only the last 10 messages
    });
  };



  externalLogMessage  = logMessage;

  useEffect(() => {
    // Scroll to the bottom whenever messages update
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-container" ref={messageContainerRef}>
      {messages.map((msg, index) => {
        // Calculate opacity for fading effect
        const opacity = 1 - (messages.length - 1 - index) * 0.1;
        return (
          <div
            className="message"
            key={index}
            style={{ color: msg.color, opacity: Math.max(opacity, 0.4) }} // Minimum opacity
          >
            {msg.text}
          </div>
        );
      })}
    </div>
  );
};

export default MessageDisplay;
export {externalLogMessage as logMessage}
