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

  /* ================= ADD NEW USER ================= */
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

  /* ================= SEND MESSAGE ================= */
  socket.on("sendMessage", (message) => {
    const recipient = onlineUsers.find(
      (user) => user.userId === message.recipientId,
    );

    const user = onlineUsers.find((user = user.userId === message.recipientId));

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
    if (recipient) {
      io.to(recipient.socketId).emit("getMessage", message);
    }
  });

  /* ================= DISCONNECT ================= */
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
