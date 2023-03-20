const express = require('express')
const app = express()
const http = require('http').createServer(app);
var io = require('socket.io')(http);

const rooms = new Map()

io.on('connection', (socket) => {
  console.log('new client connected', socket.id);

  socket.on('user_join', ({roomName, user_name}) => {

    if(!rooms.has(roomName)) {
      rooms.set(roomName, new Set())
    }

    const users = rooms.get(roomName)
    users.add(user_name)
    socket.join(roomName)
    console.log('user_name ' + user_name + 'in room' + roomName);
    io.to(roomName).emit('user joined', {user_name, users:Array.from(users)})
    
  });

  socket.on('message', ({roomName, user_name, message}) => {
    console.log(user_name, message, socket.id);
    io.to(roomName).emit('message', {user_name, message});
  });

  socket.on('disconnect', () => {
    const users = rooms.get(roomName)
    users.delete(user_name)
    socket.leave(roomName)
    console.log('Disconnect Fired');
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
