const http = require('http');
const port = 1286;
const app = require('./app');

const server = http.createServer(app);

server.listen(port);