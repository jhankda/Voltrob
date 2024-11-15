// src/hooks/useSocket.js
import { useEffect, useState } from 'react';
import {logMessage} from '../MessageDisplay.jsx';

const randomColor = () =>{
  return  `hsl(${Math.random() * 360}, 70%, 70%)`;
}
let user = "";
const useSocket = (url) => {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log('Connection established');
    };

    newSocket.onmessage = (message) => {
      
      if(user==""){
        user  = message.data;
        logMessage('hey there '+ user,randomColor());
      }
      else{
        const data  = message.data
        const newMessage  = JSON.parse(data)
        logMessage(newMessage.user+":  "+newMessage.message , randomColor())
      }
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
      const data = {user, message}
      socket.send(JSON.stringify(data));
      console.log(`: ${user}`);
    } else {
      console.log('WebSocket is not connected');
    }
  };

  return { socket, sendMessage };
};

export default useSocket;
