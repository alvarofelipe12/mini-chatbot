import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors);

const server = createServer(app);
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

server.listen(port, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
