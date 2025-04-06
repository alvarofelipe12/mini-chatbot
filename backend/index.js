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
    socket.emit("bot-typing");

    console.log("📩 User message");
    setTimeout(() => {
      const response = msg.toUpperCase();
      socket.emit("bot-response", response);
    }, 1000);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
