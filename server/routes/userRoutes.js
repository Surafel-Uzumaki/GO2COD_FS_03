const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to authenticate the JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token.");
    }
    req.user = user; // Store the decoded user in request
    next();
  });
};

// Get All Users Route - Exclude logged-in user
router.get("/users", authenticateJWT, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }, "username"); // Fetch all users except the logged-in user
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get Logged-in User's Data
router.get("/users", authenticateJWT, async (req, res) => {
  console.log("Logged-in user ID:", req.user._id); // Debugging log
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }, "username");
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
