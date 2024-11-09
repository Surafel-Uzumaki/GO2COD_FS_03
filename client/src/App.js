import { Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; // Import Login component from src/login.js
import Register from "./components/Register";
import Chat from "./components/Chat";
// Import Chat component from src/components/chat.js

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
