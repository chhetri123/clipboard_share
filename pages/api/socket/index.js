// pages/api/socket.js
import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket",
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("join-room", (userId) => {
      socket.join(userId);
    });
    socket.on("disconnect", () => {});
  });

  res.end();
};

export default SocketHandler;
