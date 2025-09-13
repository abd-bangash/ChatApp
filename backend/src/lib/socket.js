import {Server} from 'socket.io';
import http from 'http';
import express from "express";

const app = express();
const server = http.createServer(app);

const userSocketMap = {};


const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // no space, no trailing slash
    credentials: true,
  }
});

export function getRecieverId(userId){
  return userSocketMap[userId]
}

io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    console.log('A user connected',socket.id);
    socket.on('disconnect',()=>{
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));

        console.log('A user disconnected',socket.id)
    })
})

export {app, io, server}