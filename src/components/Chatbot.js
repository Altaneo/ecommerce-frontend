import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import messageService from "../services/messageService";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ChatComponent = () => {
  const {t} =useTranslation()
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  axios.defaults.withCredentials = true;

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user (customer)
        const user = await axios.get(`${apiBaseUrl}/api/auth/profile`, {
          withCredentials: true,
        });
        setCurrentUser(user.data.user);

        // Fetch admin user
        const admins = await axios.get(`${apiBaseUrl}/api/auth/profiles`);
        const admin = admins.data.find((u) => u.role === "admin"); // Find the admin user
        setAdminUser(admin);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newSocket = io(`${apiBaseUrl}`);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (currentUser && adminUser) {
      const fetchMessages = async () => {
        try {
          const fetchedMessages = await messageService.getMessages(
            currentUser._id,
            adminUser._id
          );
          setMessages(fetchedMessages);
        } catch (error) {
          console.error("Failed to fetch messages", error);
        }
      };

      fetchMessages();

      socket?.emit("join_room", `${currentUser._id}-${adminUser._id}`);
    }
  }, [currentUser, adminUser, socket]);

  const sendMessage = async () => {
    if (newMessage.trim() && adminUser) {
      try {
        const message = await messageService.sendMessage(
          currentUser._id,
          adminUser._id,
          newMessage
        );

        socket.emit("send_message", {
          roomId: `${currentUser._id}-${adminUser._id}`,
          message,
        });

        setMessages([...messages, message]);
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  return (
    <>
      <div className="p-4 bg-white shadow-md">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          {t("CHAT_WITH_ADMIN")}
        </h1>
      </div>

      {/* Chat Section */}
      {adminUser ? (
        <div className="flex-1 flex flex-col justify-between p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`${msg.sender === currentUser._id
                      ? "self-end bg-purple-500 text-white"
                      : "self-start bg-gray-300 text-gray-800"
                    } px-4 py-2 rounded-lg max-w-xs`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t("MESSAGE_TYPE")}
            />
            <button
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
              onClick={sendMessage}
            >
              {t("SEND")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600">
          {t("LOADING_CHAT")}
        </div>
      )}
    </>
  );
};

export default ChatComponent;
