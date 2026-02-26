const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }

    console.log("Online Users:", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
