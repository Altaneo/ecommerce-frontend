import { useState } from "react";
import axios from "axios";

const LiveChat = ({ liveChatId }) => {
  const [message, setMessage] = useState("");
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const sendMessage = async () => {
    try {
      await axios.post(`${apiBaseUrl}/send-chat`, {
        message,
        liveChatId,
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-900 p-4 rounded-2xl shadow-lg text-white">
      <h2 className="text-lg font-semibold text-gray-200 mb-3">Live Chat</h2>

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-400"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 transition-all text-white font-medium rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
