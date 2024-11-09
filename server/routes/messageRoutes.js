const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Fetch all messages
router.get("/messages", async (req, res) => {
  const { userId } = req.user; // Assume this is the logged-in user
  const { receiver } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver },
        { sender: receiver, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});
// Save new message (optional if you want a route)
router.post("/", async (req, res) => {
  const { content, userId } = req.body;

  try {
    const newMessage = new Message({
      content,
      user: userId,
    });
    const savedMessage = await newMessage.save();
    const populatedMessage = await savedMessage.populate("user", "username");
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Error saving message", error });
  }
});

module.exports = router;
