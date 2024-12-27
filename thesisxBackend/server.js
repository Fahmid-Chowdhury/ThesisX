//============= imports =================
import http from 'http';
import { Server as SocketIOServer } from 'socket.io'; 
import app from './app.js';
import socketHandler from './socket.js'; 
//=======================================

const server = http.createServer(app);

const io = new SocketIOServer(server, {
    cors: {
        origin: "*", 
    },
});

socketHandler(io);

const PORT = process.env.PORT || 5000; 
server.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
