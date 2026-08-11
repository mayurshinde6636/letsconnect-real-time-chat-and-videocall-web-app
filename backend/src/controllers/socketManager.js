import { Server } from "socket.io";

const connections = {};
const messages = {};
const timeOnline = {};

const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User Connected:", socket.id);

    // User joins a meeting
    socket.on("join-call", (path) => {

      if (connections[path] === undefined) {
        connections[path] = [];
      }

      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      // Notify existing users
      for (let i = 0; i < connections[path].length; i++) {
        io.to(connections[path][i]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }

      // Send previous chat messages
      if (messages[path] !== undefined) {
        for (let i = 0; i < messages[path].length; i++) {
          socket.emit(
            "chat-message",
            messages[path][i].data,
            messages[path][i].sender,
            messages[path][i]["socket-id-sender"]
          );
        }
      }

    });

    // WebRTC Offer
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    // Chat
    socket.on("chat-message", (data, sender) => {

      let room = null;

      for (const [key, value] of Object.entries(connections)) {
        if (value.includes(socket.id)) {
          room = key;
          break;
        }
      }

      if (room) {

        if (messages[room] === undefined) {
          messages[room] = [];
        }

        messages[room].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });

        connections[room].forEach((id) => {
          io.to(id).emit(
            "chat-message",
            data,
            sender,
            socket.id
          );
        });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {

      console.log("🔴 User Disconnected:", socket.id);

      for (const [key, value] of Object.entries(connections)) {

        if (value.includes(socket.id)) {

          connections[key].forEach((id) => {
            io.to(id).emit("user-left", socket.id);
          });

          const index = connections[key].indexOf(socket.id);

          if (index !== -1) {
            connections[key].splice(index, 1);
          }

          if (connections[key].length === 0) {
            delete connections[key];
            delete messages[key];
          }
        }
      }

      delete timeOnline[socket.id];
    });
  });

  return io;
};

export default connectToSocket;