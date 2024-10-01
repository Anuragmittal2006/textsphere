// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidV4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('createRoom', (roomId) => {
        socket.join(roomId);
        io.to(roomId).emit('roomCreated', roomId);
    });

    socket.on('joinRoom', (roomId, userName) => {
        socket.join(roomId);
        io.to(roomId).emit('userJoined', userName);
        socket.to(roomId).emit('userList', [...io.sockets.adapter.rooms.get(roomId)].map(id => io.sockets.sockets.get(id).userName));
    });

    // server.js

socket.on('sendMessage', (roomId, { message, timer }) => {
    io.to(roomId).emit('receiveMessage', { message, senderId: socket.id, timer }); // Include senderId
});


    socket.on('setUserName', (userName) => {
        socket.userName = userName;
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
