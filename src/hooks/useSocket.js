// src/hooks/useSocket.js
import { useEffect, useState } from 'react';

const useSocket = (url) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log('Connection established');
    };

    newSocket.onmessage = (message) => {
      console.log('Message received:', message.data);
      // Use callback or state here to handle messages if needed
    };

    newSocket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.log('WebSocket is not connected');
    }
  };

  return { socket, sendMessage };
};

export default useSocket;
