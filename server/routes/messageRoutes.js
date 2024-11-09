const express = require("express");
const Message = require("../models/Message");
const authenticateJWT = require("../middleware/authenticateJWT");
const router = express.Router();

router.get("/:senderId/:receiverId", authenticateJWT, async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate("sender", "username")
      .populate("receiver", "username")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
