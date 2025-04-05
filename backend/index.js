const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Connected User", socket.id);

  socket.on("user-message", (msg) => {
    console.log("📩 User message");
    const response = `Bot says: "${msg.toUpperCase()}"`;
    socket.emit("bot-response", response);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
