// src/socket.js or wherever you handle socket connections
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true, // Include credentials in requests
});

export default socket;
