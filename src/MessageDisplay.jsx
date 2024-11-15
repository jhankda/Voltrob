import React, { useState, useEffect, useRef } from 'react';
import './MessageDisplay.css';

let externalLogMessage;

const MessageDisplay = () => {
  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);

  const logMessage = (sender, message, color = '#fff') => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, { sender, text: message, color }];
      return newMessages.slice(-50); // Keep only the last 10 messages
    });
  };

  externalLogMessage = logMessage;

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-container" ref={messageContainerRef}>
      {messages.map((msg, index) => {
        const opacity = 1 - (messages.length - 1 - index) * 0.1;
        return (
          <div className="message" key={index} style={{ opacity: Math.max(opacity, 0.6) }}>
            <span className="sender" style={{ color: msg.color , opacity: Math.max(opacity, 0.4)}}>
              {msg.sender}
            </span>
            <span className="message-text" style={{color:msg.color}} >{msg.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export { externalLogMessage as logMessage };
export default MessageDisplay;
