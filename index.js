const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"] 
  }
});

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected.`);

    socket.on('message', (message) => {
      console.log( message);
        io.emit('message', message);
    });


    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
