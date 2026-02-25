const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });
io.on("connection", (socket) => {
  //
});
io.listen(3000);
