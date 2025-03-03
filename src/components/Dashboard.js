import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const {t}=useTranslation()
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
        const [streamResponse, statusResponse] = await Promise.all([
          axios.get(`${apiBaseUrl}/live/${broadcastId}`),
          axios.get(`${apiBaseUrl}/api/check-live-status/${broadcastId}`),
        ]);

        setStream(streamResponse.data);
        setStatus(statusResponse.data.status);

        const { data: chatData } = await axios.get(
          `${apiBaseUrl}/get-live-chat/${broadcastId}`,
          { withCredentials: true }
        );
        setChatMessages(chatData);

        await axios.put(`${apiBaseUrl}/live/update/${broadcastId}`, {
          status: statusResponse.data.status,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [broadcastId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await axios.post(
        `${apiBaseUrl}/send-chat`,
        { message },
        { withCredentials: true }
      );
      setMessage("");
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "complete") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-lg font-semibold">{t("LIVE_STREAM_DASHBOARD")}</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 mt-16">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">{t("LIVE_STREAM_DASHBOARD")}</h1>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Video Section */}
        <div className="w-full md:w-3/4">
          <iframe
            className="w-full h-56 sm:h-72 md:h-96 rounded-lg"
            src={`https://www.youtube.com/embed/${broadcastId}?autoplay=1`}
            title="Live Stream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Chat Section */}
        <div className="w-full md:w-1/4">
          <iframe
            className="w-full h-56 sm:h-72 md:h-96 rounded-lg shadow-lg"
            src={`https://www.youtube.com/live_chat?v=${broadcastId}&embed_domain=localhost`}
            title="Live Chat"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Product Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
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
