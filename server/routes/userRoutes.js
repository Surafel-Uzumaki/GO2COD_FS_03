const express = require("express");
const User = require("../models/User");
const authenticateJWT = require("../middleware/authenticateJWT");
const router = express.Router();

router.get("/users", authenticateJWT, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.userId } },
      "username"
    );
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
