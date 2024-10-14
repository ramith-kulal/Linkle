const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

let waitingUsers = []; // Format: [{ socketId, interest }]
let activeConnections = {};

// Handle client connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle chat messages
  socket.on('chatMessage', (message) => {
    const partnerId = activeConnections[socket.id];
    if (partnerId) {
      io.to(partnerId).emit('chatMessage', message);
    }
  });

  // Handle user search for a new connection
  socket.on('findNewUser', (interest = null) => {
    let partnerFound = false;

    if (waitingUsers.length > 0) {
      // Try to find a user with the same interest or without
      for (let i = 0; i < waitingUsers.length; i++) {
        const partner = waitingUsers[i];
        if ((partner.interest === interest || !interest) && partner.socketId !== socket.id) {
          activeConnections[socket.id] = partner.socketId;
          activeConnections[partner.socketId] = socket.id;

          // Notify both users of their connection
          io.to(socket.id).emit('connected', { message: 'You are connected to a new user!' });
          io.to(partner.socketId).emit('connected', { message: 'You are connected to a new user!' });

          waitingUsers.splice(i, 1); // Remove partner from waiting list
          partnerFound = true;
          break;
        }
      }
    }

    if (!partnerFound) {
      waitingUsers.push({ socketId: socket.id, interest });
      io.to(socket.id).emit('connected', { message: 'Waiting for another user to connect...' });
    }
  });

  // Handle user disconnection through disconnectUser event
  socket.on('disconnectUser', () => {
    handleDisconnection(socket);
  });

  // Handle user disconnection when socket disconnects naturally
  socket.on('disconnect', () => {
    handleDisconnection(socket);
  });

  // Helper function for handling disconnection
  function handleDisconnection(socket) {
    const partnerId = activeConnections[socket.id];
    if (partnerId) {
      io.to(partnerId).emit('disconnected', { message: 'User disconnected. You can search for a new user...' });

      // Remove connection references
      delete activeConnections[partnerId];
      delete activeConnections[socket.id];
    }

    // Remove the disconnected user from the waiting list (if they were waiting)
    waitingUsers = waitingUsers.filter((user) => user.socketId !== socket.id);
  }
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
