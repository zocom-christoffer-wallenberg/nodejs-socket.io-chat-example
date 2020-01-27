const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('join', (username) => {
        socket.username = username;
        socket.broadcast.emit('user joined', username);
    });

    socket.on('new message', (message) => {
        const composedMessage = socket.username + ': ' + message;
        io.emit('send message', composedMessage);
    });

    socket.on('typing', () => {
        socket.broadcast.emit('is typing', socket.username);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('not typing');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

http.listen(port, () => {
    console.log('Server started on port:', port);
});