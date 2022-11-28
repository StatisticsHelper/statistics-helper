const http = require('http');

const hostname = 'localhost';
const port = '8000';

const server = http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hello world\n");
});

server.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});