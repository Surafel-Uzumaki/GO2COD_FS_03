import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const Chat = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null); // Track the current user to chat with

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const decoded = jwtDecode(token);
        setLoggedInUser(decoded);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(
          response.data.filter((user) => user._id !== loggedInUser?._id)
        ); // Filter out the logged-in user
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchLoggedInUser();
    fetchUsers();
  }, [loggedInUser]);

  // Fetch the message history when a user is selected for chat
  const fetchMessages = async (receiverId) => {
    if (!loggedInUser) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${loggedInUser._id}/${receiverId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleChatClick = (userId) => {
    setCurrentChat(userId);
    fetchMessages(userId);
  };

  return (
    <div>
      <h1>Users</h1>
      {loggedInUser && <p>Logged in as: {loggedInUser.username}</p>}
      <ul>
        {users
          .filter((user) => user.userId != loggedInUser.userId)
          .map((user) => (
            <li key={user._id} onClick={() => handleChatClick(user._id)}>
              {user.username}
            </li>
          ))}
      </ul>
      {console.log({ loggedInUser })}

      {currentChat && (
        <div>
          <h2>
            Chat with {users.find((user) => user._id === currentChat)?.username}
          </h2>
          <div>
            {messages.map((msg) => (
              <div key={msg._id}>
                <p>
                  <strong>{msg.sender.username}:</strong> {msg.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
