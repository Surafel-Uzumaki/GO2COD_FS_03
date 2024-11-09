const express = require("express");
const Message = require("../models/Message"); // Assuming you have a Message model
const router = express.Router();

// Route to get message history between two users
router.get("/messages/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Fetch messages where the sender and receiver are either the sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate("sender", "username") // Populate sender with username
      .populate("receiver", "username") // Optionally populate receiver with username
      .sort({ createdAt: 1 }); // Sort messages by creation date (ascending)

    res.json(messages); // Return the list of messages
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
