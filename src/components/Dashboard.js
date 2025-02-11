import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
const Dashboard = () => {
  const { broadcastId } = useParams();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const [chatMessages, setChatMessages] = useState([]);
  const [stream, setStream] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("live");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!broadcastId) return;
    const fetchData = async () => {
      try {
        // Fetch Live Stream Data and Check Live Status
        const [streamResponse,statusResponse] = await Promise.all([
          axios.get(`${apiBaseUrl}/live/${broadcastId}`),
          axios.get(`${apiBaseUrl}/api/check-live-status/${broadcastId}`)
        ]);
    
        setStream(streamResponse.data);
        setStatus(statusResponse.data.status);
    
        const { data: chatData } = await axios.get(`${apiBaseUrl}/get-live-chat/${broadcastId}`, { withCredentials: true });
        setChatMessages(chatData);
    
        await axios.put(`${apiBaseUrl}/live/update/${broadcastId}`, { status: statusResponse.data.status });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [broadcastId]);

  // Function to send a message to the YouTube live chat
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post(`${apiBaseUrl}/send-chat`, { message }, { withCredentials: true });
      setMessage("");
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (status === "complete") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-lg font-semibold">Live stream Over</div>
      </div>
    );
  }
console.log(stream.liveChatId,"stream=======")
  return (
    <div className="p-6 mt-24">
      <h1 className="text-2xl font-bold mb-4">Live Stream Dashboard</h1>
      <div className="flex mt-4">
        <div className="w-3/4 pr-4"> 
          <iframe
            className="w-full h-80 md:h-96"
            src={`https://www.youtube.com/embed/${broadcastId}?autoplay=1`}
            title="Live Stream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="w-1/4 h-80 md:h-150"> {/* 30% Width for Live Chat */}
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/live_chat?v=${broadcastId}&embed_domain=localhost`}
            title="Live Chat"
            frameBorder="0"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>
      {/* <LiveChat liveVideoId={broadcastId} liveChatId={stream.liveChatId}/> */}
      {/* Product Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {stream?.products?.map((product, index) => (
          <ProductCard
            key={product._id || index}
            imageUrl={`${apiBaseUrl}${product.image}`}
            product={product}
            index={index}
            isVisible={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
