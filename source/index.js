import Express from 'express'
import path from 'path'
import socket from 'socket.io'
import http from 'http'

import config from './config'
import socketController from './controllers/socket-controller'

const express = Express()
const server = http.createServer(express)

express.use(Express.static(path.join('public')));

express.get('/', function (req, res) {
  res.sendFile(path.join('public', 'index.html'));
});

const io = socket(server, {
    cors: {
        origin: 'localhost:3000',
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on('connection', socket => socketController(io, socket))

server.listen(config.port, () => console.log('Listening port:', config.port))