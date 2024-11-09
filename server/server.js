const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const Message = require("./models/Message");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors("*"));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

mongoose
  .connect("mongodb://localhost:27017/chat-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

connectDB();
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes); // User routes

io.on("connection", (socket) => {
  const token = socket.handshake.query.token;

  if (!token) {
    socket.emit("error", "No token provided");
    return;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Store the userId in the socket instance
    socket.userId = userId;
    console.log("User connected:", userId);

    socket.on("sendMessage", async (messageData) => {
      const { content } = messageData;

      if (!content) {
        console.error("Missing content in the message data");
        return;
      }

      try {
        // Create and save the message
        const newMessage = new Message({
          content,
          user: socket.userId, // Use the validated userId from the socket
        });

        const savedMessage = await newMessage.save();
        await savedMessage.populate("user", "username");

        io.emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    socket.emit("error", "Invalid token");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
