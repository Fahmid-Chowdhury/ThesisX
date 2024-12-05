//============= imports =================
import http from 'http';
import app from './app.js';
//=======================================

const server = http.createServer(app);

server.listen(process.env.PORT, ()=>{
    console.log("server listening at port", process.env.PORT)
});