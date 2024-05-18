const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from this origin
    methods: ["GET", "POST"] // Allow only GET and POST requests
  }
});

// Define a map to store socket ids and their respective rooms
const socketRooms = new Map();

// Listen for connection events
io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected.`);

    // Listen for incoming messages and broadcast to all clients
    socket.on('message', (data) => {
        const {senderId, recipientId, message ,status,time,msgtype} = data;
        const recipientRoom = socketRooms.get(recipientId);
      
        var messagepack = {senderId,message,status,time,msgtype}
        console.log('pack: ', messagepack);
        if (recipientRoom) {
            io.to(recipientRoom).emit('message', messagepack);
        } else {
            console.log(`Recipient with ID ${recipientId} not found.`);
        }
    });

    // Store socket id in the user's room
    socket.on('joinRoom', (userId) => {
        console.log('userjoinedroom' + userId);
        
    
        socket.join(userId);
        console.log('Number of rooms: ', Object.keys(io.sockets.adapter.rooms).length);
        socketRooms.set(userId, socket.id);
    });
    

    // Clean up the socket on disconnect
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
        // Remove socket id from the room map
        socketRooms.forEach((value, key) => {
            if (value === socket.id) {
                socketRooms.delete(key);
            }
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
