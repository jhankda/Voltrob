const express = require('express');
const WebSocket = require('ws');
const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');


const app = express();
const httpServer  = app.listen({port:8080});
app.get("/",(req,res) => {
    res.send("hello world")
})

const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data, isBinary) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  
  
  
  let user  = (uniqueNamesGenerator({ dictionaries: [adjectives] })) + " " + uniqueNamesGenerator({ dictionaries: [animals] });
  //capitalize first letter of each word in user
  user = user.replace(/\b\w/g, l => l.toUpperCase());
  
  ws.send(user)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify({user:null,"message":`${user} has joined the chat`}));
    }
  });
  ws.on('close', () => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        client.send(JSON.stringify({user:null,"message":`${user} has left the chat`}));
      }
    });
  });
})
