import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        setLoggedInUser(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    if (!loggedInUser) return;

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredUsers = response.data.filter(
          (user) => user._id !== loggedInUser._id
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  useEffect(() => {
    if (!loggedInUser) return;

    const socketConnection = io("http://localhost:5000", {
      query: { token: localStorage.getItem("token") },
    });
    setSocket(socketConnection);

    socketConnection.on("receiveMessage", (message) => {
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg._id === message._id)) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [loggedInUser]);

  const fetchMessages = async (receiverId) => {
    if (!loggedInUser || !receiverId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${loggedInUser._id}/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    if (!currentChat || !messageContent) return;

    const messageData = {
      content: messageContent,
      receiver: currentChat,
    };

    socket.emit("sendMessage", messageData);
    setMessageContent("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 p-4 bg-white border-r border-gray-300 flex flex-col justify-between">
        <div>
          <h1 className="text-lg font-semibold mb-4">Users</h1>
          {loggedInUser && (
            <p className="text-sm text-gray-500 mb-2">
              Logged in as: <strong>{loggedInUser.userId}</strong>
            </p>
          )}

          <ul className="space-y-2">
            {users.length > 0 ? (
              users.map((user) => (
                <li
                  key={user._id}
                  onClick={() => {
                    setCurrentChat(user._id);
                    fetchMessages(user._id);
                  }}
                  className={`p-2 cursor-pointer rounded-lg ${
                    currentChat === user._id
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-100 text-gray-700"
                  }`}
                >
                  {user.username}
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No other users available</p>
            )}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="w-3/4 p-4 flex flex-col justify-between">
        {currentChat ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Chat with{" "}
                {users.find((user) => user._id === currentChat)?.username}
              </h2>
              <div className="mt-4 h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg shadow-inner">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-2 mb-2 rounded-md ${
                      msg.sender._id === loggedInUser._id
                        ? "bg-blue-500 text-white text-right"
                        : "bg-gray-200 text-gray-900 text-left"
                    }`}
                  >
                    <p className="text-sm">
                      <strong>{msg.sender.username}:</strong> {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a user to start a chat</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
