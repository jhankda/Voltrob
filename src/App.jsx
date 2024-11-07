// src/App.jsx
import React, { useEffect, useState } from 'react';
import ThreeParticleSphere from './ParticleSphere';
import './App.css'; // Import your CSS file for styling
import MessageManager from './components/MessageManager'; // Import the message manager
import useSocket from './hooks/useSocket'; // Import your WebSocket hook

const App = () => {
  const { socket,sendMessage } = useSocket('ws://localhost:8080/');

  const [latestMessage, setlatestMessage] = useState("")

  const handleSendMessage = () => {
    console.log("::",latestMessage)
    sendMessage(latestMessage);
  };

  const [spherePosition, setSpherePosition] = useState({ xOffset: 0, yOffset: 0 });

  const broadcastPosition = (xOffset, yOffset) => {
    setSpherePosition({ xOffset, yOffset });
    const positionMessage = JSON.stringify({
      type: 'position',
      xOffset,
      yOffset,
    });
    sendMessage(positionMessage);
  };

  // Add a mousemove listener to detect position changes
  // useEffect(() => {
  //   const handleMouseMove = (event) => {
  //     const xOffset = event.clientX - window.innerWidth / 2;
  //     const yOffset = event.clientY - window.innerHeight / 2;
  //     broadcastPosition(xOffset, yOffset); // Broadcast directly here
  //   };

  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => {
  //     window.removeEventListener('mousemove', handleMouseMove); // Clean up on unmount
  //   };
  // }, []); // Empty dependency array to run only on mount

  return (
    <div style={styles.container}>
      <ThreeParticleSphere 
      />
      
      {/* Input Box positioned above the sphere */}
      <div style={styles.inputContainer}>
        <button onClick={handleSendMessage}>Send Message</button>
        <input 
          type="text" 
          placeholder="Chat" 
          style={styles.inputField} 
          onChange={(e) => {
            setlatestMessage(e.target.value)
          }}
        />
      </div>

      <MessageManager
        onNewUser={(message) => {
          const parsedMessage = JSON.parse(message);
          if (parsedMessage.type === 'position') {
            setSpherePosition({
              xOffset: parsedMessage.xOffset,
              yOffset: parsedMessage.yOffset,
            });
          }
        }}
        onUpdateUser={(message) => {
          const parsedMessage = JSON.parse(message);
          if (parsedMessage.type === 'position') {
            setSpherePosition({ 
              xOffset: parsedMessage.xOffset,
              yOffset: parsedMessage.yOffset,
            });
          }
        }}
      />
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  inputContainer: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputField: {
    width: '300px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    color: '#fff',
    textAlign: 'center',
    outline: 'none',
    fontSize: '1rem',
    backdropFilter: 'blur(5px)', // Optional: Adds a blur effect behind the input
  },
};

export default App;