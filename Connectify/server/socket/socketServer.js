const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const onlineUsers = new Map();

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.userId = user._id.toString();
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.userId}`);

    onlineUsers.set(socket.userId, socket.id);

    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit("user_status", { userId, online: true });
    });

    // Lets any client ask "who's currently online" (used when opening the Messages page)
    socket.on("get_online_users", (callback) => {
      callback(Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("user_status", { userId: socket.userId, online: false });
      }
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

const emitToUser = (userId, event, data) => {
  const socketId = onlineUsers.get(userId.toString());
  if (socketId && io) {
    io.to(socketId).emit(event, data);
  }
};

const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

const getIO = () => io;

module.exports = { initSocket, emitToUser, emitToAll, getIO };
